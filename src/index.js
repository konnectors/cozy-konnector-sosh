/* eslint-disable no-console */

import { ContentScript } from 'cozy-clisk/dist/contentscript'
import { blobToBase64 } from 'cozy-clisk/dist/contentscript/utils'
import Minilog from '@cozy/minilog'
import waitFor from 'p-wait-for'

const log = Minilog('ContentScript')
Minilog.enable('soshCCC')

const BASE_URL = 'https://www.sosh.fr'
const DEFAULT_PAGE_URL = BASE_URL + '/client'
const LOGIN_FORM_PAGE =
  'https://login.orange.fr/?service=sosh&return_url=https%3A%2F%2Fwww.sosh.fr%2F&propagation=true&domain=sosh&force_authent=true'

let recentBills = []
let oldBills = []
let recentPromisesToConvertBlobToBase64 = []
let oldPromisesToConvertBlobToBase64 = []
let recentXhrUrls = []
let oldXhrUrls = []
let userInfos = []

// The override here is needed to intercept XHR requests made during the navigation
// The website respond with an XHR containing a blob when asking for a pdf, so we need to get it and encode it into base64 before giving it to the pilot.
var proxied = window.XMLHttpRequest.prototype.open
// Overriding the open() method
window.XMLHttpRequest.prototype.open = function () {
  var originalResponse = this
  console.log('👅👅👅 url', arguments?.[1])
  // Intercepting response for recent bills information.
  if (arguments[1].includes('/users/current/contracts')) {
    originalResponse.addEventListener('readystatechange', function () {
      if (originalResponse.readyState === 4) {
        // The response is a unique string, in order to access information parsing into JSON is needed.
        const jsonBills = JSON.parse(originalResponse.responseText)
        recentBills.push(jsonBills)
      }
    })
    return proxied.apply(this, [].slice.call(arguments))
  }
  // Intercepting response for old bills information.
  if (arguments[1].includes('/facture/historicBills?')) {
    originalResponse.addEventListener('readystatechange', function () {
      if (originalResponse.readyState === 4) {
        const jsonBills = JSON.parse(originalResponse.responseText)
        oldBills.push(jsonBills)
      }
    })
    return proxied.apply(this, [].slice.call(arguments))
  }
  // Intercepting user infomations for Identity object
  if (arguments[1].includes('ecd_wp/account/billingAddresses')) {
    originalResponse.addEventListener('readystatechange', function () {
      if (originalResponse.readyState === 4) {
        const jsonInfos = JSON.parse(originalResponse.responseText)
        userInfos.push(jsonInfos[0])
      }
    })
    return proxied.apply(this, [].slice.call(arguments))
  }
  // Intercepting response for recent bills blobs.
  if (arguments[1].includes('facture/v1.0/pdf?billDate')) {
    originalResponse.addEventListener('readystatechange', function () {
      if (originalResponse.readyState === 4) {
        // Pushing in an array the converted to base64 blob and pushing in another array it's href to match the indexes.
        recentPromisesToConvertBlobToBase64.push(
          blobToBase64(originalResponse.response)
        )
        recentXhrUrls.push(originalResponse.__zone_symbol__xhrURL)

        // In every case, always returning the original response untouched
        return originalResponse
      }
    })
  }
  // Intercepting response for old bills blobs.
  if (arguments[1].includes('ecd_wp/facture/historicPDF?')) {
    originalResponse.addEventListener('readystatechange', function () {
      if (originalResponse.readyState === 4) {
        oldPromisesToConvertBlobToBase64.push(
          blobToBase64(originalResponse.response)
        )
        oldXhrUrls.push(originalResponse.__zone_symbol__xhrURL)

        return originalResponse
      }
    })
  }
  return proxied.apply(this, [].slice.call(arguments))
}

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

  async checkAuthenticated() {
    this.log('info', 'checkAuthenticated starts')
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

  async tryAutoLogin(credentials, type) {
    this.log('info', 'Trying autologin')
    await this.autoLogin(credentials, type)
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
    await this.waitForElementInWorker(
      'a[class="o-link-arrow text-primary pt-0"]'
    )
    const clientRef = await this.runInWorker('findClientRef')
    if (clientRef) {
      this.log('info', 'clientRef found')
      const clientLink = `https://espace-client.orange.fr/facture-paiement/${clientRef}`
      await this.goto(clientLink) // replaced a link click with goto to avoid javascript code
      // which forced to move to the app on iphone
      await this.waitForElementInWorker(`[data-e2e="bp-tile-historic"]`)
      const redFrame = await this.isElementInWorker(
        '.alert-icon icon-error-severe'
      )
      if (redFrame) {
        this.log('info', 'Website did not load the bills')
        throw new Error('VENDOR_DOWN')
      }
      let recentPdfNumber = await this.runInWorker('getPdfNumber')
      const hasMoreBills = await this.isElementInWorker(
        '[data-e2e="bh-more-bills"]'
      )
      if (hasMoreBills) {
        await this.clickAndWait(
          '[data-e2e="bh-more-bills"]',
          '[aria-labelledby="bp-historicBillsHistoryTitle"]'
        )
      }
      let allPdfNumber = await this.runInWorker('getPdfNumber')
      let oldPdfNumber = allPdfNumber - recentPdfNumber
      for (let i = 0; i < recentPdfNumber; i++) {
        this.log('info', 'fetching ' + (i + 1) + '/' + recentPdfNumber)
        // If something went wrong during the loading of the pdf board, a red frame with an error message appears
        // So we need to check every lap to see if we got one
        const redFrame = await this.isElementInWorker(
          '.alert-icon icon-error-severe'
        )
        if (redFrame) {
          this.log('info', 'Website did not load the bills')
          throw new Error('VENDOR_DOWN')
        }
        await this.runInWorker('waitForRecentPdfClicked', i)
        await this.clickAndWait(
          'a[class="o-link"]',
          '[data-e2e="bp-tile-historic"]'
        )
        await this.clickAndWait(
          '[data-e2e="bp-tile-historic"]',
          '[aria-labelledby="bp-billsHistoryTitle"]'
        )
        await this.clickAndWait(
          '[data-e2e="bh-more-bills"]',
          '[aria-labelledby="bp-historicBillsHistoryTitle"]'
        )
      }
      this.log('info', 'recentPdf loop ended')
      if (oldPdfNumber != 0) {
        for (let i = 0; i < oldPdfNumber; i++) {
          this.log('info', 'fetching ' + (i + 1) + '/' + oldPdfNumber)
          // Same as above with the red frame, but for old bills board
          const redFrame = await this.isElementInWorker(
            'span[class="alert-icon icon-error-severe"]'
          )
          if (redFrame) {
            this.log('info', 'Something went wrong during old pdfs loading')
            throw new Error('VENDOR_DOWN')
          }
          await this.runInWorker('waitForOldPdfClicked', i)
          await this.clickAndWait(
            'a[class="o-link"]',
            '[data-e2e="bp-tile-historic"]'
          )
          await this.clickAndWait(
            '[data-e2e="bp-tile-historic"]',
            '[aria-labelledby="bp-billsHistoryTitle"]'
          )
          await this.clickAndWait(
            '[data-e2e="bh-more-bills"]',
            '[aria-labelledby="bp-historicBillsHistoryTitle"]'
          )
        }
        this.log('info', 'oldPdf loop ended')
      }
      this.log('info', 'pdfButtons all clicked')
      await this.runInWorker('processingBills')
      this.store.dataUri = []
      for (let i = 0; i < this.store.resolvedBase64.length; i++) {
        let dateArray = this.store.resolvedBase64[i].href.match(
          /([0-9]{4})-([0-9]{2})-([0-9]{2})/g
        )
        this.store.resolvedBase64[i].date = dateArray[0]
        const index = this.store.allBills.findIndex(function (bill) {
          return bill.date === dateArray[0]
        })
        this.store.dataUri.push({
          vendor: 'sosh.fr',
          date: this.store.allBills[index].date,
          amount: this.store.allBills[index].amount / 100,
          recurrence: 'monthly',
          vendorRef: this.store.allBills[index].id
            ? this.store.allBills[index].id
            : this.store.allBills[index].tecId,
          filename: await this.runInWorker(
            'getFileName',
            this.store.allBills[index].date,
            this.store.allBills[index].amount / 100,
            this.store.allBills[index].id || this.store.allBills[index].tecId
          ),
          dataUri: this.store.resolvedBase64[i].uri,
          fileAttributes: {
            metadata: {
              invoiceNumber: this.store.allBills[index].id
                ? this.store.allBills[index].id
                : this.store.allBills[index].tecId,
              contentAuthor: 'sosh',
              datetime: this.store.allBills[index].date,
              datetimeLabel: 'startDate',
              isSubscription: true,
              startDate: this.store.allBills[index].date,
              carbonCopy: true
            }
          }
        })
      }
      await this.saveBills(this.store.dataUri, {
        context,
        fileIdAttributes: ['filename'],
        contentType: 'application/pdf',
        qualificationLabel: 'isp_invoice'
      })
    }
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
    await this.runInWorker('getIdentity')
    await this.saveIdentity(this.store.infosIdentity)
    await this.clickAndWait(
      '#oecs__popin-icon-Identification',
      '#oecs__connecte-se-deconnecter'
    )
    await this.clickAndWait(
      '#oecs__connecte-se-deconnecter',
      '#oecs__connexion'
    )
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

  findPdfButtons() {
    this.log('info', 'Starting findPdfButtons')
    const buttons = Array.from(
      document.querySelectorAll('a[class="icon-pdf-file bp-downloadIcon"]')
    )
    return buttons
  }

  findBillsHistoricButton() {
    this.log('info', 'Starting findPdfButtons')
    const button = document.querySelector('[data-e2e="bp-tile-historic"]')
    return button
  }

  findPdfNumber() {
    this.log('info', 'Starting findPdfNumber')
    const buttons = Array.from(
      document.querySelectorAll('a[class="icon-pdf-file bp-downloadIcon"]')
    )
    return buttons.length
  }

  findStayLoggedButton() {
    this.log('info', 'Starting findStayLoggedButton')
    const button = document.querySelector(
      'button[data-testid="button-keepconnected"]'
    )
    if (button) {
      return true
    }
    return false
  }

  findHelloMessage() {
    this.log('info', 'Starting findHelloMessage')
    const messageSpan = document.querySelector(
      'span[class="d-block text-center"]'
    )
    return messageSpan
  }

  findAccountPage() {
    this.log('info', 'Starting findAccountPage')
    const loginButton = document.querySelector('#oecs__connexion')
    return loginButton
  }

  findAccountList() {
    this.log('info', 'Starting findAccountList')
    let accountList = []
    const accountListElement = document.querySelectorAll(
      'a[data-oevent-action="clic_liste"]'
    )
    for (let i = 0; i < accountListElement.length; i++) {
      let listedEmail =
        accountListElement[i].childNodes[1].children[0].childNodes[0].innerHTML
      accountList.push(listedEmail)
    }
    return accountList
  }

  // ////////
  // WORKER//
  // ////////

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

  waitForRecentPdfClicked(i) {
    let recentPdfs = document.querySelectorAll(
      '[aria-labelledby="bp-billsHistoryTitle"] a[class="icon-pdf-file bp-downloadIcon"]'
    )
    recentPdfs[i].click()
  }

  waitForOldPdfClicked(i) {
    let oldPdfs = document.querySelectorAll(
      '[aria-labelledby="bp-historicBillsHistoryTitle"] a[class="icon-pdf-file bp-downloadIcon"]'
    )
    oldPdfs[i].click()
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

  async getUserMail() {
    return window.o_idzone?.USER_MAIL_ADDRESS
  }

  async findClientRef() {
    let parsedElem
    let clientRef
    if (document.querySelector('a[class="o-link-arrow text-primary pt-0"]')) {
      this.log('info', 'clientRef founded')
      parsedElem = document
        .querySelector('a[class="o-link-arrow text-primary pt-0"]')
        .getAttribute('href')

      const clientRefArray = parsedElem.match(/([0-9]*)/g)
      this.log('info', clientRefArray.length)

      for (let i = 0; i < clientRefArray.length; i++) {
        this.log('info', 'Get in clientRef loop')

        const testedIndex = clientRefArray.pop()
        if (testedIndex.length === 0) {
          this.log('info', 'No clientRef founded')
        } else {
          this.log('info', 'clientRef found')
          clientRef = testedIndex
          break
        }
      }
      return clientRef
    }
  }

  async getPdfNumber() {
    this.log('info', 'Getting in getPdfNumber')
    let pdfNumber = this.findPdfNumber()
    return pdfNumber
  }

  async processingBills() {
    let resolvedBase64 = []
    this.log('info', 'Awaiting promises')
    const recentToBase64 = await Promise.all(
      recentPromisesToConvertBlobToBase64
    )
    const oldToBase64 = await Promise.all(oldPromisesToConvertBlobToBase64)
    this.log('info', 'Processing promises')
    const promisesToBase64 = recentToBase64.concat(oldToBase64)
    const xhrUrls = recentXhrUrls.concat(oldXhrUrls)
    for (let i = 0; i < promisesToBase64.length; i++) {
      resolvedBase64.push({
        uri: promisesToBase64[i],
        href: xhrUrls[i]
      })
    }
    const recentBillsToAdd = recentBills[0].billsHistory.billList
    const oldBillsToAdd = oldBills[0].oldBills
    let allBills = recentBillsToAdd.concat(oldBillsToAdd)
    this.log('info', 'billsArray ready, Sending to pilot')
    await this.sendToPilot({
      resolvedBase64,
      allBills
    })
  }

  async getIdentity() {
    this.log('info', 'Starting getIdentity')
    const checkIdObject = userInfos.length > 0
    let infosIdentity
    if (checkIdObject) {
      const [, firstName, lastName] = document
        .querySelector('div[data-e2e="e2e-personal-info-identity"]')
        .nextSibling.nextSibling.textContent.split(' ')
      const fullName = `${firstName} ${lastName}`
      const postCode = userInfos[0].postalAddress.postalCode
      const city = userInfos[0].postalAddress.cityName
      const streetNumber = userInfos[0].postalAddress.streetNumber.number
      const streetName = userInfos[0].postalAddress.street.name
      const streetType = userInfos[0].postalAddress.street.type
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
      'findClientRef',
      'processingBills',
      'fillForm',
      'getPdfNumber',
      'waitForRecentPdfClicked',
      'waitForOldPdfClicked',
      'getIdentity',
      'checkForCaptcha',
      'waitForCaptchaResolution',
      'getFileName'
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
