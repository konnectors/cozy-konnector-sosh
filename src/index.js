/* eslint-disable no-console */

import { ContentScript } from 'cozy-clisk/dist/contentscript'
import Minilog from '@cozy/minilog'
import waitFor, { TimeoutError } from 'p-wait-for'
import ky from 'ky/umd'
import XhrInterceptor from './interceptor'
import { blobToBase64 } from 'cozy-clisk/dist/contentscript/utils'

const log = Minilog('ContentScript')
Minilog.enable('soshCCC')

const ORANGE_SPECIAL_HEADERS = {
  'X-Orange-Origin-Id': 'ECQ',
  'X-Orange-Caller-Id': 'ECQ'
}
const PDF_HEADERS = {
  Accept: 'application/pdf',
  'Content-Type': 'application/pdf'
}

const JSON_HEADERS = {
  Accept: 'application/json',
  'Content-Type': 'application/json'
}

const ERROR_URL = 'https://e.orange.fr/error403.html?ref=idme-ssr&status=error'
const BASE_URL = 'https://www.sosh.fr'
const DEFAULT_PAGE_URL = BASE_URL + '/client'
let FORCE_FETCH_ALL = false
const interceptor = new XhrInterceptor()
interceptor.init()

class SoshContentScript extends ContentScript {
  // ///////
  // PILOT//
  // ///////
  async onWorkerEvent({ event, payload }) {
    if (event === 'loginSubmit') {
      const { login, password } = payload || {}
      // When the user has chosen mobileConnect option, there is no password request
      // So wee need to check both separatly to ensure we got at least the user login
      if (login) {
        this.store.userCredentials = { ...this.store.userCredentials, login }
      }
      if (password) {
        this.store.userCredentials = { ...this.store.userCredentials, password }
      } else {
        this.log('warn', 'Did not manage to intercept credentials')
      }
    }
  }

  async onWorkerReady() {
    function addClickListener() {
      document.body.addEventListener('click', e => {
        const clickedElementId = e.target.getAttribute('id')
        const clickedElementContent = e.target.textContent
        if (
          clickedElementId === 'btnSubmit' &&
          clickedElementContent !== 'Continuer'
        ) {
          const login = document.querySelector(
            `[data-testid=selected-account-login]`
          )?.textContent
          const password = document.querySelector('#password')?.value
          this.bridge.emit('workerEvent', {
            event: 'loginSubmit',
            payload: { login, password }
          })
        }
      })
    }
    // Necessary here for the interception to cover every known scenarios
    // Doing so we ensure if the logout leads to the password step that the listener won't start until the user has filled up the login
    await this.waitForDomReady()
    if (
      !(await this.checkForElement('#remember')) &&
      (await this.checkForElement('[data-testid=selected-account-login]'))
    ) {
      this.log(
        'warn',
        'Cannot find the rememberMe checkbox, logout might not work as expected'
      )
    } else {
      const checkBox = document.querySelector('#remember')
      if (checkBox) {
        checkBox.click()
        // Setting the visibility to hidden on the parent to make the element disapear
        // preventing users to click it
        checkBox.parentNode.parentNode.style.visibility = 'hidden'
      }
    }
    this.log('info', 'adding listener')
    addClickListener.bind(this)()
  }

  async PromiseRaceWithError(promises, msg) {
    try {
      this.log('debug', msg)
      await Promise.race(promises)
    } catch (err) {
      this.log('error', err.message)
      throw new Error(`${msg} failed to meet conditions`)
    }
  }

  /**
   * Sometimes, depending on the device, button[data-testid="choose-other-account"] may not be clickable yet
   * we click on it until it disappears
   */
  async waitForUndefinedLabelReallyClicked() {
    await waitFor(
      function clickOnElementUntilItDisapear() {
        const elem = document.querySelector(
          'button[data-testid="choose-other-account"]'
        )
        if (elem) {
          elem.click()
          return false
        }
        return true
      },
      {
        interval: 1000,
        timeout: {
          milliseconds: 30 * 1000,
          message: new TimeoutError(
            `waitForUndefinedLabelReallyClicked timed out after ${30 * 1000}ms`
          )
        }
      }
    )
    return true
  }

