export default class XhrInterceptor {
  constructor() {
    this.recentBills = null
    this.userInfos = null
  }

  init() {
    const self = this
    // The override here is needed to intercept XHR requests made during the navigation
    // The website respond with an XHR containing a blob when asking for a pdf, so we need to get it and encode it into base64 before giving it to the pilot.
    var proxied = window.XMLHttpRequest.prototype.open
    // Overriding the open() method
    window.XMLHttpRequest.prototype.open = function () {
      var originalResponse = this
      // Intercepting response for recent bills informations.
      if (arguments[1]?.includes('/users/current/contracts')) {
        originalResponse.addEventListener('readystatechange', function () {
          if (originalResponse.readyState === 4) {
            const jsonBills = JSON.parse(originalResponse.responseText)
            self.recentBills = jsonBills
          }
        })
        return proxied.apply(this, [].slice.call(arguments))
      }

      // Intercepting billingAddress infos for Identity object
      if (arguments[1]?.includes('ecd_wp/account/billingAddresses')) {
        originalResponse.addEventListener('readystatechange', function () {
          if (originalResponse.readyState === 4) {
            const jsonInfos = JSON.parse(originalResponse.responseText)
            self.userInfos = jsonInfos
          }
        })
        return proxied.apply(this, [].slice.call(arguments))
      }

      return proxied.apply(this, [].slice.call(arguments))
    }
  }
}
