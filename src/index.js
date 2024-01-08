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
const LOGIN_FORM_PAGE =
  'https://login.orange.fr/?service=sosh&return_url=https%3A%2F%2Fwww.sosh.fr%2F&propagation=true&domain=sosh&force_authent=true'
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
    await this.waitForElementNoReload('#login')
    await this.waitForElementNoReload('#password')
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
      checkBox.click()
      // Setting the visibility to hidden on the parent to make the element disapear
      // preventing users to click it
      checkBox.parentNode.parentNode.style.visibility = 'hidden'
    }
    this.log('info', 'password element found, adding listener')
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

  async navigateToLoginForm() {
    this.log('info', '🤖 navigateToLoginForm starts')
    if (await this.isElementInWorker('#login-label')) {
      this.log('info', 'Already on loginPage, returning true')
      return true
    }
    await this.goto(LOGIN_FORM_PAGE)
    await this.PromiseRaceWithError(
      [
        this.waitForElementInWorker('#login-label'),
        this.waitForElementInWorker('#password-label'),
        this.waitForElementInWorker(
          'button[data-testid="button-keepconnected"]'
        ),
        this.waitForElementInWorker('div[class*="captcha_responseContainer"]'),
        this.waitForElementInWorker('#undefined-label'),
        this.waitForElementInWorker('#oecs__connecte-se-deconnecter')
      ],
      'navigateToLoginForm: waiting for login page load'
    )
    const loginLabelPresent = await this.isElementInWorker('#login-label')
    this.log('info', 'loginLabelPresent: ' + loginLabelPresent)
    const passwordLabelPresent = await this.isElementInWorker('#password-label')
    this.log('info', 'passwordLabelPresent: ' + passwordLabelPresent)
    const keepConnectedPresent = await this.isElementInWorker(
      'button[data-testid="button-keepconnected"]'
    )
    this.log('info', 'keepConnectedPresent: ' + keepConnectedPresent)
    const captchaPresent = await this.isElementInWorker(
      'div[class*="captcha_responseContainer"]'
    )
    this.log('info', 'captchaPresent: ' + captchaPresent)
    const undefinedLabelPresent = await this.isElementInWorker(
      '#undefined-label'
    )
    this.log('info', 'undefinedLabelPresent: ' + undefinedLabelPresent)
    await this.handleCaptcha()
    await this.handleKeepConnected('changeAccount')
    // This is necessary for specific logout/autoLogin scenario.
    // If the connector had crashed on last execution we could get a captcha on first navigation
    // and a new one after the logout to reach back loginPage
    if (!(await this.isElementInWorker('#login'))) {
      await this.runInWorker('click', '#oecs__connexion')
      await this.waitForElementInWorker(
        '#login, div[class*="captcha_responseContainer"]'
      )
      await this.handleCaptcha()
    }
  }

  /**
   * Sometimes, depending on the device, #undefined-label may not be clickable yet
   * we click on it until it disappears
   */
  async waitForUndefinedLabelReallyClicked() {
    await waitFor(
      function clickOnElementUntilItDisapear() {
        const elem = document.querySelector('#undefined-label')
        if (elem) {
          elem.click()
          return false
        }
        return true
      },
      {
        interval: 100,
        timeout: {
          milliseconds: 30 * 1000,
          message: new TimeoutError(
            `waitForUndefinedLabelReallyClicked timed out after ${30 * 1000}ms`
          )
        }
      }
    )
  }

  async ensureAuthenticated({ account }) {
    this.log('info', '🤖 ensureAuthenticated starts')
    this.bridge.addEventListener('workerEvent', this.onWorkerEvent.bind(this))
    if (!account) {
      await this.ensureNotAuthenticated()
    }
    await this.navigateToLoginForm()
    const credentials = await this.getCredentials()
    if (credentials) {
      this.log('info', 'found credentials, processing')
      await this.tryAutoLogin(credentials)
    } else {
      this.log('info', 'no credentials found, use normal user login')
      await this.waitForUserAuthentication()
    }
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

  async ensureNotAuthenticated() {
    this.log('info', '🤖 ensureNotAuthenticated starts')
    await this.goto(DEFAULT_PAGE_URL)
    await this.waitForElementInWorker(
      '#login, #password, div[class*="captcha_responseContainer"], button[data-testid="button-keepconnected"], #oecs__connexion, #oecs__connecte-se-deconnecter'
    )
    // Website could trigger a captcha when reaching for homePage, it's weird but it happen, so we're covering the case
    await this.handleCaptcha()
    const connectionButton = await this.isElementInWorker('#oecs__connexion')
    const loginInput = await this.isElementInWorker('#login')
    if (connectionButton || loginInput) {
      this.log('info', 'Already logged out, continue')
      return true
    }
    const isLogged = await this.isElementInWorker(
      '#oecs__connecte-se-deconnecter'
    )
    if (isLogged) {
      await this.logout()
      return true
    }
    const isLoggedOut = await this.handleKeepConnected('logout')
    if (isLoggedOut) {
      this.log('info', 'handleKeepConnected - Logout successful')
      return true
    }
    this.log('info', 'Case unknown, trying to logout')
    await this.logout()
    return true
  }

  async checkAuthenticated() {
    const isGoodUrl = document.location.href.includes(DEFAULT_PAGE_URL)
    const isConnectedElementPresent = Boolean(
      document.querySelector('#oecs__connecte')
    )
    const isDisconnectElementPresent = Boolean(
      document.querySelector('#oecs__connecte-se-deconnecter')
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
    await this.runInWorkerUntilTrue({ method: 'waitForAuthenticated' })
    await this.setWorkerState({ visible: false })
  }

  async tryAutoLogin(credentials) {
    this.log('info', 'Trying autologin')
    await this.autoLogin(credentials)
  }

  async waitForErrorUrl() {
    await this.runInWorkerUntilTrue({ method: 'checkErrorUrl' })
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
  // Options are mandatory because we don't wanna handle the keepConnected/alreadyConnected scenario the same way
  // In one scenario we just need to go back to the first loginStep
  // In the other we wanna click the keepConnected button, because it indicates last connection has been done with the "rememberMe" radio checked
  // and logout completly is needed to avoid orange/sosh problems as well as too many scenarios to handle.
  async handleKeepConnected(option) {
    this.log('info', `📍️ handleKeepConnected for ${option} starts`)
    const isShowingKeepConnected = await this.isElementInWorker(
      'button[data-testid="button-keepconnected"]'
    )
    const isShowingPasswordStep = await this.isElementInWorker('#password')
    const isShowingLoginStep = await this.isElementInWorker('#login-label')
    const isLogged = await this.isElementInWorker(
      '#oecs__connecte-se-deconnecter'
    )
    if (isLogged) {
      this.log('info', 'User is logged, simply logging out')
      await this.logout()
      return true
    }
    this.log('info', 'isShowingKeepConnected: ' + isShowingKeepConnected)
    this.log('info', 'isShowingPasswordStep: ' + isShowingPasswordStep)
    if (isShowingLoginStep) {
      this.log('info', `Last action leads directly to login step`)
      return true
    }
    if (option === 'changeAccount') {
      // always choose to login on another account
      if (isShowingKeepConnected || isShowingPasswordStep) {
        await this.clickAndWait('#changeAccountLink', '#undefined-label')
        if (await this.isElementInWorker('#undefined-label')) {
          await this.clickAndWait('#undefined-label', '#login-label')
        }
        return true
      }
    }
    if (option === 'logout') {
      if (isShowingKeepConnected) {
        await this.clickAndWait(
          'button[data-testid="button-keepconnected"]',
          '.menu'
        )
        await this.logout()
        return true
      }
    }
    this.log('warn', `Option "${option}" leads to unknown case`)
    this.log(
      'warn',
      `isShowingKeepConnected : ${isShowingKeepConnected} | isShowingPasswordStep : ${isShowingPasswordStep} | isShowingLoginStep : ${isShowingLoginStep}`
    )
    return false
  }

  async autoLogin(credentials) {
    this.log('info', 'Autologin start')
    const emailSelector = '#login'
    const passwordInputSelector = '#password'
    const loginButtonSelector = '#btnSubmit'
    await this.waitForElementInWorker(
      `${emailSelector}, ${passwordInputSelector}`
    )
    if (await this.isElementInWorker(emailSelector)) {
      await this.runInWorker('fillForm', credentials)
      await this.runInWorker('click', loginButtonSelector)
    }

    await this.PromiseRaceWithError(
      [
        this.waitForElementInWorker(
          'button[data-testid="button-keepconnected"]'
        ),
        this.waitForElementInWorker('button[data-testid="button-reload"]'),
        this.waitForElementInWorker(passwordInputSelector),
        this.waitForErrorUrl()
      ],
      'autoLogin: page load after submit'
    )

    const isShowingKeepConnected = await this.isElementInWorker(
      'button[data-testid="button-keepconnected"]'
    )
    this.log('info', 'isShowingKeepConnected: ' + isShowingKeepConnected)
    const isShowingButtonReload = await this.isElementInWorker(
      'button[data-testid="button-reload"]'
    )
    this.log('info', 'isShowingButtonReload: ' + isShowingButtonReload)

    if (isShowingButtonReload) {
      await this.runInWorker('click', 'button[data-testid="button-reload"]')
    }

    if (isShowingKeepConnected) {
      await this.runInWorker(
        'click',
        'button[data-testid="button-keepconnected"]'
      )
      return
    }

    await this.runInWorker('fillForm', credentials)
    await this.runInWorker('click', loginButtonSelector)
  }

  async logout() {
    this.log('info', '📍️ logout starts')
    try {
      await this.clickAndWait(
        '#oecs__connecte-se-deconnecter',
        '#oecs__connexion'
      )
    } catch (e) {
      log('error', 'Not completly disconnected, never found the second link')
      throw e
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
    // Logging out every run to avoid in between scenarios and sosh/orange mismatched sessions
    await this.logout()
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

  async navigateToNextContract(index) {
    this.log('info', '📍️ navigateToNextContract starts')
    const wantedContractNumber = this.store.allContractsInfos[index].phone
    await this.goto(DEFAULT_PAGE_URL)
    // Here we're using those three tags because we don't know exactly what element we need
    // but we know it must be clickable
    await this.waitForElementInWorker('span', {
      includesText: `${wantedContractNumber}`
    })
    await this.runInWorker('click', 'span', {
      includesText: `${wantedContractNumber}`
    })
    await this.waitForElementInWorker('a', {
      includesText: 'Consulter votre facture'
    })
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
        this.runInWorkerUntilTrue({ method: 'checkMoreBillsButton' }),
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
        'a[data-e2e="btn-contact-info-modifier-vos-coordonnees"]'
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

  async fillForm(credentials) {
    if (document.querySelector('#login')) {
      this.log('info', 'filling email field')
      document.querySelector('#login').value = credentials.login
      return
    }
    if (document.querySelector('#password')) {
      this.log('info', 'filling password field')
      document.querySelector('#password').value = credentials.password
      return
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
    this.log('info', 'getIdentity starts')
    const addressInfos = interceptor.userInfos.billingAddresses?.[0]
    const phoneNumber =
      interceptor.userInfos.portfolio?.contracts?.[0]?.telco?.publicNumber
    const address = []
    if (addressInfos) {
      const houseNumber = addressInfos.postalAddress?.streetNumber?.number
      const streetType = addressInfos.postalAddress?.street?.type
      const streetName = addressInfos.postalAddress?.street?.name
      const street =
        streetType && streetName ? `${streetType} ${streetName}` : undefined
      const postCode = addressInfos.postalAddress?.postalCode
      const city = addressInfos.postalAddress?.cityName
      const formattedAddress =
        houseNumber && street && postCode && city
          ? `${houseNumber} ${street} ${postCode} ${city}`
          : undefined
      address.push({
        houseNumber,
        street,
        postCode,
        city,
        formattedAddress
      })
    }
    const infosIdentity = {
      name: {
        givenName:
          interceptor.indentification?.contracts?.[0]?.holder?.firstName,
        lastName: interceptor.indentification?.contracts?.[0]?.holder?.lastName
      },
      mail: interceptor.identification?.contactInformation?.email?.address,
      address
    }

    if (phoneNumber && phoneNumber.match) {
      infosIdentity.phone = [
        {
          type: phoneNumber.match(/^06|07|\+336|\+337/g) ? 'mobile' : 'home',
          number: phoneNumber
        }
      ]
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
    const otherAccountButton = document.querySelector('#undefined-label')
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
      'fillForm',
      'getIdentity',
      'checkForCaptcha',
      'waitForCaptchaResolution',
      'getFileName',
      'getRecentBillsFromInterceptor',
      'getOldBillsFromWorker',
      'waitForUndefinedLabelReallyClicked',
      'checkErrorUrl',
      'checkMoreBillsButton',
      'getContracts'
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