  async ensureAuthenticated({ account }) {
    this.log('info', '🤖 ensureAuthenticated starts')
    this.bridge.addEventListener('workerEvent', this.onWorkerEvent.bind(this))
    await this.goto(BASE_URL)
    await this.runInWorkerUntilTrue({
      method: 'waitForNextState',
      args: [false],
      timeout: 30 * 1000
    })
    const wantedUserId = (await this.getCredentials())?.userId
    const currentUserId = await this.evaluateInWorker(
      () => window.o_idzone?.USER_DEFINED_MSISDN
    )
    const shouldChangeCurrentAccount =
      !account || currentUserId == null || wantedUserId !== currentUserId
    if (shouldChangeCurrentAccount) {
      await this.ensureNotAuthenticated()
      await this.waitForUserAuthentication()
    } else {
      this.log('debug', 'current user is the expected one, no need to logout')
    }
    return true
  }

  async getContracts() {
    return interceptor.userInfos.portfolio.contracts
      .map(contract => ({
        vendorId: contract.cid,
        brand: contract.brand.toLowerCase(),
        label: contract.offerName.match(/\d{1,3},\d{2}€/)
          ? contract.offerName.replace(/\s\d{1,3},\d{2}€/, '')
          : contract.offerName,
        type: contract.vertical.toLowerCase() === 'mobile' ? 'phone' : 'isp',
        holder: contract.holder,
        number: contract.telco.publicNumber
      }))
      .filter(contract => contract.brand === 'sosh')
  }

  getCurrentState() {
    // There is now two "elcosHeaders" element, one with a define class, the other without. We want he second
    const elcosHeaders = document.querySelector(
      'elcos-header[class=""]'
    )?.shadowRoot
    const isErrorUrl = window.location.href.includes('error')
    const isLoginPage = Boolean(document.querySelector('#login'))
    const isPasswordAlone = Boolean(
      document.querySelector('#password') && !isLoginPage
    )
    const isAccountList = Boolean(
      document.querySelector('button[data-testid="choose-other-account"]')
    )
    const isReloadButton = Boolean(
      document.querySelector('button[data-testid="button-reload"]')
    )
    const isKeepConnected = Boolean(
      document.querySelector('button[data-testid="button-keepconnected"]')
    )
    const isCaptcha = Boolean(
      document.querySelector('div[class*="captcha_responseContainer"]')
    )
    const isConnected = Boolean(
      elcosHeaders?.querySelector('a[title="Se déconnecter"]')
    )
    const isDisconnected = Boolean(
      elcosHeaders?.querySelector('a[title="Se connecter"]')
    )
    const isConsentPage = Boolean(
      document.querySelector('#didomi-notice-disagree-button')
    )
    const isMobileconnect = document.querySelector(
      'button[data-testid="submit-mc"]'
    )
    if (isErrorUrl) return 'errorPage'
    else if (isLoginPage) return 'loginPage'
    else if (isConnected) return 'connected'
    else if (isPasswordAlone) return 'passwordAlonePage'
    else if (isCaptcha) return 'captchaPage'
    else if (isKeepConnected) return 'keepConnectedPage'
    else if (isAccountList) return 'accountListPage'
    else if (isReloadButton) return 'reloadButtonPage'
    else if (isDisconnected) return 'disconnectedPage'
    else if (isConsentPage) return 'consentPage'
    else if (isMobileconnect) return 'mobileConnectPage'
    else return false
  }

