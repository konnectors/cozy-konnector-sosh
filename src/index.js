process.env.SENTRY_DSN =
  process.env.SENTRY_DSN ||
  'https://8dd590a871184166afd7e6827339f6a2:3a25ed70fb0249d68d5ab3fbf51a58f3@sentry.cozycloud.cc/27'

const secrets = JSON.parse(process.env.COZY_PARAMETERS || '{}').secret
if (secrets && secrets.proxyUrl) {
  process.env.http_proxy = secrets.proxyUrl
  process.env.https_proxy = secrets.proxyUrl
}

const get = require('lodash/get')

const moment = require('moment')
moment.locale('fr')

const { log, CookieKonnector, errors } = require('cozy-konnector-libs')

class SoshConnector extends CookieKonnector {
  async testSession() {
    try {
      if (!this._jar._jar.toJSON().cookies.length) {
        return false
      }
      log('info', 'Testing session')
      await this.getContracts()
    } catch (err) {
      log('warn', err.message)
      log('warn', 'Session failed')
      return false
    }
  }

  async fetch(fields) {
    if (!(await this.testSession())) {
      await this.logIn(fields)
    }

    const contract = await this.getContracts()

    if (!contract) {
      log('warn', 'Could not find any valid contract')
      return
    }
    const bills = await this.getBills(contract.contractId)

    return this.saveBills(bills, fields.folderPath, {
      timeout: Date.now() + 60 * 1000,
      identifiers: ['sosh', 'orange'],
      dateDelta: 12,
      amountDelta: 5,
      sourceAccount: this.accountId,
      sourceAccountIdentifier: fields.login,
      fileIdAttributes: ['contractNumber', 'vendorRef']
    })
  }

  async logIn(fields) {
    try {
      this.request = this.requestFactory({
        json: true,
        cheerio: false
      })
      const resolveWithFullResponse = true

      // Get cookies from login page.
      log('info', 'Get login form')
      let response = await this.request({
        uri: 'https://login.orange.fr/',
        resolveWithFullResponse
      })

      const headers = {
        'x-auth-id': response.headers['x-auth-id'],
        'x-xsrf-token': response.headers['x-xsrf-token']
      }
      const { login, password } = fields

      log('info', 'Send login with first XSRF token...')

      response = await this.request({
        method: 'POST',
        url: 'https://login.orange.fr/front/login',
        headers,
        body: {
          login
        },
        resolveWithFullResponse
      })

      headers['x-xsrf-token'] = response.headers['x-xsrf-token']
      log('info', 'Send password with second XSRF token...')

      const body = await this.request({
        method: 'POST',
        url: 'https://login.orange.fr/front/password',
        headers,
        body: {
          login,
          password
        }
      })

      if (body.stage === 'changePassword') {
        log('warn', 'Password change needed')
        throw new Error('changePassword')
      }

      if (body.credential != null || body.password != null) {
        throw new Error(body.credential || body.password)
      }
    } catch (err) {
      log('error', err)
      if (err && err.message.includes('bloqué')) {
        throw new Error('LOGIN_FAILED.TOO_MANY_ATTEMPTS')
      } else if (err && err.message.includes('un problème technique')) {
        throw new Error(errors.VENDOR_DOWN)
      } else if (err.statusCode === 401) {
        throw new Error(errors.LOGIN_FAILED)
      } else if (err.message === 'changePassword') {
        throw new Error(errors.USER_ACTION_NEEDED)
      } else {
        throw new Error(errors.VENDOR_DOWN)
      }
    }
    log('info', 'Successfully logged in.')
  }

  async getBills(contractId) {
    this.request = this.requestFactory({
      json: true,
      cheerio: false,
      headers: {
        'X-Orange-Caller-Id': 'ECQ'
      }
    })
    try {
      const bills = await this.request({
        url: `https://sso-f.orange.fr/omoi_erb/facture/v2.0/billsAndPaymentInfos/users/current/contracts/${contractId}`,
        timeout: 5000
      })

      if (!get(bills, 'billsHistory.billList')) return []
      return bills.billsHistory.billList.map(bill => ({
        vendorRef: bill.id,
        contractNumber: contractId,
        date: moment(bill.date, 'YYYY-MM-DD').toDate(),
        vendor: 'Orange',
        amount: bill.amount / 100,
        fileurl:
          'https://sso-f.orange.fr/omoi_erb/facture/v1.0/pdf' + bill.hrefPdf,
        filename: getFileName(bill.date)
      }))
    } catch (err) {
      log('error', err.message)
      throw new Error(errors.VENDOR_DOWN)
    }
  }

  async getContracts() {
    this.request = this.requestFactory({
      json: true,
      cheerio: false,
      headers: {
        'X-Orange-Caller-Id': 'ECQ'
      }
    })
    const contracts = (await this.request({
      url:
        'https://sso-f.orange.fr/omoi_erb/portfoliomanager/v2.0/contractSelector/users/current',
      timeout: 5000
    })).contracts.filter(doc => {
      return doc.offerName.includes('Sosh') || doc.brand === 'Sosh'
    })

    return contracts[0]
  }
}

const connector = new SoshConnector({
  // debug: true
})

connector.run()

function getFileName(date) {
  return `${moment(date, 'YYYY-MM-DD').format('YYYYMM')}_orange.pdf`
}
