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
const LOGOUT_URL =
  'https://iapref.sosh.fr/pkmslogout?comeback=https%3A%2F%2Flogin.orange.fr%2F%3Faction%3Dsupprimer%26return_url%3Dhttps%253A%252F%252Fwww.sosh.fr%252F'
const DEFAULT_PAGE_URL = BASE_URL + '/client'
const LOGIN_FORM_PAGE =
  'https://login.orange.fr/?service=sosh&return_url=https%3A%2F%2Fwww.sosh.fr%2F&propagation=true&domain=sosh&force_authent=true'
const interceptor = new XhrInterceptor()
interceptor.init()

class SoshContentScript extends ContentScript {
  // ///////
  // PILOT//
  // ///////
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
        this.waitForElementInWorker('#oecs__popin-icon-Identification'),
        this.waitForErrorUrl()
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

    const { askForCaptcha, captchaUrl } = await this.runInWorker(
      'checkForCaptcha'
    )
    if (askForCaptcha) {
      this.log('info', 'captcha found, waiting for resolution')
      await this.waitForUserAction(captchaUrl)
    }

    // The user is considered identified
    const isIdentificationPresent = await this.isElementInWorker(
      '#oecs__popin-icon-Identification'
    )
    this.log('info', 'isIdentificationPresent: ' + isIdentificationPresent)

    if (isIdentificationPresent) {
      // always choose to change the user, easier to be sure what user we are in
      await this.clickAndWait(
        '#oecs__popin-icon-Identification',
        '#oecs__connecte-changer-utilisateur'
      )
      await this.clickAndWait(
        '#oecs__connecte-changer-utilisateur',
        '#undefined-label'
      )
    }

    if (await this.isElementInWorker('#undefined-label')) {
      this.log(
        'info',
        'Found "Utiliser un autre compte". Clicking it and waiting for login screen'
      )
      await this.runInWorker('waitForUndefinedLabelReallyClicked')
      await this.waitForElementInWorker('#login-label')
    }
    this.log('debug', 'End of navigateToLoginForm')
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
    const credentials = await this.getCredentials()