  async triggerNextState(currentState) {
    if (currentState === 'errorPage') {
      this.log('error', `Got an error page: ${window.location.href}`)
      throw new Error(`VENDOR_DOWN`)
    } else if (currentState === 'consentPage') {
      await this.runInWorker('click', '#didomi-notice-disagree-button')
    } else if (currentState === 'loginPage') {
      return true
    } else if (currentState === 'connected') {
      await this.evaluateInWorker(() => {
        document
          .querySelector('elcos-header[class=""]')
          .shadowRoot.querySelector('a[title="Se déconnecter"]')
          .click()
      })
    } else if (
      currentState === 'passwordAlonePage' ||
      currentState === 'mobileConnectPage'
    ) {
      await this.waitForElementInWorker('[data-testid=change-account]')
      await this.runInWorker('click', '[data-testid=change-account]')
    } else if (currentState === 'captchaPage') {
      await this.handleCaptcha()
    } else if (currentState === 'keepConnectedPage') {
      await this.runInWorker(
        'click',
        'button[data-testid="button-keepconnected"]'
      )
    } else if (currentState === 'accountListPage') {
      await this.runInWorkerUntilTrue({
        method: 'waitForUndefinedLabelReallyClicked',
        timeout: 10 * 1000
      })
    } else if (currentState === 'reloadButtonPage') {
      await this.runInWorker('click', 'button[data-testid="button-reload"]')
    } else if (currentState === 'disconnectedPage') {
      await this.evaluateInWorker(() => {
        document
          .querySelector('elcos-header[class=""]')
          .shadowRoot.querySelector('a[title="Se connecter"]')
          .click()
      })
    } else {
      throw new Error(`Unknown page state: ${currentState}`)
    }
  }

  async waitForNextState(previousState) {
    let currentState
    await waitFor(
      () => {
        currentState = this.getCurrentState()
        this.log('info', 'waitForNextState: currentState ' + currentState)
        if (currentState === false) return false
        const result = previousState !== currentState
        return result
      },
      {
        interval: 1000,
        timeout: {
          milliseconds: 30 * 1000,
          message: new TimeoutError(
            `waitForNextState timed out after ${
              30 * 1000
            }ms waiting for a state different from ${previousState}`
          )
        }
      }
    )
    return currentState
  }

  async ensureNotAuthenticated() {
    this.log('info', '🤖 ensureNotAuthenticated starts')
    await this.goto(BASE_URL)
    await this.runInWorkerUntilTrue({
      method: 'waitForNextState',
      args: [false],
      timeout: 30 * 1000
    })
    const start = Date.now()
    let state = await this.runInWorker('getCurrentState')
    while (state !== 'loginPage') {
      this.log('debug', `current state: ${state}`)
      if (Date.now() - start > 300 * 1000) {
        throw new Error('ensureNotAuthenticated took more than 5m')
      }
      await this.triggerNextState(state)
      state = await this.runInWorkerUntilTrue({
        method: 'waitForNextState',
        args: [state],
        timeout: 20 * 1000
      })
    }
    return true
  }

  async checkAuthenticated() {
    const isGoodUrl = document.location.href.includes(DEFAULT_PAGE_URL)
    const elcosHeaders = document.querySelector(
      'elcos-header[class=""]'
    )?.shadowRoot

    const isConnectedElementPresent = Boolean(
      elcosHeaders?.querySelector('a[title="Se déconnecter"]')
    )
    const isDisconnectElementPresent = Boolean(
      elcosHeaders?.querySelector('a[title="Se connecter"]')
    )
    if (isGoodUrl) {
      if (isConnectedElementPresent) {
        this.log('info', 'Check Authenticated succeeded')
        return true
      }
      if (isDisconnectElementPresent) {
        this.log('info', 'Active session found, returning true')
        return true
      }
    } else {
      const isBaseUrl = document.location.href.match(BASE_URL)
      if (isBaseUrl && isDisconnectElementPresent) {
        this.log(
          'info',
          'Check Authenticated succeeded, but ended on the base url'
        )
        return true
      }
      return false
    }
  }

  async waitForUserAuthentication() {
    this.log('info', '🤖 waitForUserAuthentication start')
    await this.setWorkerState({ visible: true })
    const credentials = await this.getCredentials()
    this.runInWorker('autoFill', credentials)
    await this.runInWorkerUntilTrue({ method: 'waitForAuthenticated' })
    if (this.store.userCredentials) {
      this.store.userCredentials.userId = await this.evaluateInWorker(
        () => window.o_idzone?.USER_DEFINED_MSISDN
      )
    }
    await this.setWorkerState({ visible: false })
  }

  async waitForErrorUrl() {
    await this.runInWorkerUntilTrue({
      method: 'checkErrorUrl',
      timeout: 10 * 1000
    })
    this.log('error', `Found error url: ${ERROR_URL}`)
    throw new Error('VENDOR_DOWN')
  }

