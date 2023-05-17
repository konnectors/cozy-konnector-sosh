import { ContentScript } from 'cozy-clisk/dist/contentscript'
import { blobToBase64 } from 'cozy-clisk/dist/contentscript/utils'
import Minilog from '@cozy/minilog'

const log = Minilog('ContentScript')
Minilog.enable('soshCCC')

const BASE_URL = 'https://www.sosh.fr'
const DEFAULT_PAGE_URL = BASE_URL + '/client'
const DEFAULT_SOURCE_ACCOUNT_IDENTIFIER = 'sosh'

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
  // Intercepting user adresse infomations for Identity object
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
    this.log('info', 'navigateToLoginForm starts')
    await this.goto(
      'https://login.orange.fr/?service=sosh&return_url=https%3A%2F%2Fwww.sosh.fr%2F&propagation=true&domain=sosh&force_authent=true'
    )
    await Promise.race([
      this.waitForElementInWorker('#login-label'),
      this.waitForElementInWorker('#password-label'),
      this.waitForElementInWorker('#oecs__connecte-se-deconnecter'),
      this.waitForElementInWorker('div[class*="captcha_responseContainer"]'),
      this.waitForElementInWorker('#undefined-label')
    ])
    const { askForCaptcha, captchaUrl } = await this.runInWorker(
      'checkForCaptcha'
    )
    if (askForCaptcha) {
      this.log('debug', 'captcha found, waiting for resolution')
      await this.waitForUserAction(captchaUrl)
    }
  }
  async ensureNotAuthenticated() {
    this.log('info', 'ensureNotAuthenticated starts')
    await this.navigateToLoginForm()
    const authenticated = await this.runInWorker('checkAuthenticated')
    if (!authenticated) {
      this.log('info', 'not auth, returning true')
      return true
    }
    this.log('info', 'Auth detected, logging out')
    await this.runInWorker('click', '#oecs__connecte-se-deconnecter')
    await this.waitForElementInWorker('#oecs__connexion')
    return true
  }

  async ensureAuthenticated() {
    this.log('info', 'ensureAuthenticated starts')
    await this.navigateToLoginForm()
    const credentials = await this.getCredentials()
    if (credentials) {
      await this.checkAuthWithCredentials(credentials)
      return true
    }
    if (!credentials) {
      await this.checkAuthWithoutCredentials()
      return true
    }

    this.log('info', 'Not authenticated')
    throw new Error('LOGIN_FAILED')
  }

  async tryAutoLogin(credentials, type) {
    this.log('debug', 'Trying autologin')
    await this.autoLogin(credentials, type)
  }

  async autoLogin(credentials, type) {
    this.log('info', 'Autologin start')
    const emailSelector = '#login'
    const passwordInputSelector = '#password'
    const loginButton = '#btnSubmit'
    if (type === 'half') {
      this.log('debug', 'wait for password field - half')
      await this.waitForElementInWorker(passwordInputSelector)
      await this.runInWorker('fillingForm', credentials)
      await this.runInWorker('click', loginButton)
      await this.waitForElementInWorker('#oecs__connecte-se-deconnecter')
      return true
    }
    await this.waitForElementInWorker(emailSelector)
    await this.runInWorker('fillingForm', credentials)
    await this.runInWorker('click', loginButton)
    this.log('debug', 'wait for password field - full')
    await this.waitForElementInWorker(passwordInputSelector)
    await this.runInWorker('fillingForm', credentials)
    await this.runInWorker('click', loginButton)
  }

  async waitForUserAuthentication() {
    this.log('info', 'waitForUserAuthentication start')
    await this.setWorkerState({ visible: true })
    await this.runInWorkerUntilTrue({ method: 'waitForAuthenticated' })
    await this.setWorkerState({ visible: false })
  }

  async waitForUserAction(url) {
    this.log('info', 'waitForUserAction start')
    await this.setWorkerState({ visible: true, url })
    await this.runInWorkerUntilTrue({ method: 'waitForCaptchaResolution' })
    await this.setWorkerState({ visible: false, url })
  }

  async getUserDataFromWebsite() {
    this.log('info', 'getUserDataFromWebsite starts')
    const sourceAccountId = await this.runInWorker('getUserMail')
    if (sourceAccountId === 'UNKNOWN_ERROR') {
      this.log('debug', "Couldn't get a sourceAccountIdentifier, using default")
      return { sourceAccountIdentifier: DEFAULT_SOURCE_ACCOUNT_IDENTIFIER }
    }
    return {
      sourceAccountIdentifier: sourceAccountId
    }
  }

  async fetch(context) {
    this.log('info', 'fetch start')
    const credentials = await this.getCredentials()
    if (!credentials) {
      await this.saveCredentials(this.store.userCredentials)
    }
    await this.waitForElementInWorker(
      'a[class="o-link-arrow text-primary pt-0"]'
    )
    const clientRef = await this.runInWorker('findClientRef')
    if (clientRef) {
      this.log('debug', 'clientRef found')
      await this.clickAndWait(
        `a[href="https://espace-client.orange.fr/facture-paiement/${clientRef}"]`,
        '[data-e2e="bp-tile-historic"]'
      )
      await this.clickAndWait(
        '[data-e2e="bp-tile-historic"]',
        '[aria-labelledby="bp-billsHistoryTitle"]'
      )
      const redFrame = await this.runInWorker('checkRedFrame')
      if (redFrame !== null) {
        this.log('debug', 'Website did not load the bills')
        throw new Error('VENDOR_DOWN')
      }
      let recentPdfNumber = await this.runInWorker('getPdfNumber')
      await this.clickAndWait(
        '[data-e2e="bh-more-bills"]',
        '[aria-labelledby="bp-historicBillsHistoryTitle"]'
      )
      let allPdfNumber = await this.runInWorker('getPdfNumber')
      let oldPdfNumber = allPdfNumber - recentPdfNumber
      for (let i = 0; i < recentPdfNumber; i++) {
        // If something went wrong during the loading of the pdf board, a red frame with an error message appears
        // So we need to check every lap to see if we got one
        const redFrame = await this.runInWorker('checkRedFrame')
        if (redFrame !== null) {
          this.log('debug', 'Something went wrong during recent pdfs loading')
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
      this.log('debug', 'recentPdf loop ended')
      for (let i = 0; i < oldPdfNumber; i++) {
        // Same as above with the red frame, but for old bills board
        const redFrame = await this.runInWorker('checkOldBillsRedFrame')
        if (redFrame !== null) {
          this.log('debug', 'Something went wrong during old pdfs loading')
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
      this.log('debug', 'oldPdf loop ended')
      this.log('debug', 'pdfButtons all clicked')
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
          filename: await getFileName(
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

  findMoreBillsButton() {
    this.log('debug', 'Starting findMoreBillsButton')
    const button = Array.from(
      document.querySelector('[data-e2e="bh-more-bills"]')
    )
    this.log('debug', 'Exiting findMoreBillsButton')
    return button
  }

  findPdfButtons() {
    this.log('debug', 'Starting findPdfButtons')
    const buttons = Array.from(
      document.querySelectorAll('a[class="icon-pdf-file bp-downloadIcon"]')
    )
    return buttons
  }

  findBillsHistoricButton() {
    this.log('debug', 'Starting findPdfButtons')
    const button = document.querySelector('[data-e2e="bp-tile-historic"]')
    return button
  }

  findPdfNumber() {
    this.log('debug', 'Starting findPdfNumber')
    const buttons = Array.from(
      document.querySelectorAll('a[class="icon-pdf-file bp-downloadIcon"]')
    )
    return buttons.length
  }

  findStayLoggedButton() {
    this.log('debug', 'Starting findStayLoggedButton')
    const button = document.querySelector(
      '[data-oevent-label="bouton_rester_identifie"]'
    )
    return button
  }

  findHelloMessage() {
    this.log('debug', 'Starting findStayLoggedButton')
    const messageSpan = document.querySelector(
      'span[class="d-block text-center"]'
    )
    return messageSpan
  }

  findLoginButton() {
    this.log('debug', 'Starting findLoginButton')
    const loginButton = document.querySelector('#oecs__connexion')
    return loginButton
  }

  findAccountPage() {
    this.log('debug', 'Starting findLoginButton')
    const loginButton = document.querySelector('#oecs__connexion')
    return loginButton
  }

  findAccountList() {
    this.log('debug', 'Starting findAccountList')
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

  async checkAuthWithCredentials(credentials) {
    this.log('info', 'authWithCredentials starts')
    await this.waitForElementInWorker('#oecs__aide-contact')
    const helloMessage = await this.runInWorker('getHelloMessage')
    if (helloMessage) {
      // If helloMessage is found, return true to continue the process as we are already logged in
      return true
    }
    const loginPage = await this.runInWorker('getLoginPage')

    if (!loginPage) {
      const accountPage = await this.runInWorker('getAccountPage')
      if (!accountPage) {
        const accountListElement = await this.runInWorker('getAccountList')
        for (let i = 0; i < accountListElement.length; i++) {
          this.log('debug', 'getting in accountList loop')
          const findMail = accountListElement[i]
          if (findMail === credentials.email) {
            this.log(
              'info',
              'One mail in accountList match saved credentials, continue'
            )
            await this.runInWorker('accountSelection', i)
            break
          }
        }
      }
    }
    this.log('debug', 'found credentials, processing')
    const askFullLogin = await this.runInWorker('checkAskFullLogin')
    if (askFullLogin) {
      this.log('debug', 'askFullLogin condition')
      await this.tryAutoLogin(credentials, 'full')
      return true
    }
    const testEmail = await this.runInWorker('getTestEmail')
    if (credentials.email === testEmail) {
      this.log('debug', 'sameMailLogin condition')
      await this.sameMailLogin(credentials)
    }
    if (credentials.email != testEmail) {
      this.log('debug', 'differentMailLogin condition')
      await this.differentMailLogin(credentials)
    }
  }

  async checkAuthWithoutCredentials() {
    this.log('info', 'checkAuthWithoutCredentials starts')
    const helloMessage = await this.runInWorker('getHelloMessage')
    if (helloMessage) {
      this.log('debug', 'no credentials found but user is still logged in')
      return true
    }
    const isAccountListPage = await this.runInWorker('checkAccountListPage')
    if (isAccountListPage) {
      this.log('debug', 'Webview on accountsList page, go to first login step')
      await this.runInWorker('click', '#undefined-label')
      await this.waitForElementInWorker('#login-label')
    }
    this.log('debug', 'no credentials found, use normal user login')
    await this.waitForUserAuthentication()
    return true
  }

  async sameMailLogin(credentials) {
    const stayLogButton = await this.runInWorker('getStayLoggedButton')
    if (stayLogButton != null) {
      stayLogButton.click()
      await this.waitForElementInWorker('#oecs__connecte')
      return true
    }
    this.log('debug', 'found credentials, trying to autoLog')
    await this.tryAutoLogin(credentials, 'half')
    return true
  }

  async differentMailLogin(credentials) {
    this.log('debug', 'getting in different testEmail conditions')
    await this.clickAndWait('#changeAccountLink', '#undefined-label')
    await this.clickAndWait('#undefined-label', '#login')
    await this.tryAutoLogin(credentials, 'full')
    return true
  }

  // ////////
  // WORKER//
  // ////////

  getLogoutButton() {
    this.log('debug', 'Starting getLogoutButton')
    const logoutButton = document.querySelector(
      '#oecs__connecte-se-deconnecter'
    )
    return logoutButton
  }

  async getAccountList() {
    this.log('debug', 'Starting getAccountList')
    const accountList = this.findAccountList()
    return accountList
  }

  async clickLoginPage() {
    this.log('debug', 'Starting clickLoginPage')
    document.querySelector('#oecs__connexion').click()
  }

  async accountSelection(i) {
    this.log('debug', 'Starting accountSelection')
    document.querySelectorAll('a[data-oevent-action="clic_liste"]')[i].click()
  }

  async getAccountPage() {
    this.log('debug', 'Starting getAccountPage')
    const accountButton = this.findAccountPage()
    return accountButton
  }

  async getLoginPage() {
    this.log('debug', 'Starting findLoginButton')
    const loginButton = this.findLoginButton()
    return loginButton
  }

  async waitForFullLoading() {
    window.addEventListener('load', () => {
      this.log('debug', 'Page fully loaded')
      this.log('debug', document.location.href)
      return true
    })
    return false
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

  async fillingForm(credentials) {
    if (document.querySelector('#login')) {
      this.log('debug', 'filling email field')
      document.querySelector('#login').value = credentials.email
      return
    }
    if (document.querySelector('#password')) {
      this.log('debug', 'filling password field')
      document.querySelector('#password').value = credentials.password
      return
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
      this.log('debug', 'Sending user credentials to Pilot')
      this.sendToPilot({
        userCredentials
      })
    }
    if (
      document.location.href.includes(DEFAULT_PAGE_URL) &&
      document.querySelector('#oecs__connecte')
    ) {
      this.log('debug', 'Check Authenticated succeeded')
      return true
    }
    if (
      document.location.href.includes(DEFAULT_PAGE_URL) &&
      document.querySelector('#oecs__connecte-se-deconnecter')
    ) {
      this.log('debug', 'Active session found, returning true')
      return true
    }

    //
    return false
  }

  async getUserMail() {
    try {
      const result = document.querySelector(
        '.oecs__zone-footer-button-mail'
      ).innerHTML
      if (result) {
        return result
      }
    } catch (err) {
      if (
        err.message === "Cannot read properties of null (reading 'innerHTML')"
      ) {
        this.log(
          'info',
          `Error message : ${err.message}, trying to reload page`
        )
        window.location.reload()
        this.log('debug', 'Profil homePage reloaded')
      } else {
        this.log('debug', 'Untreated problem encountered')
        return 'UNKNOWN_ERROR'
      }
    }
    return false
  }

  async getHelloMessage() {
    this.log('debug', 'Starting findHelloMessage')
    const messageSpan = this.findHelloMessage()
    return messageSpan
  }

  async findClientRef() {
    let parsedElem
    let clientRef
    if (document.querySelector('a[class="o-link-arrow text-primary pt-0"]')) {
      this.log('debug', 'clientRef founded')
      parsedElem = document
        .querySelector('a[class="o-link-arrow text-primary pt-0"]')
        .getAttribute('href')

      const clientRefArray = parsedElem.match(/([0-9]*)/g)
      this.log('debug', clientRefArray.length)

      for (let i = 0; i < clientRefArray.length; i++) {
        this.log('debug', 'Get in clientRef loop')

        const testedIndex = clientRefArray.pop()
        if (testedIndex.length === 0) {
          this.log('debug', 'No clientRef founded')
        } else {
          this.log('debug', 'clientRef founded')
          clientRef = testedIndex
          break
        }
      }
      return clientRef
    }
  }

  async checkRedFrame() {
    const redFrame = document.querySelector('.alert-icon icon-error-severe')
    return redFrame
  }

  async checkOldBillsRedFrame() {
    const redFrame = document.querySelector(
      'span[class="alert-icon icon-error-severe"]'
    )
    return redFrame
  }

  async getStayLoggedButton() {
    this.log('debug', 'Starting getStayLoggedButton')
    const button = this.findStayLoggedButton()
    return button
  }

  async getTestEmail() {
    this.log('debug', 'Getting in getTestEmail')
    const result = document
      .querySelector('p[data-testid="selected-account-login"]')
      .innerHTML.replace('<strong>', '')
      .replace('</strong>', '')
    if (result) {
      return result
    }
    return null
  }

  async getMoreBillsButton() {
    this.log('debug', 'Getting in getMoreBillsButton')
    let moreBillsButton = this.findMoreBillsButton()
    return moreBillsButton
  }

  async getPdfNumber() {
    this.log('debug', 'Getting in getPdfNumber')
    let pdfNumber = this.findPdfNumber()
    return pdfNumber
  }

  async processingBills() {
    let resolvedBase64 = []
    this.log('debug', 'Awaiting promises')
    const recentToBase64 = await Promise.all(
      recentPromisesToConvertBlobToBase64
    )
    const oldToBase64 = await Promise.all(oldPromisesToConvertBlobToBase64)
    this.log('debug', 'Processing promises')
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
    this.log('debug', 'billsArray ready, Sending to pilot')
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

  checkAskFullLogin() {
    if (document.querySelector('#login-label')) {
      return true
    } else {
      return false
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

  async waitForCaptchaResolution() {
    const passwordInput = document.querySelector('#password')
    const loginInput = document.querySelector('#login')
    const otherAccountButton = document.querySelector('#undefined-label')
    if (passwordInput || loginInput || otherAccountButton) {
      return true
    }
    return false
  }

  async checkAccountListPage() {
    const isAccountListPage = Boolean(
      document.querySelector('#undefined-label')
    )
    if (isAccountListPage) return true
    return false
  }
}

const connector = new SoshContentScript()
connector
  .init({
    additionalExposedMethodsNames: [
      'getUserMail',
      'findClientRef',
      'processingBills',
      'getMoreBillsButton',
      'checkRedFrame',
      'checkOldBillsRedFrame',
      'getTestEmail',
      'fillingForm',
      'getStayLoggedButton',
      'getHelloMessage',
      'getPdfNumber',
      'waitForRecentPdfClicked',
      'waitForOldPdfClicked',
      'waitForFullLoading',
      'getLoginPage',
      'getAccountPage',
      'clickLoginPage',
      'getAccountList',
      'accountSelection',
      'getLogoutButton',
      'getIdentity',
      'checkAskFullLogin',
      'checkForCaptcha',
      'waitForCaptchaResolution',
      'checkAccountListPage'
    ]
  })
  .catch(err => {
    log.warn(err)
  })

// Used for debug purposes only
// function sleep(delay) {
//   return new Promise(resolve => {
//     setTimeout(resolve, delay * 1000)
//   })
// }

async function getFileName(date, amount, vendorRef) {
  const digestId = await hashVendorRef(vendorRef)
  const shortenedId = digestId.substr(0, 5)
  return `${date}_sosh_${amount}€_${shortenedId}.pdf`
}

async function hashVendorRef(vendorRef) {
  const msgUint8 = new window.TextEncoder().encode(vendorRef) // encode as (utf-8) Uint8Array
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgUint8) // hash the message
  const hashArray = Array.from(new Uint8Array(hashBuffer)) // convert buffer to byte array
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('') // convert bytes to hex string
  return hashHex
}
