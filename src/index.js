/* eslint-disable no-console */

import { ContentScript } from 'cozy-clisk/dist/contentscript'
import Minilog from '@cozy/minilog'
import waitFor from 'p-wait-for'
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

const BASE_URL = 'https://www.sosh.fr'
const DEFAULT_PAGE_URL = BASE_URL + '/client'
const LOGIN_FORM_PAGE =
  'https://login.orange.fr/?service=sosh&return_url=https%3A%2F%2Fwww.sosh.fr%2F&propagation=true&domain=sosh&force_authent=true'
const interceptor = new XhrInterceptor()
interceptor.init()

class SoshContentScript extends ContentScript {
  // ///////
  // PILOT//
  // ///////
  async navigateToLoginForm() {
    this.log('info', '🤖 navigateToLoginForm starts')
    await this.goto(LOGIN_FORM_PAGE)
    await Promise.race([
      this.waitForElementInWorker('#login-label'),
      this.waitForElementInWorker('#password-label'),
      this.waitForElementInWorker('button[data-testid="button-keepconnected"]'),
      this.waitForElementInWorker('div[class*="captcha_responseContainer"]'),
      this.waitForElementInWorker('#undefined-label'),
      this.waitForElementInWorker('#oecs__popin-icon-Identification')
    ])
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

    const isIdentificationPresent = await this.isElementInWorker(
      '#oecs__popin-icon-Identification'
    )
    this.log('info', 'isIdentificationPresent: ' + isIdentificationPresent)

    if (isIdentificationPresent) {
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
      await this.clickAndWait('#undefined-label', '#login-label')
    }
  }

  async ensureAuthenticated() {
    this.log('info', '🤖 ensureAuthenticated starts')
    await this.navigateToLoginForm()
    const credentials = await this.getCredentials()
    if (credentials) {
      this.log('info', 'found credentials, processing')
      await this.tryAutoLogin(credentials)
    } else {
      this.log('info', 'no credentials found, use normal user login')
      await this.waitForUserAuthentication()
    }
    await this.detectOrangeOnlyAccount()
  }

  async checkAuthenticated() {
    const loginField = document.querySelector(
      'p[data-testid="selected-account-login"]'
    )
    const passwordField = document.querySelector('#password')
    if (loginField && passwordField) {
      const userCredentials = await this.findAndSendCredentials.bind(this)(
        loginField
      )
      this.log('info', 'Sending user credentials to Pilot')
      this.sendToPilot({
        userCredentials
      })
    }
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

  async autoLogin(credentials) {
    this.log('info', 'Autologin start')
    const emailSelector = '#login'
    const passwordInputSelector = '#password'
    const loginButtonSelector = '#btnSubmit'
    await this.waitForElementInWorker(emailSelector)
    await this.runInWorker('fillForm', credentials)
    await this.runInWorker('click', loginButtonSelector)

    await Promise.race([
      this.waitForElementInWorker('button[data-testid="button-keepconnected"]'),
      this.waitForElementInWorker(passwordInputSelector)
    ])

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

    await this.navigateToPersonalInfos()
    await this.runInWorker('getIdentity')
    await this.saveIdentity(this.store.infosIdentity)
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
    await Promise.race([
      this.waitForElementInWorker('[data-e2e="bh-more-bills"]'),
      this.waitForElementInWorker('.alert-icon icon-error-severe'),
      this.waitForElementInWorker(
        '.alert-container alert-container-sm alert-danger mb-0'
      )
    ])

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
      await this.waitForElementInWorker(
        'div[data-e2e="e2e-personal-info-identity"]'
      ),
      await this.waitForElementInWorker(
        'a[href="/compte/modification-moyens-contact"]'
      ),
      await this.waitForElementInWorker('a[href="/compte/adresse"]')
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
    await this.waitForElementInWorker('.dashboardConso__welcome')
    const sourceAccountId = await this.runInWorker('getUserMail')
    if (sourceAccountId === 'UNKNOWN_ERROR') {
      throw new Error('Could not get a sourceAccountIdentifier')
    }

    return {
      sourceAccountIdentifier: sourceAccountId
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

  async findAndSendCredentials(loginField) {
    this.log('info', 'getting in findAndSendCredentials')
    let userLogin = loginField.innerHTML
      .replace('<strong>', '')
      .replace('</strong>', '')
    let divPassword = document.querySelector('#password').value
    const userCredentials = {
      email: userLogin,
      password: divPassword
    }
    return userCredentials
  }

  async fillForm(credentials) {
    if (document.querySelector('#login')) {
      this.log('info', 'filling email field')
      document.querySelector('#login').value = credentials.email
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
    this.log('info', 'Starting getIdentity')
    let infosIdentity
    const [, firstName, lastName] = document
      .querySelector('div[data-e2e="e2e-personal-info-identity"]')
      .nextSibling.nextSibling.textContent.split(' ')
    const fullName = `${firstName} ${lastName}`
    const postCode = interceptor.userInfos?.[0].postalAddress.postalCode
    const city = interceptor.userInfos?.[0].postalAddress.cityName
    const streetNumber =
      interceptor.userInfos?.[0].postalAddress.streetNumber.number
    const streetName = interceptor.userInfos?.[0].postalAddress.street.name
    const streetType = interceptor.userInfos?.[0].postalAddress.street.type
    const formattedAddress = `${streetNumber} ${streetType} ${streetName} ${postCode} ${city}`
    const [foundNumber, foundEmail] = document.querySelectorAll('.item-desc')
    const phoneNumber = foundNumber.textContent.replace(/ /g, '')
    const email = foundEmail.textContent
    infosIdentity = {
      email,
      name: {
        firstName,
        lastName,
        fullName
      },
      address: [
        {
          formattedAddress,
          postCode,
          city,
          street: {
            streetNumber,
            streetName,
            streetType
          }
        }
      ],
      phoneNumber: [
        {
          type:
            phoneNumber.startsWith('06') | phoneNumber.startsWith('07')
              ? 'mobile'
              : 'home',
          number: phoneNumber
        }
      ]
    }
    await this.sendToPilot({ infosIdentity })
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
      'getOldBillsFromWorker'
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