  async checkErrorUrl() {
    await waitFor(
      () => {
        return window.location.href === ERROR_URL
      },
      {
        interval: 1000,
        timeout: {
          milliseconds: 30 * 1000,
          message: new TimeoutError(
            `waitForErrorUrl timed out after ${30 * 1000}ms`
          )
        }
      }
    )
    return true
  }

  async handleCaptcha() {
    this.log('info', '📍️ handleCaptcha starts')
    const { askForCaptcha, captchaUrl } = await this.runInWorker(
      'checkForCaptcha'
    )
    if (askForCaptcha) {
      this.log('info', 'captcha found, waiting for resolution')
      await this.waitForUserAction(captchaUrl)
    }
  }

  async fetch(context) {
    this.log('info', '🤖 fetch start')
    const distanceInDays = await this.handleContextInfos(context)
    if (this.store.userCredentials != undefined) {
      await this.saveCredentials(this.store.userCredentials)
    }
    if (await this.isElementInWorker('#password')) {
      await this.evaluateInWorker(function reload() {
        document.location.reload()
      })
      await Promise.race([
        this.waitForElementInWorker('a', {
          includesText: 'Consulter votre facture'
        }),
        this.waitForElementInWorker('.dashboardConso__contracts li')
      ])
    }
    await this.goto('https://espace-client.orange.fr/accueil?sosh=')
    await this.waitForElementInWorker('ecm-section-bill')
    const contracts = await this.runInWorker('getContracts')
    if (!contracts.length) {
      this.log(
        'warn',
        'Seems like no Sosh contracts were found, check if the user is using an Orange account. Execution ended'
      )
      return true
    }
    for (const contract of contracts) {
      const { recentBills, oldBillsUrl } = await this.fetchRecentBills(
        contract.vendorId,
        distanceInDays
      )
      await this.saveBills(recentBills, {
        context,
        fileIdAttributes: ['vendorRef'],
        contentType: 'application/pdf',
        subPath: `${contract.number} - ${contract.label} - ${contract.vendorId}`,
        qualificationLabel:
          contract.type === 'phone' ? 'phone_invoice' : 'isp_invoice'
      })
      if (FORCE_FETCH_ALL && oldBillsUrl) {
        const oldBills = await this.fetchOldBills({
          oldBillsUrl,
          vendorId: contract.vendorId
        })
        await this.saveBills(oldBills, {
          context,
          fileIdAttributes: ['vendorRef'],
          contentType: 'application/pdf',
          subPath: `${contract.number} - ${contract.label} - ${contract.vendorId}`,
          qualificationLabel:
            contract.type === 'phone' ? 'phone_invoice' : 'isp_invoice'
        })
      }
    }

    await this.navigateToPersonalInfos()
    if (this.store.skippingIdentity) {
      this.log('warn', 'Identity scraping skipped')
      return true
    }
    await this.runInWorker('getIdentity')
    await this.saveIdentity({ contact: this.store.infosIdentity })
  }

  async handleContextInfos(context) {
    this.log('info', '📍️ handleContextInfos starts')
    const { trigger } = context
    // force fetch all data (the long way) when last trigger execution is older than 90 days
    // or when the last job was an error
    const isFirstJob =
      !trigger.current_state?.last_failure &&
      !trigger.current_state?.last_success
    const isLastJobError =
      !isFirstJob &&
      trigger.current_state?.last_failure > trigger.current_state?.last_success

    const hasLastExecution = Boolean(trigger.current_state?.last_execution)
    const distanceInDays = getDateDistanceInDays(
      trigger.current_state?.last_execution
    )
    this.log('debug', `distanceInDays: ${distanceInDays}`)
    if (distanceInDays >= 90 || !hasLastExecution || isLastJobError) {
      this.log('info', '🐢️ Long execution')
      this.log('debug', `isLastJobError: ${isLastJobError}`)
      this.log('debug', `hasLastExecution: ${hasLastExecution}`)
      FORCE_FETCH_ALL = true
    } else {
      this.log('info', '🐇️ Quick execution')
    }
    return distanceInDays
  }