    if (!account || !credentials) {
      await this.ensureNotAuthenticated()
    }
    await this.navigateToLoginForm()
    if (await this.isElementInWorker('#password, #login')) {
      if (credentials) {
        this.log('info', 'found credentials, processing')
        await this.tryAutoLogin(credentials)
      } else {
        this.log('info', 'no credentials found, use normal user login')
        await this.waitForUserAuthentication()
      }
      await this.detectOrangeOnlyAccount()
    }
  }

  async ensureNotAuthenticated() {
    this.log('info', '🤖 ensureNotAuthenticated starts')
    await this.goto(LOGOUT_URL)
    await this.waitForElementInWorker('#oecs__connexion')
  }

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

  onWorkerReady() {
    function addClickListener() {
      document.body.addEventListener('click', e => {
        const clickedElementId = e.target.getAttribute('id')
        if (clickedElementId === 'btnSubmit') {
          const login = document.querySelector(
            `[data-testid=selected-account-login]`
          )?.innerHTML
          const password = document.querySelector('#password')?.value
          this.bridge.emit('workerEvent', {
            event: 'loginSubmit',
            payload: { login, password }
          })
        }
      })
    }
    if (!document?.body) {
      log('info', 'no body, did not add dom event listener')
      return
    }

    if (
      document.readyState === 'complete' ||
      document.readyState === 'loaded'
    ) {
      addClickListener.bind(this)()
    } else {
      document.addEventListener('DOMContentLoaded', addClickListener.bind(this))
    }
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
        this.waitForElementInWorker(passwordInputSelector),
        this.waitForErrorUrl()
      ],
      'autoLogin: page load after submit'
    )

    const isShowingKeepConnected = await this.isElementInWorker(
      'button[data-testid="button-keepconnected"]'
    )
    this.log('info', 'isShowingKeepConnected: ' + isShowingKeepConnected)

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

  async fetch(context) {
    this.log('info', '🤖 fetch start')
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
    let numberOfContracts = 1
    if (await this.isElementInWorker('.dashboardConso__contracts li')) {
      await this.runInWorker('getNumberOfContracts')
      // If we found the contractSelection state, we need to choose the first of the list
      // to reach the wanted page for the rest of the execution
      await this.runInWorker('click', 'button', {
        includesText: `${this.store.allContractsInfos[0].phone}`
      })
      await this.waitForElementInWorker('a', {
        includesText: 'Consulter votre facture'
      })
    }
    if (this.store.allContractsInfos) {
      const contractsLength = this.store.allContractsInfos.length
      this.log('info', `Found ${contractsLength} contracts`)
      numberOfContracts = contractsLength
    }
    for (let i = 0; i < numberOfContracts; i++) {
      const { recentBills, oldBillsUrl } = await this.fetchRecentBills()
      await this.saveBills(recentBills, {
        context,
        fileIdAttributes: ['vendorRef'],
        contentType: 'application/pdf',
        qualificationLabel: 'isp_invoice'
      })
      const oldBills = await this.fetchOldBills({ oldBillsUrl })
      await this.saveBills(oldBills, {
        context,
        fileIdAttributes: ['vendorRef'],
        contentType: 'application/pdf',
        qualificationLabel: 'isp_invoice'
      })
      if (numberOfContracts > 1 && i + 1 <= numberOfContracts) {
        await this.navigateToNextContract(i + 1)
      }
    }

    await this.navigateToPersonalInfos()
    await this.runInWorker('getIdentity')
    await this.saveIdentity(this.store.infosIdentity)
  }

  async getNumberOfContracts() {
    this.log('info', '📍️ getNumberOfContracts starts')
    const contractsElements = document.querySelectorAll(
      '.dashboardConso__contracts li'
    )
    let allContractsInfos = []
    for (const contract of contractsElements) {
      const contractInfos = contract.textContent
        .match(/([A-Za-z])*\s(\d{2}\s\d{2}\s\d{2}\s\d{2}\s\d{2})/g)[0]
        .split(/(?<=\D)\s/)
      const [type, phone] = contractInfos
      allContractsInfos.push({ type, phone })
    }
    await this.sendToPilot({ allContractsInfos })
  }

  async navigateToNextContract(index) {
    this.log('info', '📍️ navigateToNextContract starts')
    const wantedContractNumber = this.store.allContractsInfos[index].phone
    await this.goto(DEFAULT_PAGE_URL)
    // Here we're using those three tags because we don't know exactly what element we need
    // but we know it must be clickable
    await this.waitForElementInWorker('button, a, div', {
      includesText: `${wantedContractNumber}`
    })
    await this.runInWorker('click', 'button, a, div', {
      includesText: `${wantedContractNumber}`
    })
    await this.waitForElementInWorker('a', {
      includesText: 'Consulter votre facture'
    })
  }

  async fetchOldBills({ oldBillsUrl }) {
    this.log('info', 'fetching old bills')
    const { oldBills } = await this.runInWorker(
      'getOldBillsFromWorker',
      oldBillsUrl
    )
    const cid = oldBillsUrl.split('=').pop()

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

  async fetchRecentBills() {
    await this.waitForElementInWorker('a', {
      includesText: 'Consulter votre facture'
    })
    await this.runInWorker('click', 'a', {
      includesText: 'Consulter votre facture'
    })
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

    const recentBills = await this.runInWorker('getRecentBillsFromInterceptor')
    const saveBillsEntries = []
    for (const bill of recentBills.billsHistory.billList) {
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
    await this.clickAndWait(
      'a[href="/compte?sosh="]',
      'a[href="/compte/infos-perso"]'
    )
    await this.clickAndWait(
      'a[href="/compte/infos-perso"]',
      'div[data-e2e="e2e-personal-info-identity"]'
    )
    await Promise.all([
      this.waitForElementInWorker('div[data-e2e="e2e-personal-info-identity"]'),
      this.waitForElementInWorker(
        'a[href="/compte/modification-moyens-contact"]'
      ),
      this.waitForElementInWorker('a[href="/compte/adresse"]')
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

  async detectOrangeOnlyAccount() {
    await this.goto(DEFAULT_PAGE_URL)
    await this.waitForElementInWorker('strong')
    const isSosh = await this.runInWorker(
      'checkForElement',
      `#oecs__logo[href="https://www.sosh.fr/"]`
    )
    this.log('info', 'isSosh ' + isSosh)
    if (!isSosh) {
      throw new Error(
        'This should be sosh account. Found only orange contracts'
      )
    }
  }

  async getUserMail() {
    return window.o_idzone?.USER_MAIL_ADDRESS
  }

  async getIdentity() {
    this.log('info', 'getIdentity starts')
    const addressInfos = interceptor.userInfos.billingAddresses?.[0]
    const phoneNumber =
      interceptor.userInfos.portfolio?.contracts?.[0]?.telco?.publicNumber
    const address = []
    if (addressInfos) {
      address.push({
        houseNumber: addressInfos.postalAddress.streetNumber.number,
        street: `${addressInfos.postalAddress.street.type} ${addressInfos.postalAddress.street.name}`,
        postCode: addressInfos.postalAddress.postalCode,
        city: addressInfos.postalAddress.cityName,
        formattedAddress: `${address.houseNumber} ${address.street} ${address.postCode} ${address.city}`
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
      'getNumberOfContracts'
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
