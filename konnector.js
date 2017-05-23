const request = require('request')
// require('request-debug')(request)
const moment = require('moment')
const cheerio = require('cheerio')

const {log, baseKonnector, filterExisting, saveDataAndFile, models} = require('cozy-konnector-libs')

// Models
const Bill = models.bill

// Konnector
module.exports = baseKonnector.createNew({
  name: 'Sosh',
  slug: 'sosh',
  description: 'konnector description sosh',
  vendorLink: 'https://www.sosh.fr/',

  category: 'telecom',
  color: {
    hex: '#03A0AA',
    css: '#03A0AA'
  },
  dataType: ['bill'],
  models: [Bill],
  fetchOperations: [
    logIn,
    parsePage,
    customFilterExisting,
    customSaveDataAndFile
  ]
})

// Layer to login to Sosh website.
function logIn (requiredFields, billInfos, data, next) {
  const logInOptions = {
    method: 'GET',
    jar: true,
    url: 'https://id.orange.fr/auth_user/bin/auth_user.cgi' +
             '?service=sosh2&return_url=http%3A%2F%2Fclientsosh.orange.fr'
  }

  const signInOptions = {
    method: 'POST',
    jar: true,
    url: 'https://id.orange.fr/auth_user/bin/auth_user.cgi',
    form: {
      'credential': requiredFields.login,
      'password': requiredFields.password
    }
  }

  const billOptions = {
    method: 'GET',
    jar: true,
    url: 'https://m.espaceclientv3.orange.fr/?page=factures-archives'
  }

  log('info', 'Get login form')
  // Get cookies from login page.
  return request(logInOptions, function (err, res, body) {
    if (err) {
      log('error', err)
      return next('request error')
    }

    // Log in sosh.fr
    log('info', 'Logging in')
    return request(signInOptions, function (err, res, body) {
      if (err) {
        log('error', 'Login failed')
        log('error', err)
        return next('LOGIN_FAILED')
      }

      // Download bill information page.
      log('info', 'Fetch bill info')
      return request(billOptions, function (err, res, body) {
        if (err) {
          log('error', 'An error occured while fetching bills')
          log('error', err)
          return next('request error')
        }

        // check if we are logged in
        const $ = cheerio.load(body)
        const badLogin = $('#default_f_credential').length > 0
        if (badLogin) {
          return next('LOGIN_FAILED')
        }


        log('info', 'Fetch bill info succeeded')
        data.html = body
        return next()
      })
    })
  })
}

// Layer to parse the fetched page to extract bill data.
function parsePage (requiredFields, bills, data, next) {
  bills.fetched = []
  const $ = cheerio.load(data.html)

  // Anaylyze bill listing table.
  log('info', 'Parsing bill pages')
  $('ul.factures li').each(function () {
    const firstCell = $(this).find('span.date')
    const secondCell = $($(this).find('span.montant'))
    const thirdCell = $($(this).find('span.telecharger'))

        // Add a new bill information object.
    const bill = {
      date: moment(firstCell.html(), 'DD/MM/YYYY'),
      amount: parseFloat(secondCell
                .html()
                .replace(' €', '')
                .replace(',', '.')
            ),
      pdfurl: thirdCell.find('a').attr('href'),
      type: 'phone',
      vendor: 'Sosh'
    }

    if ((bill.date != null) && (bill.amount != null)) { return bills.fetched.push(bill) }
  })

  log('info', `Bill retrieved: ${bills.fetched.length} found`)
  return next()
}

function customFilterExisting (requiredFields, entries, data, next) {
  filterExisting(null, Bill)(requiredFields, entries, data, next)
}

function customSaveDataAndFile (requiredFields, entries, data, next) {
  saveDataAndFile(null, Bill, 'sosh', ['facture'])(requiredFields, entries, data, next)
}