  async fetchOldBills({ oldBillsUrl, vendorId }) {
    this.log('info', 'fetching old bills')
    const oldBills = await this.runInWorker(
      'getOldBillsFromWorker',
      oldBillsUrl
    )
    if (!oldBills) {
      this.log(
        'error',
        'Url seems to be valid, but something unexpected happened when fetching it'
      )
      throw new Error('UNKNOWN_ERROR.PARTIAL_SYNC')
    }
    const cid = vendorId

    const saveBillsEntries = []
    for (const bill of oldBills) {
      const { entityName, partitionKeyName, partitionKeyValue, tecId } = bill
      const amount = bill.amount / 100
      const vendorRef = tecId
      const fileurl = `https://espace-client.orange.fr/ecd_wp/facture/historicPDF?entityName=${entityName}&partitionKeyName=${partitionKeyName}&partitionKeyValue=${partitionKeyValue}&tecId=${tecId}&cid=${cid}`
      saveBillsEntries.push({
        vendor: 'sosh.fr',
        date: bill.date,
        amount,
        recurrence: 'monthly',
        vendorRef,
        filename: await this.runInWorker(
          'getFileName',
          bill.date,
          amount,
          vendorRef
        ),
        fileurl,
        requestOptions: {
          headers: {
            ...ORANGE_SPECIAL_HEADERS,
            ...PDF_HEADERS
          }
        },
        fileAttributes: {
          metadata: {
            invoiceNumber: vendorRef,
            contentAuthor: 'sosh',
            datetime: bill.date,
            datetimeLabel: 'startDate',
            isSubscription: true,
            startDate: bill.date,
            carbonCopy: true
          }
        }
      })
    }
    return saveBillsEntries
  }

  async fetchRecentBills(vendorId, distanceInDays) {
    await this.goto(
      'https://espace-client.orange.fr/facture-paiement/' + vendorId
    )
    await Promise.race([
      this.waitForElementInWorker('a[href*="/historique-des-factures"]'),
      this.waitForElementInWorker('span', {
        includesText: 'Pas de facture disponible'
      })
    ])
    if (
      await this.isElementInWorker('span', {
        includesText: 'Pas de facture disponible'
      })
    ) {
      this.log('warn', 'No bills to download for this contract')
      return { recentBills: [], oldBillsUrl: undefined }
    }
    await this.runInWorker('click', 'a[href*="/historique-des-factures"]')
    await this.PromiseRaceWithError(
      [
        this.runInWorkerUntilTrue({
          method: 'checkMoreBillsButton',
          timeout: 10 * 1000
        }),
        this.waitForElementInWorker('.alert-icon icon-error-severe'),
        this.waitForElementInWorker(
          '.alert-container alert-container-sm alert-danger mb-0'
        )
      ],
      'fetchRecentBills: show bills history'
    )

    let billsToFetch
    const recentBills = await this.runInWorker('getRecentBillsFromInterceptor')

    // Keep this log around for debug, to remove next time if not needed anymore
    this.log(
      'info',
      `Object.keys(recentBills) : ${JSON.stringify(Object.keys(recentBills))}`
    )
    this.log(
      'info',
      `Object.keys(recentBills.billsHistory) : ${JSON.stringify(
        Object.keys(recentBills.billsHistory)
      )}`
    )

    const saveBillsEntries = []
    if (!FORCE_FETCH_ALL) {
      const allRecentBills = recentBills.billsHistory.billList
      // FORCE_FETCH_ALL being define priorly, if we're meeting this condition,
      // we just need to look for 3 month back maximum.
      // In order to get the fastest execution possible, we're checking how many months we got to cover since last execution
      // as the website is providing one bill a month in most cases, while special cases will be covered from one month to another.
      let numberToFetch = Math.ceil(distanceInDays / 30)
      this.log(
        'info',
        `Fetching ${numberToFetch} ${numberToFetch > 1 ? 'bills' : 'bill'}`
      )
      billsToFetch = allRecentBills.slice(0, numberToFetch)
    } else {
      this.log('info', 'Fetching all bills')
      billsToFetch = recentBills.billsHistory.billList
    }
    for (const bill of billsToFetch) {
      const amount = bill.amount / 100
      const vendorRef = bill.id || bill.tecId
      saveBillsEntries.push({
        vendor: 'sosh.fr',
        date: bill.date,
        amount,
        recurrence: 'monthly',
        vendorRef,
        filename: await this.runInWorker(
          'getFileName',
          bill.date,
          amount,
          vendorRef
        ),
        fileurl:
          'https://espace-client.orange.fr/ecd_wp/facture/v1.0/pdf' +
          bill.hrefPdf,
        requestOptions: {
          headers: {
            ...ORANGE_SPECIAL_HEADERS,
            ...PDF_HEADERS
          }
        },
        fileAttributes: {
          metadata: {
            invoiceNumber: vendorRef,
            contentAuthor: 'sosh',
            datetime: bill.date,
            datetimeLabel: 'startDate',
            isSubscription: true,
            startDate: bill.date,
            carbonCopy: true
          }
        }
      })
    }

    // will be used to fetch old bills if needed
    const oldBillsUrl = recentBills.billsHistory?.oldBillsHref
    return { recentBills: saveBillsEntries, oldBillsUrl }
  }

