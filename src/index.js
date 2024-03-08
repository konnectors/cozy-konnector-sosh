/* eslint-disable no-console */

import { ContentScript } from 'cozy-clisk/dist/contentscript'
import Minilog from '@cozy/minilog'
import waitFor, { TimeoutError } from 'p-wait-for'
import ky from 'ky/umd'
import XhrInterceptor from './interceptor'

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
      if (login && password) {
        this.store.userCredentials = { login, password }
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
      (await this.checkForElement('#password'))
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
      document.querySelector('#oecs__zone-identity-layer_client_disconnect')
    )
    const isDisconnected = Boolean(
      document.querySelector('#oecs__zone-identity-layer_prospect_connect')
    )
    const isConsentPage = Boolean(
      document.querySelector('#didomi-notice-disagree-button')
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
      await this.runInWorker(
        'click',
        '#oecs__zone-identity-layer_client_disconnect'
      )
    } else if (currentState === 'passwordAlonePage') {
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
      await this.runInWorker(
        'click',
        '#oecs__zone-identity-layer_prospect_connect'
      )
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
    const isConnectedElementPresent = Boolean(
      document.querySelector('#oecs__connecte')
    )
    const isDisconnectElementPresent = Boolean(
      document.querySelector('#oecs__zone-identity-layer_client_disconnect')
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
    }
    return false
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
    await this.waitForElementInWorker('.menu')

    const contracts = await this.runInWorker('getContracts')

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
      if (FORCE_FETCH_ALL) {
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
    await this.runInWorker('getIdentity')
    await this.saveIdentity({ contact: this.store.infosIdentity })
  }

  async handleContextInfos(context) {
    this.log('info', '📍️ handleContextInfos starts')
    const { trigger } = context
    // force fetch all data (the long way) when last trigger execution is older than 90 days
    // or when the last job was an error
    const isLastJobError =
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
    const { oldBills } = await this.runInWorker(
      'getOldBillsFromWorker',
      oldBillsUrl
    )
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
    await this.waitForElementInWorker('a[href*="/historique-des-factures"]')
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
    const oldBillsUrl = recentBills.billsHistory.oldBillsHref
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
    await this.waitForElementInWorker('p', {
      includesText: 'Infos de contact'
    })
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
      await this.waitForElementInWorker('.dashboardConso__welcome')
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
    const OLD_BILLS_URL_PREFIX =
      'https://espace-client.orange.fr/ecd_wp/facture/historicBills'
    return await ky
      .get(OLD_BILLS_URL_PREFIX + oldBillsUrl, {
        headers: {
          ...ORANGE_SPECIAL_HEADERS,
          ...JSON_HEADERS
        }
      })
      .json()
  }

  async getRecentBillsFromInterceptor() {
    return interceptor.recentBills
  }

  async autoFill(credentials) {
    this.log('info', '📍️ autoFill starts')
    if (credentials.login) {
      const loginElement = document.querySelector('#login')
      if (loginElement) {
        loginElement.addEventListener('click', () => {
          loginElement.value = credentials.login
        })
        const submitElement = document.querySelector('#btnSubmit')
        submitElement.addEventListener('click', async () => {
          await this.waitForElementNoReload('#password')
          const passwordElement = document.querySelector('#password')
          passwordElement.focus()
          passwordElement.value = credentials.password
        })
      }
    }
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
      'autoFill'
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
