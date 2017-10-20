const moment = require('moment')
moment.locale('fr')

const { log, BaseKonnector, saveBills, request } = require('cozy-konnector-libs')

let rq = request({
  // debug: true,
  jar: true
})

module.exports = new BaseKonnector(function fetch (fields) {
  return logIn.bind(this)(fields)
  .then(parsePage)
  .then(entries => saveBills(entries, fields.folderPath, {
    timeout: Date.now() + 60 * 1000,
    identifiers: ['sosh'],
    dateDelta: 12,
    amountDelta: 5
  }))
})

// Layer to login to Orange website.
function logIn (fields) {
  // Get cookies from login page.
  log('info', 'Get login form')
  return rq('https://id.orange.fr/auth_user/bin/auth_user.cgi')
  // Log in orange.fr
  .then(() => rq({
    method: 'POST',
    url: 'https://id.orange.fr/auth_user/bin/auth_user.cgi',
    form: {
      credential: fields.login,
      password: fields.password
    }
  }))
  .then(body => {
    if (body.credential != null || body.password != null) {
      throw new Error(body.credential || body.password)
    }
  })
  .catch(err => {
    log('error', 'Error while trying to login')
    log('error', err)
    this.terminate('LOGIN_FAILED')
  })
  .then(() => {
    rq = request({
      json: false,
      cheerio: true,
      jar: true
    })
    return rq('https://espaceclientv3.orange.fr/?page=factures-historique')
  })
  .then($ => {
    // if multiple contracts choices, choose the first one
    const contractChoices = $('.ec-contractPanel-description a').map(function (index, elem) {
      const $elem = $(elem)
      return {
        link: $elem.attr('href'),
        text: $elem.text()
      }
    }).get().filter(value => value.text.includes('Sosh'))
    if (contractChoices.length) {
      // take the first sosh contract at the moment
      return rq(`https://espaceclientv3.orange.fr/${contractChoices[0].link}`)
    } else return $
  })
}

// Layer to parse the fetched page to extract bill data.
function parsePage ($) {
  const entries = []

  // Anaylyze bill listing table.
  log('info', 'Parsing bill pages')
  $('table tbody tr').each(function () {
    let date = $(this).find('td[headers=ec-dateCol]').text()
    date = moment(date, 'LL')
    let amount = $(this).find('td[headers=ec-amountCol]').text()
    amount = parseFloat(amount.trim().replace(' €', '').replace(',', '.'))
    let fileurl = $(this).find('td[headers=ec-downloadCol] a').attr('href')

    // Add a new bill information object.
    let bill = {
      date: date.toDate(),
      amount,
      fileurl,
      filename: getFileName(date),
      type: 'phone',
      vendor: 'Sosh'
    }

    if (bill.date != null && bill.amount != null) {
      entries.push(bill)
    }
  })

  log('info', `Bill retrieved: ${entries.length} found`)
  return entries
}

function getFileName (date) {
  return `${date.format('YYYYMM')}_sosh.pdf`
}