  async checkMoreBillsButton() {
    this.log('info', '📍️ checkMoreBillsButton starts')
    await waitFor(
      () => {
        const moreBillsButton = document.querySelector(
          '[data-e2e="bh-more-bills"]'
        )

        if (moreBillsButton) {
          this.log('info', 'moreBillsButton found, returning true')
          return true
        } else {
          this.log('info', 'no moreBillsButton, checking bills length')
          const billsLength = document.querySelectorAll(
            '[data-e2e="bh-bill-table-line"]'
          ).length
          if (billsLength <= 12) {
            this.log('info', '12 or less bills found')
            return true
          }
          return false
        }
      },
      {
        interval: 1000,
        timeout: 30 * 1000
      }
    )
    return true
  }

  async navigateToPersonalInfos() {
    this.log('info', 'navigateToPersonalInfos starts')
    await this.runInWorker('click', 'a[href="/compte?sosh="]')
    await this.PromiseRaceWithError(
      [
        this.runInWorker('checkAccessibilityUrl'),
        this.waitForElementInWorker('p', {
          includesText: 'Infos de contact'
        })
      ],
      'navigateToPersonalInfos: checking landing page'
    )
    if (
      !(await this.isElementInWorker('p', {
        includesText: 'Infos de contact'
      }))
    ) {
      this.log(
        'warn',
        'Something went wrong when accessing personal info page, skipping identity scraping'
      )
      this.store.skippingIdentity = true
    }
    await this.runInWorker('click', 'p', { includesText: 'Infos de contact' })
    await Promise.all([
      this.waitForElementInWorker(
        'a[data-e2e="btn-contact-info-modifier-votre-identite"]'
      ),
      this.waitForElementInWorker(
        'a[data-e2e="btn-contact-info-phone-modifier"]'
      ),
      this.waitForElementInWorker(
        'a[data-e2e="btn-contact-info-modifier-vos-adresses-postales"]'
      )
    ])
  }

  async waitForUserAction(url) {
    this.log('info', 'waitForUserAction start')
    await this.setWorkerState({ visible: true, url })
    await this.runInWorkerUntilTrue({ method: 'waitForCaptchaResolution' })
    await this.setWorkerState({ visible: false, url })
  }

  async getUserDataFromWebsite() {
    this.log('info', '🤖 getUserDataFromWebsite starts')
    const credentials = await this.getCredentials()
    const credentialsLogin = credentials?.login
    const storeLogin = this.store?.userCredentials?.login

    // prefer credentials over user email since it may not be know by the user
    let sourceAccountIdentifier = credentialsLogin || storeLogin
    if (!sourceAccountIdentifier) {
      await this.waitForElementInWorker('#soshboard')
      sourceAccountIdentifier = await this.runInWorker('getUserMail')
    }

    if (!sourceAccountIdentifier) {
      throw new Error('Could not get a sourceAccountIdentifier')
    }

    return {
      sourceAccountIdentifier: sourceAccountIdentifier
    }
  }

  // ////////
  // WORKER//
  // ////////

  async getOldBillsFromWorker(oldBillsUrl) {
    if (!oldBillsUrl) {
      this.log('warn', 'oldBillsUrl is falsy ')
      return null
    }
    const OLD_BILLS_URL_PREFIX =
      'https://espace-client.orange.fr/ecd_wp/facture/historicBills'
    let jsonResp
    try {
      jsonResp = await ky
        .get(OLD_BILLS_URL_PREFIX + oldBillsUrl, {
          headers: {
            ...ORANGE_SPECIAL_HEADERS,
            ...JSON_HEADERS
          }
        })
        .json()
    } catch (error) {
      this.log(
        'error',
        `error when requesting oldBills url :${JSON.stringify(error)}`
      )
    }
    return jsonResp?.oldBills
  }

  async getRecentBillsFromInterceptor() {
    return interceptor.recentBills
  }

  async autoFill(credentials) {
    const loginInput = document.querySelector('#login')
    let passwordInput = document.querySelector('#password')
    let mobileConnectSumbit = document.querySelector(
      'button[data-testid="submit-mc"]'
    )
    if (credentials.login && loginInput && !passwordInput) {
      // Fully simulate React event to bypass orange's verifications
      await this.dispatchReactEvent(loginInput, credentials.login)
      // Waiting for both password input or mobileConnect submit button
      await this.waitForElementNoReload(
        '#password, button[data-testid="submit-mc"]'
      )
      this.log('debug', 'Password input or MCSubmit button showed up')
    }
    // check presence again in case the login autoFill has been done
    passwordInput = document.querySelector('#password')
    mobileConnectSumbit = document.querySelector(
      'button[data-testid="submit-mc"]'
    )
    this.log('debug', `Password input : ${Boolean(passwordInput)}`)
    this.log('debug', `MCSubmit button : ${Boolean(mobileConnectSumbit)}`)
    if (credentials.password && passwordInput && !mobileConnectSumbit) {
      await this.dispatchReactEvent(passwordInput, credentials.password)
    }
  }

  async dispatchReactEvent(targetInput, credential) {
    this.log('info', '📍️ dispatchReactEvent starts')
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      'value'
    ).set
    targetInput.focus()
    targetInput.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    targetInput.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }))
    targetInput.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    // set value via native setter
    nativeInputValueSetter.call(targetInput, credential)
    // dispatch input event React-style
    const event = new Event('input', { bubbles: true })
    event.simulated = true // React checks for this
    targetInput.dispatchEvent(event)
  }

  async getUserMail() {
    const foundAddress = window.o_idzone?.USER_MAIL_ADDRESS
    if (!foundAddress) {
      throw new Error(
        'Neither credentials or user mail address found, unexpected page reached'
      )
    }
    return foundAddress
  }

  async getIdentity() {
    this.log('info', '📍️ getIdentity starts')
    const idInfos = interceptor.userInfos?.identification?.identity
    const contactInfos =
      interceptor.userInfos?.identification?.contactInformation
    const addressInfos = interceptor.userInfos.billingAddresses?.[0]
    const mobileNumber =
      contactInfos.mobile?.status === 'valid'
        ? contactInfos.mobile.number
        : null
    const homeNumber =
      contactInfos.landline?.status === 'valid'
        ? contactInfos.landline.number
        : null
    const email =
      contactInfos?.email?.status === 'valid'
        ? contactInfos?.email?.address
        : null

    const address = []
    if (addressInfos) {
      const streetNumber = addressInfos.postalAddress?.streetNumber?.number
      const streetType = addressInfos.postalAddress?.street?.type
      const streetName = addressInfos.postalAddress?.street?.name
      const street =
        streetType && streetName ? `${streetType} ${streetName}` : undefined
      const postCode = addressInfos.postalAddress?.postalCode
      const city = addressInfos.postalAddress?.cityName
      const formattedAddress =
        streetNumber && street && postCode && city
          ? `${streetNumber} ${street} ${postCode} ${city}`
          : undefined
      address.push({
        streetNumber,
        street,
        postCode,
        city,
        formattedAddress
      })
    }
    const infosIdentity = {
      name: {
        givenName: idInfos?.firstName,
        lastName: idInfos?.lastName
      },
      address
    }
    if (email) {
      infosIdentity.email = []
      infosIdentity.email.push({
        address: email
      })
    }
    if (mobileNumber || homeNumber) {
      infosIdentity.phone = []
      if (mobileNumber) {
        infosIdentity.phone.push({
          type: 'mobile',
          number: mobileNumber
        })
      }
      if (homeNumber) {
        infosIdentity.phone.push({
          type: 'home',
          number: homeNumber
        })
      }
    }

    await this.sendToPilot({
      infosIdentity
    })
  }

  checkForCaptcha() {
    const captchaContainer = document.querySelector(
      'div[class*="captcha_responseContainer"]'
    )
    let captchaHref = document.location.href
    if (captchaContainer) {
      return { askForCaptcha: true, captchaHref }
    }
    return false
  }

  async checkCaptchaResolution() {
    const passwordInput = document.querySelector('#password')
    const loginInput = document.querySelector('#login')
    const otherAccountButton = document.querySelector(
      'button[data-testid="choose-other-account"]'
    )
    const stayLoggedButton = document.querySelector(
      'button[data-testid="button-keepconnected"]'
    )
    if (passwordInput || loginInput || otherAccountButton || stayLoggedButton) {
      return true
    }
    return false
  }

  async waitForCaptchaResolution() {
    await waitFor(this.checkCaptchaResolution, {
      interval: 1000,
      timeout: 60 * 1000
    })
    return true
  }

  async getFileName(date, amount, vendorRef) {
    const digestId = await hashVendorRef(vendorRef)
    const shortenedId = digestId.substr(0, 5)
    return `${date}_sosh_${amount}€_${shortenedId}.pdf`
  }

  async checkAccessibilityUrl() {
    this.log('info', '📍️ checkAccessibilityUrl starts')
    await waitFor(
      () => {
        const currentUrl = document.location.href
        if (currentUrl.includes('/accessibilite?sosh=oui&')) {
          this.log('warn', 'Found accessibility score url')
          return true
        } else return false
      },
      {
        interval: 1000,
        timeout: 30 * 1000
      }
    )
    return true
  }

  async downloadFileInWorker(entry) {
    // overload ContentScript.downloadFileInWorker to be able to check the status of the file. Since not-so-long ago, recent bills on some account are all receiving a 403 error, issue is on their side, either on browser desktop/mobile.
    // This does not affect bills older than one year (so called oldBills) for the moment
    this.log('debug', 'downloading file in worker')
    let response
    response = await fetch(entry.fileurl, {
      headers: {
        ...ORANGE_SPECIAL_HEADERS,
        ...JSON_HEADERS
      }
    })
    const clonedResponse = await response.clone()
    const respToText = await clonedResponse.text()
    if (respToText.match('403 Forbidden')) {
      this.log('warn', 'This file received a 403, check on the website')
      return null
    }
    entry.blob = await response.blob()
    entry.dataUri = await blobToBase64(entry.blob)
    if (entry.dataUri) {
      return entry.dataUri
    }
  }
}

const connector = new SoshContentScript()
connector
  .init({
    additionalExposedMethodsNames: [
      'getUserMail',
      'getIdentity',
      'checkForCaptcha',
      'waitForCaptchaResolution',
      'getFileName',
      'getRecentBillsFromInterceptor',
      'getOldBillsFromWorker',
      'waitForUndefinedLabelReallyClicked',
      'checkErrorUrl',
      'checkMoreBillsButton',
      'getContracts',
      'waitForNextState',
      'getCurrentState',
      'autoFill',
      'checkAccessibilityUrl'
    ]
  })
  .catch(err => {
    log.warn(err)
  })

async function hashVendorRef(vendorRef) {
  const msgUint8 = new window.TextEncoder().encode(vendorRef) // encode as (utf-8) Uint8Array
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgUint8) // hash the message
  const hashArray = Array.from(new Uint8Array(hashBuffer)) // convert buffer to byte array
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('') // convert bytes to hex string
  return hashHex
}

function getDateDistanceInDays(dateString) {
  const distanceMs = Date.now() - new Date(dateString).getTime()
  const days = 1000 * 60 * 60 * 24

  return Math.floor(distanceMs / days)
}
