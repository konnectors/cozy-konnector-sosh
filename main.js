/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(2);
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
Object.defineProperty(exports, "ContentScript", ({
  enumerable: true,
  get: function get() {
    return _ContentScript.default;
  }
}));
Object.defineProperty(exports, "RequestInterceptor", ({
  enumerable: true,
  get: function get() {
    return _RequestInterceptor.default;
  }
}));
var _ContentScript = _interopRequireDefault(__webpack_require__(3));
var _RequestInterceptor = _interopRequireDefault(__webpack_require__(52));

/***/ }),
/* 2 */
/***/ ((module) => {

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}
module.exports = _interopRequireDefault, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 3 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(2);
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = exports.WORKER_TYPE = exports.PILOT_TYPE = void 0;
var _regenerator = _interopRequireDefault(__webpack_require__(4));
var _defineProperty2 = _interopRequireDefault(__webpack_require__(7));
var _toConsumableArray2 = _interopRequireDefault(__webpack_require__(10));
var _asyncToGenerator2 = _interopRequireDefault(__webpack_require__(16));
var _classCallCheck2 = _interopRequireDefault(__webpack_require__(17));
var _createClass2 = _interopRequireDefault(__webpack_require__(18));
var _minilog = _interopRequireDefault(__webpack_require__(19));
var _record = __webpack_require__(31);
var _umd = _interopRequireDefault(__webpack_require__(32));
var _pTimeout = _interopRequireDefault(__webpack_require__(33));
var _pWaitFor = _interopRequireWildcard(__webpack_require__(34));
var _utils = __webpack_require__(35);
var _package = _interopRequireDefault(__webpack_require__(36));
var _LauncherBridge = _interopRequireDefault(__webpack_require__(37));
var _utils2 = __webpack_require__(46);
var _wrapTimer = __webpack_require__(51);
var _window; // @ts-check
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2.default)(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
var _log = (0, _minilog.default)('ContentScript class');
var s = 1000;
var m = 60 * s;
var DEFAULT_LOGIN_TIMEOUT = 5 * m;
var DEFAULT_WAIT_FOR_ELEMENT_TIMEOUT = 30 * s;
var DEFAULT_WAIT_FOR_ELEMENT_ACCROSS_PAGES_TIMEOUT = 60 * s;
var PILOT_TYPE = exports.PILOT_TYPE = 'pilot';
var WORKER_TYPE = exports.WORKER_TYPE = 'worker';
if ((_window = window) !== null && _window !== void 0 && _window.addEventListener) {
  // allows cozy-clisk to be embedded in other envs (react-native, jest)
  window.addEventListener('load', function () {
    sendPageMessage('load');
  });
  window.addEventListener('DOMContentLoaded', function () {
    sendPageMessage('DOMContentLoaded');
  });
}
var ContentScript = exports["default"] = /*#__PURE__*/function () {
  function ContentScript() {
    var _this = this;
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck2.default)(this, ContentScript);
    sendPageMessage('NEW_WORKER_INITIALIZING');
    var logDebug = function logDebug(message) {
      return _this.log('debug', message);
    };
    var wrapTimerDebug = (0, _wrapTimer.wrapTimerFactory)({
      logFn: logDebug
    });
    var logInfo = function logInfo(message) {
      return _this.log('info', message);
    };
    var wrapTimerInfo = (0, _wrapTimer.wrapTimerFactory)({
      logFn: logInfo
    });
    this.ensureAuthenticated = wrapTimerInfo(this, 'ensureAuthenticated');
    this.ensureNotAuthenticated = wrapTimerInfo(this, 'ensureNotAuthenticated');
    this.getUserDataFromWebsite = wrapTimerInfo(this, 'getUserDataFromWebsite');
    this.fetch = wrapTimerInfo(this, 'fetch');
    this.waitForAuthenticated = wrapTimerDebug(this, 'waitForAuthenticated');
    this.waitForNotAuthenticated = wrapTimerDebug(this, 'waitForNotAuthenticated');
    this.runInWorker = wrapTimerDebug(this, 'runInWorker', {
      suffixFn: function suffixFn(args) {
        return args === null || args === void 0 ? void 0 : args[0];
      }
    });
    this.runInWorkerUntilTrue = wrapTimerDebug(this, 'runInWorkerUntilTrue', {
      suffixFn: function suffixFn(args) {
        var _args$;
        return (_args$ = args[0]) === null || _args$ === void 0 ? void 0 : _args$.method;
      }
    });
    this.waitForElementInWorker = wrapTimerDebug(this, 'waitForElementInWorker', {
      suffixFn: function suffixFn(args) {
        return args === null || args === void 0 ? void 0 : args[0];
      }
    });
    this.clickAndWait = wrapTimerDebug(this, 'clickAndWait', {
      suffixFn: function suffixFn(args) {
        return "".concat(args === null || args === void 0 ? void 0 : args[0], " ").concat(args === null || args === void 0 ? void 0 : args[1]);
      }
    });
    this.saveFiles = wrapTimerDebug(this, 'saveFiles', {
      suffixFn: function suffixFn(args) {
        return "".concat(args === null || args === void 0 ? void 0 : args[0].length, " files");
      }
    });
    this.saveBills = wrapTimerDebug(this, 'saveBills');
    this.getCredentials = wrapTimerDebug(this, 'getCredentials');
    this.saveCredentials = wrapTimerDebug(this, 'saveCredentials');
    this.saveIdentity = wrapTimerDebug(this, 'saveIdentity');
    this.getCookiesByDomain = wrapTimerDebug(this, 'getCookiesByDomain', {
      suffixFn: function suffixFn(args) {
        return args === null || args === void 0 ? void 0 : args[0];
      }
    });
    this.getCookieFromKeychainByName = wrapTimerDebug(this, 'getCookieFromKeychainByName', {
      suffixFn: function suffixFn(args) {
        return args === null || args === void 0 ? void 0 : args[0];
      }
    });
    this.saveCookieToKeychain = wrapTimerDebug(this, 'saveCookieToKeychain', {
      suffixFn: function suffixFn(args) {
        return args === null || args === void 0 ? void 0 : args[0];
      }
    });
    this.getCookieByDomainAndName = wrapTimerDebug(this, 'getCookieByDomainAndName', {
      suffixFn: function suffixFn(args) {
        return "".concat(args === null || args === void 0 ? void 0 : args[0], " ").concat(args === null || args === void 0 ? void 0 : args[1]);
      }
    });
    this.goto = wrapTimerDebug(this, 'goto', {
      suffixFn: function suffixFn(args) {
        return args === null || args === void 0 ? void 0 : args[0];
      }
    });
    this.downloadFileInWorker = wrapTimerDebug(this, 'downloadFileInWorker', {
      suffixFn: function suffixFn(args) {
        var _args$2;
        return args === null || args === void 0 || (_args$2 = args[0]) === null || _args$2 === void 0 ? void 0 : _args$2.fileurl;
      }
    });
    this.waitForRequestInterception = wrapTimerDebug(this, 'waitForRequestInterception', {
      suffixFn: function suffixFn(args) {
        return args === null || args === void 0 ? void 0 : args[0];
      }
    });
    if (options.requestInterceptor) {
      this.requestInterceptor = options.requestInterceptor;
      this.requestInterceptor.setLogger(this.log.bind(this));
    }
    if (options.recordOptions) {
      this.recordOptions = options.recordOptions;
    }
  }
  /**
   * Init the bridge communication with the launcher.
   * It also exposes the methods which will be callable by the launcher
   *
   * @param {object} options : options object
   * @param {Array<string>} [options.additionalExposedMethodsNames] : list of additional method of the
   * content script to expose. To make it callable via the worker.
   */
  (0, _createClass2.default)(ContentScript, [{
    key: "init",
    value: (function () {
      var _init = (0, _asyncToGenerator2.default)(/*#__PURE__*/_regenerator.default.mark(function _callee() {
        var _this2 = this;
        var options,
          exposedMethodsNames,
          exposedMethods,
          _i,
          _exposedMethodsNames,
          method,
          _args = arguments;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              options = _args.length > 0 && _args[0] !== undefined ? _args[0] : {};
              this.bridge = new _LauncherBridge.default({
                localWindow: window
              });
              exposedMethodsNames = ['setContentScriptType', 'ensureAuthenticated', 'ensureNotAuthenticated', 'checkAuthenticated', 'waitForAuthenticated', 'waitForNotAuthenticated', 'waitForElementNoReload', 'getUserDataFromWebsite', 'fetch', 'click', 'fillText', 'storeFromWorker', 'clickAndWait', 'getCookiesByDomain', 'getCookieByDomainAndName', 'downloadFileInWorker', 'getDebugData', 'getCliskVersion', 'checkForElement', 'evaluate'];
              if (options.additionalExposedMethodsNames) {
                exposedMethodsNames.push.apply(exposedMethodsNames, options.additionalExposedMethodsNames);
              }
              exposedMethods = {}; // TODO error handling
              // should catch and call onError on the launcher to let it handle the job update
              for (_i = 0, _exposedMethodsNames = exposedMethodsNames; _i < _exposedMethodsNames.length; _i++) {
                method = _exposedMethodsNames[_i];
                exposedMethods[method] = this[method].bind(this);
              }
              this.store = {};
              _context.next = 9;
              return this.bridge.init({
                exposedMethods: exposedMethods
              });
            case 9:
              window.onbeforeunload = function () {
                return _this2.log('debug', "window.beforeunload detected with previous url : ".concat(document.location));
              };
            case 10:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }));
      function init() {
        return _init.apply(this, arguments);
      }
      return init;
    }()
    /**
     * This method is called when the worker is ready on the current page. This is a good place to
     * subscribe to dom events for examples. These subscriptions will be replayed on each worker page
     * reload
     */
    )
  }, {
    key: "onWorkerReady",
    value: function onWorkerReady() {}

    /**
     * This method is called fon the pilot when the worker sends workerEvent events to the bridge
     */
  }, {
    key: "onWorkerEvent",
    value: function onWorkerEvent() {}

    /**
     * Set the ContentScript type. This is usefull to know which webview is the pilot or the worker
     *
     * @param {string} contentScriptType - ("pilot" | "worker")
     */
  }, {
    key: "setContentScriptType",
    value: (function () {
      var _setContentScriptType = (0, _asyncToGenerator2.default)(/*#__PURE__*/_regenerator.default.mark(function _callee2(contentScriptType) {
        var _this3 = this;
        var options,
          _this$requestIntercep,
          _args2 = arguments;
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              options = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : {};
              this.contentScriptType = contentScriptType;
              _log.info("I am the ".concat(contentScriptType));
              if (this.bridge) {
                _context2.next = 5;
                break;
              }
              throw new Error('No bridge is defined, you should call ContentScript.init before using this method');
            case 5:
              if (contentScriptType === WORKER_TYPE) {
                this.initRecorder(options.shouldRecord);
                this.onWorkerReady();
                (_this$requestIntercep = this.requestInterceptor) === null || _this$requestIntercep === void 0 || _this$requestIntercep.on('response', function (response) {
                  var _this3$bridge;
                  (_this3$bridge = _this3.bridge) === null || _this3$bridge === void 0 || _this3$bridge.emit('workerEvent', {
                    event: 'requestResponse',
                    payload: response
                  });
                });
              } else if (contentScriptType === PILOT_TYPE) {
                this.bridge.addEventListener('workerEvent', this.onWorkerEvent.bind(this));
              }
            case 6:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this);
      }));
      function setContentScriptType(_x) {
        return _setContentScriptType.apply(this, arguments);
      }
      return setContentScriptType;
    }()
    /**
     * Check if the user is authenticated or not. This method is made to be overloaded by the child class
     *
     * @returns {Promise.<boolean>} : true if authenticated or false in other case
     */
    )
  }, {
    key: "checkAuthenticated",
    value: (function () {
      var _checkAuthenticated = (0, _asyncToGenerator2.default)(/*#__PURE__*/_regenerator.default.mark(function _callee3() {
        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              return _context3.abrupt("return", false);
            case 1:
            case "end":
              return _context3.stop();
          }
        }, _callee3);
      }));
      function checkAuthenticated() {
        return _checkAuthenticated.apply(this, arguments);
      }
      return checkAuthenticated;
    }()
    /**
     * This method is made to run in the worker and will resolve as true when
     * the user is authenticated
     *
     * @param {object} options        - options object
     * @param {number} [options.timeout] - number of miliseconds before the function sends a timeout error. Default 5m
     * @param {number} [options.interval] - interval in ms between checkAuthenticated calls. Default 1s
     * @returns {Promise.<true>} : if authenticated
     * @throws {TimeoutError}: TimeoutError from p-wait-for package if timeout expired
     */
    )
  }, {
    key: "waitForAuthenticated",
    value: (function () {
      var _waitForAuthenticated = (0, _asyncToGenerator2.default)(/*#__PURE__*/_regenerator.default.mark(function _callee4() {
        var options,
          timeout,
          interval,
          _args4 = arguments;
        return _regenerator.default.wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              options = _args4.length > 0 && _args4[0] !== undefined ? _args4[0] : {};
              this.onlyIn(WORKER_TYPE, 'waitForAuthenticated');
              timeout = options.timeout || DEFAULT_LOGIN_TIMEOUT;
              interval = options.interval || 1000;
              _context4.next = 6;
              return (0, _pWaitFor.default)(this.checkAuthenticated.bind(this), {
                interval: interval,
                timeout: {
                  milliseconds: timeout,
                  message: new _pWaitFor.TimeoutError("waitForAuthenticated timed out after ".concat(timeout, "ms"))
                }
              });
            case 6:
              return _context4.abrupt("return", true);
            case 7:
            case "end":
              return _context4.stop();
          }
        }, _callee4, this);
      }));
      function waitForAuthenticated() {
        return _waitForAuthenticated.apply(this, arguments);
      }
      return waitForAuthenticated;
    }()
    /**
     * Resolves when the dom is ready (DOMContentLoaded event)
     *
     * @returns {Promise<void>}
     */
    )
  }, {
    key: "waitForDomReady",
    value: (function () {
      var _waitForDomReady = (0, _asyncToGenerator2.default)(/*#__PURE__*/_regenerator.default.mark(function _callee5() {
        var self, domReadyPromise;
        return _regenerator.default.wrap(function _callee5$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              self = this;
              domReadyPromise = new Promise(function (resolve) {
                var _document, _document2, _document3;
                // first check if the DOMContentLoad has already been called
                if (((_document = document) === null || _document === void 0 ? void 0 : _document.readyState) === 'complete' || ((_document2 = document) === null || _document2 === void 0 ? void 0 : _document2.readyState) === 'loaded' || ((_document3 = document) === null || _document3 === void 0 ? void 0 : _document3.readyState) === 'interactive') {
                  resolve();
                } else {
                  window.addEventListener('DOMContentLoaded', function () {
                    resolve();
                  });
                }
              });
              return _context5.abrupt("return", (0, _pTimeout.default)(domReadyPromise, {
                milliseconds: 10000,
                fallback: function fallback() {
                  return self.log('warn', 'waitForDomReady timed out after 10s, we may have missed the DOMContentLoad event');
                }
              }));
            case 3:
            case "end":
              return _context5.stop();
          }
        }, _callee5, this);
      }));
      function waitForDomReady() {
        return _waitForDomReady.apply(this, arguments);
      }
      return waitForDomReady;
    }()
    /**
     * This method is made to run in the worker and will resolve as true when
     * the user is not authenticated
     *
     * @param {object} options        - options object
     * @param {number} [options.timeout] - number of miliseconds before the function sends a timeout error. Default 30s
     * @param {number} [options.interval] - interval in ms between checkAuthenticated calls. Default 1s
     * @returns {Promise.<true>} : if not authenticated
     * @throws {TimeoutError}: TimeoutError from p-wait-for package if timeout expired
     */
    )
  }, {
    key: "waitForNotAuthenticated",
    value: (function () {
      var _waitForNotAuthenticated = (0, _asyncToGenerator2.default)(/*#__PURE__*/_regenerator.default.mark(function _callee7() {
        var _this4 = this;
        var options,
          timeout,
          interval,
          _args7 = arguments;
        return _regenerator.default.wrap(function _callee7$(_context7) {
          while (1) switch (_context7.prev = _context7.next) {
            case 0:
              options = _args7.length > 0 && _args7[0] !== undefined ? _args7[0] : {};
              this.onlyIn(WORKER_TYPE, 'waitForNotAuthenticated');
              timeout = options.timeout || DEFAULT_WAIT_FOR_ELEMENT_TIMEOUT;
              interval = options.interval || 1000;
              _context7.next = 6;
              return (0, _pWaitFor.default)(/*#__PURE__*/(0, _asyncToGenerator2.default)(/*#__PURE__*/_regenerator.default.mark(function _callee6() {
                var authenticated;
                return _regenerator.default.wrap(function _callee6$(_context6) {
                  while (1) switch (_context6.prev = _context6.next) {
                    case 0:
                      _context6.next = 2;
                      return _this4.checkAuthenticated.bind(_this4)();
                    case 2:
                      authenticated = _context6.sent;
                      return _context6.abrupt("return", !authenticated);
                    case 4:
                    case "end":
                      return _context6.stop();
                  }
                }, _callee6);
              })), {
                interval: interval,
                timeout: {
                  milliseconds: timeout,
                  message: new _pWaitFor.TimeoutError("waitForNotAuthenticated timed out after ".concat(timeout, "ms"))
                }
              });
            case 6:
              return _context7.abrupt("return", true);
            case 7:
            case "end":
              return _context7.stop();
          }
        }, _callee7, this);
      }));
      function waitForNotAuthenticated() {
        return _waitForNotAuthenticated.apply(this, arguments);
      }
      return waitForNotAuthenticated;
    }()
    /**
     * Wait for the given identified request to be intercepted. The identified request must be defined and
     * sent to the ContentScript constructor
     *
     * @param {string} identifier - any identifier string defined in the RequestInterceptor
     * @param {object} [options] - options object
     * @param {number} [options.timeout] - number of miliseconds before the function sends a timeout error. Default 60000ms
     */
    )
  }, {
    key: "waitForRequestInterception",
    value: function waitForRequestInterception(identifier) {
      var _options$timeout,
        _this5 = this;
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      this.onlyIn(PILOT_TYPE, 'waitForRequestInterception');
      var timeout = (_options$timeout = options === null || options === void 0 ? void 0 : options.timeout) !== null && _options$timeout !== void 0 ? _options$timeout : 60000;
      var interceptionPromise = new Promise(function (resolve) {
        var listener = function listener(_ref2) {
          var event = _ref2.event,
            payload = _ref2.payload;
          if (event === 'requestResponse' && payload.identifier === identifier) {
            if (!_this5.bridge) {
              throw new Error('No bridge is defined, you should call ContentScript.init before using this method');
            }
            _this5.bridge.removeEventListener('workerEvent', listener);
            resolve(payload);
          }
        };
        if (!_this5.bridge) {
          throw new Error('No bridge is defined, you should call ContentScript.init before using this method');
        }
        _this5.bridge.addEventListener('workerEvent', listener);
      });
      return (0, _pTimeout.default)(interceptionPromise, {
        milliseconds: timeout,
        message: "Timed out after waiting ".concat(timeout, "ms for interception of ").concat(identifier)
      });
    }

    /**
     * Run a specified method in the worker webview
     *
     * @param {string} method : name of the method to run
     */
  }, {
    key: "runInWorker",
    value: (function () {
      var _runInWorker = (0, _asyncToGenerator2.default)(/*#__PURE__*/_regenerator.default.mark(function _callee8(method) {
        var _this$bridge;
        var _len,
          args,
          _key,
          _args8 = arguments;
        return _regenerator.default.wrap(function _callee8$(_context8) {
          while (1) switch (_context8.prev = _context8.next) {
            case 0:
              this.onlyIn(PILOT_TYPE, 'runInWorker');
              if (this.bridge) {
                _context8.next = 3;
                break;
              }
              throw new Error('No bridge is defined, you should call ContentScript.init before using this method');
            case 3:
              for (_len = _args8.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                args[_key - 1] = _args8[_key];
              }
              _context8.next = 6;
              return (_this$bridge = this.bridge).call.apply(_this$bridge, ['runInWorker', method].concat(args));
            case 6:
              return _context8.abrupt("return", _context8.sent);
            case 7:
            case "end":
              return _context8.stop();
          }
        }, _callee8, this);
      }));
      function runInWorker(_x2) {
        return _runInWorker.apply(this, arguments);
      }
      return runInWorker;
    }()
    /**
     * Wait for a method to resolve as true on worker
     *
     * @param {object} options        - options object
     * @param {string} options.method - name of the method to run
     * @param {number} [options.timeout] - number of miliseconds before the function sends a timeout error. Default Infinity
     * @param {string} [options.suffix] - suffix used in timeout error message, to better identify error source
     * @param {Array} [options.args] - array of args to pass to the method
     * @returns {Promise<boolean>} - true
     * @throws {TimeoutError} - if timeout expired
     */
    )
  }, {
    key: "runInWorkerUntilTrue",
    value: (function () {
      var _runInWorkerUntilTrue = (0, _asyncToGenerator2.default)(/*#__PURE__*/_regenerator.default.mark(function _callee9(_ref3) {
        var method, _ref3$timeout, timeout, _ref3$suffix, suffix, _ref3$args, args, result, start, isTimeout;
        return _regenerator.default.wrap(function _callee9$(_context9) {
          while (1) switch (_context9.prev = _context9.next) {
            case 0:
              method = _ref3.method, _ref3$timeout = _ref3.timeout, timeout = _ref3$timeout === void 0 ? Infinity : _ref3$timeout, _ref3$suffix = _ref3.suffix, suffix = _ref3$suffix === void 0 ? '' : _ref3$suffix, _ref3$args = _ref3.args, args = _ref3$args === void 0 ? [] : _ref3$args;
              this.onlyIn(PILOT_TYPE, 'runInWorkerUntilTrue');
              _log.debug('runInWorkerUntilTrue', method);
              result = false;
              start = Date.now();
              isTimeout = function isTimeout() {
                return Date.now() - start >= timeout;
              };
            case 6:
              if (result) {
                _context9.next = 16;
                break;
              }
              if (!isTimeout()) {
                _context9.next = 9;
                break;
              }
              throw new _pWaitFor.TimeoutError("runInWorkerUntilTrue ".concat(method).concat(suffix, " Timeout error after ").concat(timeout));
            case 9:
              _log.debug('runInWorker call', method);
              _context9.next = 12;
              return this.runInWorker.apply(this, [method].concat((0, _toConsumableArray2.default)(args)));
            case 12:
              result = _context9.sent;
              _log.debug('runInWorker result', result);
              _context9.next = 6;
              break;
            case 16:
              return _context9.abrupt("return", result);
            case 17:
            case "end":
              return _context9.stop();
          }
        }, _callee9, this);
      }));
      function runInWorkerUntilTrue(_x3) {
        return _runInWorkerUntilTrue.apply(this, arguments);
      }
      return runInWorkerUntilTrue;
    }()
    /**
     * Wait for a dom element to be present on the page, even if there are page redirects or page
     * reloads
     *
     * @param {string} selector - css selector we are waiting for
     * @param {object} options - options object
     * @param {number} [options.timeout] - timeout in ms. Will default to 30s
     * @param {string} [options.includesText] - only select elements with the given text as innerText
     */
    )
  }, {
    key: "waitForElementInWorker",
    value: (function () {
      var _waitForElementInWorker = (0, _asyncToGenerator2.default)(/*#__PURE__*/_regenerator.default.mark(function _callee10(selector) {
        var _options$timeout2;
        var options,
          _args10 = arguments;
        return _regenerator.default.wrap(function _callee10$(_context10) {
          while (1) switch (_context10.prev = _context10.next) {
            case 0:
              options = _args10.length > 1 && _args10[1] !== undefined ? _args10[1] : {};
              this.onlyIn(PILOT_TYPE, 'waitForElementInWorker');
              _context10.next = 4;
              return this.runInWorkerUntilTrue({
                method: 'waitForElementNoReload',
                suffix: selector,
                timeout: (_options$timeout2 = options === null || options === void 0 ? void 0 : options.timeout) !== null && _options$timeout2 !== void 0 ? _options$timeout2 : DEFAULT_WAIT_FOR_ELEMENT_ACCROSS_PAGES_TIMEOUT,
                args: [selector, {
                  includesText: options.includesText
                }]
              });
            case 4:
            case "end":
              return _context10.stop();
          }
        }, _callee10, this);
      }));
      function waitForElementInWorker(_x4) {
        return _waitForElementInWorker.apply(this, arguments);
      }
      return waitForElementInWorker;
    }()
    /**
     * Check if dom element is present on the page.
     *
     * @param {string} selector - css selector we are checking for
     * @returns {Promise<boolean>}  - Returns true or false
     */
    )
  }, {
    key: "isElementInWorker",
    value: (function () {
      var _isElementInWorker = (0, _asyncToGenerator2.default)(/*#__PURE__*/_regenerator.default.mark(function _callee11(selector) {
        var options,
          _args11 = arguments;
        return _regenerator.default.wrap(function _callee11$(_context11) {
          while (1) switch (_context11.prev = _context11.next) {
            case 0:
              options = _args11.length > 1 && _args11[1] !== undefined ? _args11[1] : {};
              this.onlyIn(PILOT_TYPE, 'isElementInWorker');
              _context11.next = 4;
              return this.runInWorker('checkForElement', selector, options);
            case 4:
              return _context11.abrupt("return", _context11.sent);
            case 5:
            case "end":
              return _context11.stop();
          }
        }, _callee11, this);
      }));
      function isElementInWorker(_x5) {
        return _isElementInWorker.apply(this, arguments);
      }
      return isElementInWorker;
    }()
    /**
     * Wait for a dom element to be present on the page. This won't resolve if the page reloads
     *
     * @param {string} selector - css selector we are waiting for
     * @param {object} [options] - options object
     * @param {string} [options.includesText] - only select elements wich include the given text as innerText
     * @returns {Promise.<true>} - Returns true when ready
     */
    )
  }, {
    key: "waitForElementNoReload",
    value: (function () {
      var _waitForElementNoReload = (0, _asyncToGenerator2.default)(/*#__PURE__*/_regenerator.default.mark(function _callee12(selector) {
        var _this6 = this;
        var options,
          _args12 = arguments;
        return _regenerator.default.wrap(function _callee12$(_context12) {
          while (1) switch (_context12.prev = _context12.next) {
            case 0:
              options = _args12.length > 1 && _args12[1] !== undefined ? _args12[1] : {};
              this.onlyIn(WORKER_TYPE, 'waitForElementNoReload');
              _log.debug('waitForElementNoReload', selector);
              _context12.next = 5;
              return (0, _pWaitFor.default)(function () {
                return _this6.checkForElement(selector, options);
              }, {
                timeout: {
                  milliseconds: DEFAULT_WAIT_FOR_ELEMENT_TIMEOUT,
                  message: new _pWaitFor.TimeoutError("waitForElementNoReload ".concat(selector).concat(options !== null && options !== void 0 && options.includesText ? ' "' + options.includesText + '"' : '', " timed out after ").concat(DEFAULT_WAIT_FOR_ELEMENT_TIMEOUT, "ms"))
                }
              });
            case 5:
              return _context12.abrupt("return", true);
            case 6:
            case "end":
              return _context12.stop();
          }
        }, _callee12, this);
      }));
      function waitForElementNoReload(_x6) {
        return _waitForElementNoReload.apply(this, arguments);
      }
      return waitForElementNoReload;
    }()
    /**
     * Check if a dom element is present on the page.
     *
     * @param {string} selector - css selector we are checking for
     * @param {object} [options] - options object
     * @param {string} [options.includesText] - only select elements with the given text as innerText
     * @returns {Promise<boolean>} - Returns true or false
     */
    )
  }, {
    key: "checkForElement",
    value: (function () {
      var _checkForElement = (0, _asyncToGenerator2.default)(/*#__PURE__*/_regenerator.default.mark(function _callee13(selector) {
        var options,
          _args13 = arguments;
        return _regenerator.default.wrap(function _callee13$(_context13) {
          while (1) switch (_context13.prev = _context13.next) {
            case 0:
              options = _args13.length > 1 && _args13[1] !== undefined ? _args13[1] : {};
              this.onlyIn(WORKER_TYPE, 'checkForElement');
              return _context13.abrupt("return", Boolean(this.selectElement(selector, options)));
            case 3:
            case "end":
              return _context13.stop();
          }
        }, _callee13, this);
      }));
      function checkForElement(_x7) {
        return _checkForElement.apply(this, arguments);
      }
      return checkForElement;
    }()
    /**
     * Select a dom element with given selector and options
     *
     * @param {string} selector - css selector of the element
     * @param {object} [options] - options object
     * @param {string} [options.includesText] - only select element with the given text as innerText
     * @returns {object|null} - Returns the selected dom element or null
     */
    )
  }, {
    key: "selectElement",
    value: function selectElement(selector) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      this.onlyIn(WORKER_TYPE, 'selectElement');
      if (options !== null && options !== void 0 && options.includesText && typeof options.includesText === 'string' && options.includesText !== undefined) {
        return Array.from(document.querySelectorAll(selector)).find(function (element) {
          var _element$innerHTML;
          return (// @ts-ignore Argument of type 'string | undefined' is not assignable to parameter of type 'string'.  Type 'undefined' is not assignable to type 'string'.ts(2345)
            (_element$innerHTML = element.innerHTML) === null || _element$innerHTML === void 0 ? void 0 : _element$innerHTML.includes(options.includesText)
          );
        });
      } else {
        return document.querySelector(selector);
      }
    }

    /**
     * Click on a given element
     *
     * @param {string} selector - css selector of the element
     * @param {object} [options] - options object
     * @param {string} [options.includesText] - only select element with the given text as innerText
     * @returns {Promise<void>}
     */
  }, {
    key: "click",
    value: (function () {
      var _click = (0, _asyncToGenerator2.default)(/*#__PURE__*/_regenerator.default.mark(function _callee14(selector) {
        var options,
          elem,
          _args14 = arguments;
        return _regenerator.default.wrap(function _callee14$(_context14) {
          while (1) switch (_context14.prev = _context14.next) {
            case 0:
              options = _args14.length > 1 && _args14[1] !== undefined ? _args14[1] : {};
              this.onlyIn(WORKER_TYPE, 'click');
              elem = this.selectElement(selector, options);
              if (elem) {
                _context14.next = 5;
                break;
              }
              throw new Error("click: No DOM element is matched with the ".concat(selector, " selector"));
            case 5:
              elem.click();
            case 6:
            case "end":
              return _context14.stop();
          }
        }, _callee14, this);
      }));
      function click(_x8) {
        return _click.apply(this, arguments);
      }
      return click;
    }()
    /**
     * Click on a given element and wait for another given element to be displayed on screen
     *
     * @param {string} elementToClick - css selector of the dom element to click in worker
     * @param {string} elementToWait - css selector of the dom element to wait in worker
     * @returns {Promise<void>}
     */
    )
  }, {
    key: "clickAndWait",
    value: (function () {
      var _clickAndWait = (0, _asyncToGenerator2.default)(/*#__PURE__*/_regenerator.default.mark(function _callee15(elementToClick, elementToWait) {
        return _regenerator.default.wrap(function _callee15$(_context15) {
          while (1) switch (_context15.prev = _context15.next) {
            case 0:
              this.onlyIn(PILOT_TYPE, 'clickAndWait');
              _log.debug('clicking ' + elementToClick);
              _context15.next = 4;
              return this.runInWorker('click', elementToClick);
            case 4:
              _log.debug('waiting for ' + elementToWait);
              _context15.next = 7;
              return this.waitForElementInWorker(elementToWait);
            case 7:
              _log.debug('done waiting ' + elementToWait);
            case 8:
            case "end":
              return _context15.stop();
          }
        }, _callee15, this);
      }));
      function clickAndWait(_x9, _x10) {
        return _clickAndWait.apply(this, arguments);
      }
      return clickAndWait;
    }())
  }, {
    key: "fillText",
    value: function () {
      var _fillText = (0, _asyncToGenerator2.default)(/*#__PURE__*/_regenerator.default.mark(function _callee16(selector, text) {
        var elem;
        return _regenerator.default.wrap(function _callee16$(_context16) {
          while (1) switch (_context16.prev = _context16.next) {
            case 0:
              this.onlyIn(WORKER_TYPE, 'fillText');
              elem = this.selectElement(selector);
              if (elem) {
                _context16.next = 4;
                break;
              }
              throw new Error("fillText: No DOM element is matched with the ".concat(selector, " selector"));
            case 4:
              elem.focus();
              elem.value = text;
              elem.dispatchEvent(new Event('input', {
                bubbles: true
              }));
              elem.dispatchEvent(new Event('change', {
                bubbles: true
              }));
            case 8:
            case "end":
              return _context16.stop();
          }
        }, _callee16, this);
      }));
      function fillText(_x11, _x12) {
        return _fillText.apply(this, arguments);
      }
      return fillText;
    }()
    /**
     * Download the file send by the launcher in the worker context
     *
     * @param {object} entry The entry to download with fileurl attribute
     */
  }, {
    key: "downloadFileInWorker",
    value: (function () {
      var _downloadFileInWorker = (0, _asyncToGenerator2.default)(/*#__PURE__*/_regenerator.default.mark(function _callee17(entry) {
        var _error$response, errorStatus, errorToLog;
        return _regenerator.default.wrap(function _callee17$(_context17) {
          while (1) switch (_context17.prev = _context17.next) {
            case 0:
              this.onlyIn(WORKER_TYPE, 'downloadFileInWorker');
              this.log('debug', 'downloading file in worker');
              if (!entry.fileurl) {
                _context17.next = 26;
                break;
              }
              _context17.prev = 3;
              _context17.next = 6;
              return _umd.default.get(entry.fileurl, entry.requestOptions).blob();
            case 6:
              entry.blob = _context17.sent;
              _context17.next = 9;
              return (0, _utils.blobToBase64)(entry.blob);
            case 9:
              entry.dataUri = _context17.sent;
              _context17.next = 26;
              break;
            case 12:
              _context17.prev = 12;
              _context17.t0 = _context17["catch"](3);
              this.log('debug', "Full error : ".concat(_context17.t0));
              errorStatus = (_error$response = _context17.t0.response) === null || _error$response === void 0 ? void 0 : _error$response.status;
              this.log('debug', "Error type : ".concat(typeof errorStatus, " "));
              this.log('debug', "Error status : ".concat(errorStatus));
              errorToLog = '';
              if (![401, 404, 403, 500, 502, 503].includes(errorStatus)) {
                _context17.next = 25;
                break;
              }
              if (errorStatus === 404) errorToLog = 'Website cannot find the wanted url';else if (errorStatus === 403 || errorStatus === 401) errorToLog = 'User is not allowed to access the wanted URL';else errorToLog = 'Website server error accessing the wanted URL';
              this.log('error', errorToLog);
              throw new Error('VENDOR_DOWN');
            case 25:
              throw new Error('UNKNOWN_ERROR');
            case 26:
              return _context17.abrupt("return", entry.dataUri);
            case 27:
            case "end":
              return _context17.stop();
          }
        }, _callee17, this, [[3, 12]]);
      }));
      function downloadFileInWorker(_x13) {
        return _downloadFileInWorker.apply(this, arguments);
      }
      return downloadFileInWorker;
    }())
  }, {
    key: "getDebugData",
    value: function () {
      var _getDebugData = (0, _asyncToGenerator2.default)(/*#__PURE__*/_regenerator.default.mark(function _callee18() {
        return _regenerator.default.wrap(function _callee18$(_context18) {
          while (1) switch (_context18.prev = _context18.next) {
            case 0:
              return _context18.abrupt("return", {
                url: window.location.href,
                html: window.document.documentElement.outerHTML
              });
            case 1:
            case "end":
              return _context18.stop();
          }
        }, _callee18);
      }));
      function getDebugData() {
        return _getDebugData.apply(this, arguments);
      }
      return getDebugData;
    }()
    /**
     * Bridge to the saveFiles method from the launcher.
     * - it prefilters files according to the context comming from the launcher
     * - download files when not filtered out
     * - converts blob files to base64 uri to be serializable
     *
     * @param {Array<import('../launcher/saveFiles').saveFilesEntry & {shouldReplaceFile: Function}>} entries : list of file entries to save
     * @param {import('../launcher/saveFiles').saveFileOptions & {context: object, shouldReplaceFile: Function}} options : saveFiles options
     */
  }, {
    key: "saveFiles",
    value: (function () {
      var _saveFiles = (0, _asyncToGenerator2.default)(/*#__PURE__*/_regenerator.default.mark(function _callee19(entries, options) {
        var context, updatedEntries;
        return _regenerator.default.wrap(function _callee19$(_context19) {
          while (1) switch (_context19.prev = _context19.next) {
            case 0:
              this.onlyIn(PILOT_TYPE, 'saveFiles');
              this.log('debug', "saveFiles ".concat(entries.length, " input entries"));
              context = options.context;
              _log.debug(context, 'saveFiles input context');
              if (this.bridge) {
                _context19.next = 6;
                break;
              }
              throw new Error('No bridge is defined, you should call ContentScript.init before using this method');
            case 6:
              updatedEntries = this.prepareSaveFileEntries(entries, options);
              _context19.next = 9;
              return this.bridge.call('saveFiles', updatedEntries, options);
            case 9:
              return _context19.abrupt("return", _context19.sent);
            case 10:
            case "end":
              return _context19.stop();
          }
        }, _callee19, this);
      }));
      function saveFiles(_x14, _x15) {
        return _saveFiles.apply(this, arguments);
      }
      return saveFiles;
    }()
    /**
     * Prepare entries to be given to launcher saveFiles. Especially function attributes which will not be serialized to the launcher
     *
     * @param {Array<import('../launcher/saveFiles').saveFilesEntry & {shouldReplaceFile?: Function}>} entries
     * @param {import('../launcher/saveFiles').saveFileOptions & {context: object, shouldReplaceFile?: Function}} options
     */
    )
  }, {
    key: "prepareSaveFileEntries",
    value: function prepareSaveFileEntries(entries, options) {
      var _options$context;
      var existingFilesIndex = (options === null || options === void 0 || (_options$context = options.context) === null || _options$context === void 0 ? void 0 : _options$context.existingFilesIndex) || {};
      var updatedEntries = (0, _toConsumableArray2.default)(entries);
      var _iterator = _createForOfIteratorHelper(updatedEntries),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var entry = _step.value;
          if (entry.forceReplaceFile === true || entry.forceReplaceFile === false) {
            // entry.forceReplaceFile has priority over shouldReplaceFile function
            continue;
          }
          var shouldReplaceFileFn = entry.shouldReplaceFile || options.shouldReplaceFile;
          if (shouldReplaceFileFn) {
            var existingFile = existingFilesIndex[(0, _utils2.calculateFileKey)(entry, options.fileIdAttributes)];
            entry.forceReplaceFile = shouldReplaceFileFn(existingFile, entry, options);
            entry === null || entry === void 0 || delete entry.shouldReplaceFile;
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      options === null || options === void 0 || delete options.shouldReplaceFile;
      return updatedEntries;
    }

    /**
     * Query all the documents corresponding to the given query object. The client with permissions corresponding
     * to the current konnector manifest will be used.
     *
     * @param {import("cozy-client").QueryDefinition} queryDefinition - CozyClient query definition object
     * @param {import('cozy-client/types/types').QueryOptions} options - CozyClient query options
     * @returns {Promise<import('cozy-client/types/types').QueryResult>} Returns the list of documents
     */
  }, {
    key: "queryAll",
    value: (function () {
      var _queryAll = (0, _asyncToGenerator2.default)(/*#__PURE__*/_regenerator.default.mark(function _callee20(queryDefinition, options) {
        return _regenerator.default.wrap(function _callee20$(_context20) {
          while (1) switch (_context20.prev = _context20.next) {
            case 0:
              this.onlyIn(PILOT_TYPE, 'queryAll');
              if (this.bridge) {
                _context20.next = 3;
                break;
              }
              throw new Error('No bridge is defined, you should call ContentScript.init before using this method');
            case 3:
              _context20.next = 5;
              return this.bridge.call('queryAll', queryDefinition.toDefinition(), options);
            case 5:
              return _context20.abrupt("return", _context20.sent);
            case 6:
            case "end":
              return _context20.stop();
          }
        }, _callee20, this);
      }));
      function queryAll(_x16, _x17) {
        return _queryAll.apply(this, arguments);
      }
      return queryAll;
    }()
    /**
     * Bridge to the saveBills method from the launcher.
     * - it first saves the files
     * - then saves bills linked to corresponding files
     *
     * @param {Array} entries : list of file entries to save
     * @param {object} options : saveFiles options
     */
    )
  }, {
    key: "saveBills",
    value: (function () {
      var _saveBills = (0, _asyncToGenerator2.default)(/*#__PURE__*/_regenerator.default.mark(function _callee21(entries, options) {
        var files;
        return _regenerator.default.wrap(function _callee21$(_context21) {
          while (1) switch (_context21.prev = _context21.next) {
            case 0:
              this.onlyIn(PILOT_TYPE, 'saveBills');
              _context21.next = 3;
              return this.saveFiles(entries, options);
            case 3:
              files = _context21.sent;
              if (this.bridge) {
                _context21.next = 6;
                break;
              }
              throw new Error('No bridge is defined, you should call ContentScript.init before using this method');
            case 6:
              _context21.next = 8;
              return this.bridge.call('saveBills', files, options);
            case 8:
              return _context21.abrupt("return", _context21.sent);
            case 9:
            case "end":
              return _context21.stop();
          }
        }, _callee21, this);
      }));
      function saveBills(_x18, _x19) {
        return _saveBills.apply(this, arguments);
      }
      return saveBills;
    }()
    /**
     * Bridge to the getCredentials method from the launcher.
     */
    )
  }, {
    key: "getCredentials",
    value: (function () {
      var _getCredentials = (0, _asyncToGenerator2.default)(/*#__PURE__*/_regenerator.default.mark(function _callee22() {
        return _regenerator.default.wrap(function _callee22$(_context22) {
          while (1) switch (_context22.prev = _context22.next) {
            case 0:
              this.onlyIn(PILOT_TYPE, 'getCredentials');
              if (this.bridge) {
                _context22.next = 3;
                break;
              }
              throw new Error('No bridge is defined, you should call ContentScript.init before using this method');
            case 3:
              _context22.next = 5;
              return this.bridge.call('getCredentials');
            case 5:
              return _context22.abrupt("return", _context22.sent);
            case 6:
            case "end":
              return _context22.stop();
          }
        }, _callee22, this);
      }));
      function getCredentials() {
        return _getCredentials.apply(this, arguments);
      }
      return getCredentials;
    }()
    /**
     * Bridge to the saveCredentials method from the launcher.
     *
     * @param {object} credentials : object with credentials specific to the current connector
     */
    )
  }, {
    key: "saveCredentials",
    value: (function () {
      var _saveCredentials = (0, _asyncToGenerator2.default)(/*#__PURE__*/_regenerator.default.mark(function _callee23(credentials) {
        return _regenerator.default.wrap(function _callee23$(_context23) {
          while (1) switch (_context23.prev = _context23.next) {
            case 0:
              this.onlyIn(PILOT_TYPE, 'saveCredentials');
              if (this.bridge) {
                _context23.next = 3;
                break;
              }
              throw new Error('No bridge is defined, you should call ContentScript.init before using this method');
            case 3:
              _context23.next = 5;
              return this.bridge.call('saveCredentials', credentials);
            case 5:
              return _context23.abrupt("return", _context23.sent);
            case 6:
            case "end":
              return _context23.stop();
          }
        }, _callee23, this);
      }));
      function saveCredentials(_x20) {
        return _saveCredentials.apply(this, arguments);
      }
      return saveCredentials;
    }()
    /**
     * Bridge to the saveIdentity method from the launcher.
     *
     * @param {object} identity : io.cozy.contacts object
     */
    )
  }, {
    key: "saveIdentity",
    value: (function () {
      var _saveIdentity = (0, _asyncToGenerator2.default)(/*#__PURE__*/_regenerator.default.mark(function _callee24(identity) {
        return _regenerator.default.wrap(function _callee24$(_context24) {
          while (1) switch (_context24.prev = _context24.next) {
            case 0:
              this.onlyIn(PILOT_TYPE, 'saveIdentity');
              if (this.bridge) {
                _context24.next = 3;
                break;
              }
              throw new Error('No bridge is defined, you should call ContentScript.init before using this method');
            case 3:
              _context24.next = 5;
              return this.bridge.call('saveIdentity', identity);
            case 5:
              return _context24.abrupt("return", _context24.sent);
            case 6:
            case "end":
              return _context24.stop();
          }
        }, _callee24, this);
      }));
      function saveIdentity(_x21) {
        return _saveIdentity.apply(this, arguments);
      }
      return saveIdentity;
    }()
    /**
     * Bridge to the getCookiesByDomain method from the RNlauncher.
     *
     * @param {string} domain : domain name
     */
    )
  }, {
    key: "getCookiesByDomain",
    value: (function () {
      var _getCookiesByDomain = (0, _asyncToGenerator2.default)(/*#__PURE__*/_regenerator.default.mark(function _callee25(domain) {
        return _regenerator.default.wrap(function _callee25$(_context25) {
          while (1) switch (_context25.prev = _context25.next) {
            case 0:
              if (this.bridge) {
                _context25.next = 2;
                break;
              }
              throw new Error('No bridge is defined, you should call ContentScript.init before using this method');
            case 2:
              _context25.next = 4;
              return this.bridge.call('getCookiesByDomain', domain);
            case 4:
              return _context25.abrupt("return", _context25.sent);
            case 5:
            case "end":
              return _context25.stop();
          }
        }, _callee25, this);
      }));
      function getCookiesByDomain(_x22) {
        return _getCookiesByDomain.apply(this, arguments);
      }
      return getCookiesByDomain;
    }()
    /**
     * Bridge to the getCookieFromKeychainByName method from the RNlauncher.
     *
     * @param {string} cookieName : cookie name
     */
    )
  }, {
    key: "getCookieFromKeychainByName",
    value: (function () {
      var _getCookieFromKeychainByName = (0, _asyncToGenerator2.default)(/*#__PURE__*/_regenerator.default.mark(function _callee26(cookieName) {
        return _regenerator.default.wrap(function _callee26$(_context26) {
          while (1) switch (_context26.prev = _context26.next) {
            case 0:
              if (this.bridge) {
                _context26.next = 2;
                break;
              }
              throw new Error('No bridge is defined, you should call ContentScript.init before using this method');
            case 2:
              _context26.next = 4;
              return this.bridge.call('getCookieFromKeychainByName', cookieName);
            case 4:
              return _context26.abrupt("return", _context26.sent);
            case 5:
            case "end":
              return _context26.stop();
          }
        }, _callee26, this);
      }));
      function getCookieFromKeychainByName(_x23) {
        return _getCookieFromKeychainByName.apply(this, arguments);
      }
      return getCookieFromKeychainByName;
    }()
    /**
     * Bridge to the saveCookieToKeychain method from the RNlauncher.
     *
     * @param {string} cookieValue : cookie value
     */
    )
  }, {
    key: "saveCookieToKeychain",
    value: (function () {
      var _saveCookieToKeychain = (0, _asyncToGenerator2.default)(/*#__PURE__*/_regenerator.default.mark(function _callee27(cookieValue) {
        return _regenerator.default.wrap(function _callee27$(_context27) {
          while (1) switch (_context27.prev = _context27.next) {
            case 0:
              this.onlyIn(PILOT_TYPE, 'saveCookieToKeychain');
              if (this.bridge) {
                _context27.next = 3;
                break;
              }
              throw new Error('No bridge is defined, you should call ContentScript.init before using this method');
            case 3:
              _context27.next = 5;
              return this.bridge.call('saveCookieToKeychain', cookieValue);
            case 5:
              return _context27.abrupt("return", _context27.sent);
            case 6:
            case "end":
              return _context27.stop();
          }
        }, _callee27, this);
      }));
      function saveCookieToKeychain(_x24) {
        return _saveCookieToKeychain.apply(this, arguments);
      }
      return saveCookieToKeychain;
    }())
  }, {
    key: "getCookieByDomainAndName",
    value: function () {
      var _getCookieByDomainAndName = (0, _asyncToGenerator2.default)(/*#__PURE__*/_regenerator.default.mark(function _callee28(cookieDomain, cookieName) {
        var expectedCookie;
        return _regenerator.default.wrap(function _callee28$(_context28) {
          while (1) switch (_context28.prev = _context28.next) {
            case 0:
              this.onlyIn(WORKER_TYPE, 'getCookieByDomainAndName');
              if (this.bridge) {
                _context28.next = 3;
                break;
              }
              throw new Error('No bridge is defined, you should call ContentScript.init before using this method');
            case 3:
              _context28.next = 5;
              return this.bridge.call('getCookieByDomainAndName', cookieDomain, cookieName);
            case 5:
              expectedCookie = _context28.sent;
              return _context28.abrupt("return", expectedCookie);
            case 7:
            case "end":
              return _context28.stop();
          }
        }, _callee28, this);
      }));
      function getCookieByDomainAndName(_x25, _x26) {
        return _getCookieByDomainAndName.apply(this, arguments);
      }
      return getCookieByDomainAndName;
    }()
    /**
     * Send log message to the launcher
     *
     * @param {"debug"|"info"|"warn"|"error"} level : the log level
     * @param {string} message : the log message
     */
  }, {
    key: "log",
    value: function log(level, message) {
      var _this$bridge2;
      if (!message) {
        _log.warn("you are calling log without message, use log(level,message) instead");
        return;
      }
      var now = new Date().toISOString();
      (_this$bridge2 = this.bridge) === null || _this$bridge2 === void 0 || _this$bridge2.emit('log', {
        timestamp: now,
        level: level,
        msg: message
      });
    }

    /**
     * @typedef SetWorkerStateOptions
     * @property {string} [url]      : url displayed by the worker webview for the login
     * @property {boolean} [visible] : will the worker be visible or not
     */

    /**
     * This is a proxy to the "setWorkerState" command in the launcher
     *
     * @param {SetWorkerStateOptions} options : worker state options
     */
  }, {
    key: "setWorkerState",
    value: (function () {
      var _setWorkerState = (0, _asyncToGenerator2.default)(/*#__PURE__*/_regenerator.default.mark(function _callee29() {
        var options,
          _args29 = arguments;
        return _regenerator.default.wrap(function _callee29$(_context29) {
          while (1) switch (_context29.prev = _context29.next) {
            case 0:
              options = _args29.length > 0 && _args29[0] !== undefined ? _args29[0] : {};
              this.onlyIn(PILOT_TYPE, 'setWorkerState');
              if (this.bridge) {
                _context29.next = 4;
                break;
              }
              throw new Error('No bridge is defined, you should call ContentScript.init before using this method');
            case 4:
              _context29.next = 6;
              return this.bridge.call('setWorkerState', options);
            case 6:
            case "end":
              return _context29.stop();
          }
        }, _callee29, this);
      }));
      function setWorkerState() {
        return _setWorkerState.apply(this, arguments);
      }
      return setWorkerState;
    }()
    /**
     * Set the current url of the worker
     *
     * @param {string} url : the url
     */
    )
  }, {
    key: "goto",
    value: (function () {
      var _goto = (0, _asyncToGenerator2.default)(/*#__PURE__*/_regenerator.default.mark(function _callee30(url) {
        return _regenerator.default.wrap(function _callee30$(_context30) {
          while (1) switch (_context30.prev = _context30.next) {
            case 0:
              this.onlyIn(PILOT_TYPE, 'goto');
              _context30.next = 3;
              return this.setWorkerState({
                url: url
              });
            case 3:
            case "end":
              return _context30.stop();
          }
        }, _callee30, this);
      }));
      function goto(_x27) {
        return _goto.apply(this, arguments);
      }
      return goto;
    }())
  }, {
    key: "blockWorkerInteractions",
    value: function () {
      var _blockWorkerInteractions = (0, _asyncToGenerator2.default)(/*#__PURE__*/_regenerator.default.mark(function _callee31() {
        return _regenerator.default.wrap(function _callee31$(_context31) {
          while (1) switch (_context31.prev = _context31.next) {
            case 0:
              this.onlyIn(PILOT_TYPE, 'blockWorkerInteractions');
              if (this.bridge) {
                _context31.next = 3;
                break;
              }
              throw new Error('No bridge is defined, you should call ContentScript.init before using this method');
            case 3:
              _context31.next = 5;
              return this.bridge.call('blockWorkerInteractions');
            case 5:
            case "end":
              return _context31.stop();
          }
        }, _callee31, this);
      }));
      function blockWorkerInteractions() {
        return _blockWorkerInteractions.apply(this, arguments);
      }
      return blockWorkerInteractions;
    }()
  }, {
    key: "unblockWorkerInteractions",
    value: function () {
      var _unblockWorkerInteractions = (0, _asyncToGenerator2.default)(/*#__PURE__*/_regenerator.default.mark(function _callee32() {
        return _regenerator.default.wrap(function _callee32$(_context32) {
          while (1) switch (_context32.prev = _context32.next) {
            case 0:
              this.onlyIn(PILOT_TYPE, 'unblockWorkerInteractions');
              if (this.bridge) {
                _context32.next = 3;
                break;
              }
              throw new Error('No bridge is defined, you should call ContentScript.init before using this method');
            case 3:
              _context32.next = 5;
              return this.bridge.call('unblockWorkerInteractions');
            case 5:
            case "end":
              return _context32.stop();
          }
        }, _callee32, this);
      }));
      function unblockWorkerInteractions() {
        return _unblockWorkerInteractions.apply(this, arguments);
      }
      return unblockWorkerInteractions;
    }()
    /**
     * Evaluates a given function in worker context
     *
     * @param {Function} fn - the function to evaluate
     * @returns {Promise<any>} - function evaluation result
     */
  }, {
    key: "evaluateInWorker",
    value: (function () {
      var _evaluateInWorker = (0, _asyncToGenerator2.default)(/*#__PURE__*/_regenerator.default.mark(function _callee33(fn) {
        var _len2,
          args,
          _key2,
          _args33 = arguments;
        return _regenerator.default.wrap(function _callee33$(_context33) {
          while (1) switch (_context33.prev = _context33.next) {
            case 0:
              this.onlyIn(PILOT_TYPE, 'evaluateInWorker');
              for (_len2 = _args33.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                args[_key2 - 1] = _args33[_key2];
              }
              _context33.next = 4;
              return this.runInWorker.apply(this, ['evaluate', fn.toString()].concat(args));
            case 4:
              return _context33.abrupt("return", _context33.sent);
            case 5:
            case "end":
              return _context33.stop();
          }
        }, _callee33, this);
      }));
      function evaluateInWorker(_x28) {
        return _evaluateInWorker.apply(this, arguments);
      }
      return evaluateInWorker;
    }()
    /**
     * Evaluates a given function string
     *
     * @param {string} fnString - the function string to evaluate
     * @returns {Promise<any>} - function evaluation result
     */
    )
  }, {
    key: "evaluate",
    value: (function () {
      var _evaluate = (0, _asyncToGenerator2.default)(/*#__PURE__*/_regenerator.default.mark(function _callee34(fnString) {
        var _len3,
          args,
          _key3,
          _args34 = arguments;
        return _regenerator.default.wrap(function _callee34$(_context34) {
          while (1) switch (_context34.prev = _context34.next) {
            case 0:
              this.onlyIn(WORKER_TYPE, 'evaluate');
              for (_len3 = _args34.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
                args[_key3 - 1] = _args34[_key3];
              }
              _context34.next = 4;
              return _utils.callStringFunction.apply(void 0, [fnString].concat(args));
            case 4:
              return _context34.abrupt("return", _context34.sent);
            case 5:
            case "end":
              return _context34.stop();
          }
        }, _callee34, this);
      }));
      function evaluate(_x29) {
        return _evaluate.apply(this, arguments);
      }
      return evaluate;
    }()
    /**
     * Make sure that the connector is authenticated to the website.
     * If not, show the login webview to the user to let her/him authenticated.
     * Resolve the promise when authenticated
     *
     * @throws LOGIN_FAILED
     * @returns {Promise.<boolean>} : true if the user is authenticated
     */
    )
  }, {
    key: "ensureAuthenticated",
    value: (function () {
      var _ensureAuthenticated = (0, _asyncToGenerator2.default)(/*#__PURE__*/_regenerator.default.mark(function _callee35() {
        return _regenerator.default.wrap(function _callee35$(_context35) {
          while (1) switch (_context35.prev = _context35.next) {
            case 0:
              return _context35.abrupt("return", true);
            case 1:
            case "end":
              return _context35.stop();
          }
        }, _callee35);
      }));
      function ensureAuthenticated() {
        return _ensureAuthenticated.apply(this, arguments);
      }
      return ensureAuthenticated;
    }()
    /**
     * Make sure that the connector is not authenticated anymore to the website.
     *
     * @returns {Promise.<boolean>} : true if the user is not authenticated
     */
    )
  }, {
    key: "ensureNotAuthenticated",
    value: (function () {
      var _ensureNotAuthenticated = (0, _asyncToGenerator2.default)(/*#__PURE__*/_regenerator.default.mark(function _callee36() {
        return _regenerator.default.wrap(function _callee36$(_context36) {
          while (1) switch (_context36.prev = _context36.next) {
            case 0:
              return _context36.abrupt("return", true);
            case 1:
            case "end":
              return _context36.stop();
          }
        }, _callee36);
      }));
      function ensureNotAuthenticated() {
        return _ensureNotAuthenticated.apply(this, arguments);
      }
      return ensureNotAuthenticated;
    }()
    /**
     * Returns whatever unique information on the authenticated user which will be usefull
     * to identify fetched data : destination folder name, fetched data metadata
     *
     * @returns {Promise.<object>}  : user data object
     */
    )
  }, {
    key: "getUserDataFromWebsite",
    value: (function () {
      var _getUserDataFromWebsite = (0, _asyncToGenerator2.default)(/*#__PURE__*/_regenerator.default.mark(function _callee37() {
        return _regenerator.default.wrap(function _callee37$(_context37) {
          while (1) switch (_context37.prev = _context37.next) {
            case 0:
            case "end":
              return _context37.stop();
          }
        }, _callee37);
      }));
      function getUserDataFromWebsite() {
        return _getUserDataFromWebsite.apply(this, arguments);
      }
      return getUserDataFromWebsite;
    }()
    /**
     * In worker context, send the given data to the pilot to be stored in its own store
     *
     * @param {object} obj : any object with data to store
     */
    )
  }, {
    key: "sendToPilot",
    value: (function () {
      var _sendToPilot = (0, _asyncToGenerator2.default)(/*#__PURE__*/_regenerator.default.mark(function _callee38(obj) {
        return _regenerator.default.wrap(function _callee38$(_context38) {
          while (1) switch (_context38.prev = _context38.next) {
            case 0:
              this.onlyIn(WORKER_TYPE, 'sendToPilot');
              if (this.bridge) {
                _context38.next = 3;
                break;
              }
              throw new Error('No bridge is defined, you should call ContentScript.init before using this method');
            case 3:
              return _context38.abrupt("return", this.bridge.call('sendToPilot', obj));
            case 4:
            case "end":
              return _context38.stop();
          }
        }, _callee38, this);
      }));
      function sendToPilot(_x30) {
        return _sendToPilot.apply(this, arguments);
      }
      return sendToPilot;
    }()
    /**
     * Store data sent from worker with sendToPilot method
     *
     * @param {object} obj : any object with data to store
     */
    )
  }, {
    key: "storeFromWorker",
    value: (function () {
      var _storeFromWorker = (0, _asyncToGenerator2.default)(/*#__PURE__*/_regenerator.default.mark(function _callee39(obj) {
        return _regenerator.default.wrap(function _callee39$(_context39) {
          while (1) switch (_context39.prev = _context39.next) {
            case 0:
              // @ts-ignore Aucune surcharge ne correspond à cet appel.
              Object.assign(this.store, obj);
            case 1:
            case "end":
              return _context39.stop();
          }
        }, _callee39, this);
      }));
      function storeFromWorker(_x31) {
        return _storeFromWorker.apply(this, arguments);
      }
      return storeFromWorker;
    }())
  }, {
    key: "onlyIn",
    value: function onlyIn(csType, method) {
      if (this.contentScriptType !== csType) {
        throw new Error("Use ".concat(method, " only from the ").concat(csType));
      }
    }

    /**
     * Determine if the konnector must fetch all or parts of the data.
     *
     * @param {object} options - All the data already fetched by the connector in a previous execution.
     *                                   Useful to optimize connector execution by not fetching data we already have.
     * @returns {Promise<object>} - Promise that resolves to an object with the following properties:
     * @property {boolean} shouldFullSync - Indicates if a full synchronization is needed.
     * @property {number|NaN} distanceInDays - The number of days since the last sync, or NaN if not applicable.
     */
  }, {
    key: "shouldFullSync",
    value: (function () {
      var _shouldFullSync = (0, _asyncToGenerator2.default)(/*#__PURE__*/_regenerator.default.mark(function _callee40(options) {
        var _trigger$current_stat, _trigger$current_stat2, _trigger$current_stat3, _trigger$current_stat4, _trigger$current_stat5;
        var trigger, flags, forceFullSync, flagFullSync, isFirstJob, isLastJobError, hasLastExecution, distanceInDays, _trigger$current_stat6;
        return _regenerator.default.wrap(function _callee40$(_context40) {
          while (1) switch (_context40.prev = _context40.next) {
            case 0:
              this.onlyIn(PILOT_TYPE, 'shouldFullSync');
              trigger = options.trigger, flags = options.flags;
              forceFullSync = false;
              flagFullSync = false;
              if (flags['clisk.force-full-sync'] === true) {
                this.log('info', 'User forces full sync');
                flagFullSync = true;
              }
              isFirstJob = !((_trigger$current_stat = trigger.current_state) !== null && _trigger$current_stat !== void 0 && _trigger$current_stat.last_failure) && !((_trigger$current_stat2 = trigger.current_state) !== null && _trigger$current_stat2 !== void 0 && _trigger$current_stat2.last_success);
              isLastJobError = !isFirstJob && ((_trigger$current_stat3 = trigger.current_state) === null || _trigger$current_stat3 === void 0 ? void 0 : _trigger$current_stat3.last_failure) > ((_trigger$current_stat4 = trigger.current_state) === null || _trigger$current_stat4 === void 0 ? void 0 : _trigger$current_stat4.last_success);
              hasLastExecution = Boolean((_trigger$current_stat5 = trigger.current_state) === null || _trigger$current_stat5 === void 0 ? void 0 : _trigger$current_stat5.last_execution);
              distanceInDays = 0;
              if (hasLastExecution) {
                distanceInDays = getDateDistanceInDays((_trigger$current_stat6 = trigger.current_state) === null || _trigger$current_stat6 === void 0 ? void 0 : _trigger$current_stat6.last_execution);
              }
              this.log('debug', "distanceInDays: ".concat(distanceInDays));
              if (flagFullSync || !hasLastExecution || isLastJobError || distanceInDays >= 30) {
                this.log('info', '🐢️ Long execution');
                this.log('debug', "isLastJobError: ".concat(isLastJobError, " | hasLastExecution: ").concat(hasLastExecution));
                forceFullSync = true;
              } else {
                this.log('info', '🐇️ Quick execution');
              }
              return _context40.abrupt("return", {
                forceFullSync: forceFullSync,
                distanceInDays: distanceInDays
              });
            case 13:
            case "end":
              return _context40.stop();
          }
        }, _callee40, this);
      }));
      function shouldFullSync(_x32) {
        return _shouldFullSync.apply(this, arguments);
      }
      return shouldFullSync;
    }()
    /**
     * Main function, fetches all connector data and save it to the cozy
     *
     * @param {object} options : options object
     * @param {object} options.context : all the data already fetched by the connector in a previous execution. Will be usefull to optimize
     * connector execution by not fetching data we already have.
     * @returns {Promise.<object>} : Connector execution result. TBD
     */
    // eslint-disable-next-line no-unused-vars
    )
  }, {
    key: "fetch",
    value: (function () {
      var _fetch = (0, _asyncToGenerator2.default)(/*#__PURE__*/_regenerator.default.mark(function _callee41(options) {
        return _regenerator.default.wrap(function _callee41$(_context41) {
          while (1) switch (_context41.prev = _context41.next) {
            case 0:
            case "end":
              return _context41.stop();
          }
        }, _callee41);
      }));
      function fetch(_x33) {
        return _fetch.apply(this, arguments);
      }
      return fetch;
    }()
    /**
     * Returns the current clisk version number in package.json file
     */
    )
  }, {
    key: "getCliskVersion",
    value: (function () {
      var _getCliskVersion = (0, _asyncToGenerator2.default)(/*#__PURE__*/_regenerator.default.mark(function _callee42() {
        return _regenerator.default.wrap(function _callee42$(_context42) {
          while (1) switch (_context42.prev = _context42.next) {
            case 0:
              return _context42.abrupt("return", _package.default.version);
            case 1:
            case "end":
              return _context42.stop();
          }
        }, _callee42);
      }));
      function getCliskVersion() {
        return _getCliskVersion.apply(this, arguments);
      }
      return getCliskVersion;
    }())
  }, {
    key: "initRecorder",
    value: function initRecorder(shouldRecord) {
      if (!shouldRecord) {
        return;
      }
      (0, _record.record)(_objectSpread({
        emit: function emit(event) {
          var _window$ReactNativeWe;
          (_window$ReactNativeWe = window.ReactNativeWebView) === null || _window$ReactNativeWe === void 0 || _window$ReactNativeWe.postMessage(JSON.stringify(_objectSpread(_objectSpread({}, event), {}, {
            messageType: 'rrweb'
          })));
        }
      }, this.recordOptions));
    }
  }]);
  return ContentScript;
}();
function sendPageMessage(message) {
  var _window$ReactNativeWe2;
  // @ts-ignore La propriété 'ReactNativeWebView' n'existe pas sur le type 'Window & typeof globalThis'.
  if ((_window$ReactNativeWe2 = window.ReactNativeWebView) !== null && _window$ReactNativeWe2 !== void 0 && _window$ReactNativeWe2.postMessage) {
    var _window$ReactNativeWe3;
    // @ts-ignore La propriété 'ReactNativeWebView' n'existe pas sur le type 'Window & typeof globalThis'.
    (_window$ReactNativeWe3 = window.ReactNativeWebView) === null || _window$ReactNativeWe3 === void 0 || _window$ReactNativeWe3.postMessage(JSON.stringify({
      message: message
    }));
  } else {
    _log.error('No window.ReactNativeWebView.postMessage available');
  }
}
function getDateDistanceInDays(dateString) {
  var distanceMs = Date.now() - new Date(dateString).getTime();
  var days = 1000 * 60 * 60 * 24;
  return Math.floor(distanceMs / days);
}

/***/ }),
/* 4 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// TODO(Babel 8): Remove this file.

var runtime = __webpack_require__(5)();
module.exports = runtime;

// Copied from https://github.com/facebook/regenerator/blob/main/packages/runtime/runtime.js#L736=
try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  if (typeof globalThis === "object") {
    globalThis.regeneratorRuntime = runtime;
  } else {
    Function("r", "regeneratorRuntime = r")(runtime);
  }
}


/***/ }),
/* 5 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var _typeof = (__webpack_require__(6)["default"]);
function _regeneratorRuntime() {
  "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */
  module.exports = _regeneratorRuntime = function _regeneratorRuntime() {
    return exports;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports;
  var exports = {},
    Op = Object.prototype,
    hasOwn = Op.hasOwnProperty,
    defineProperty = Object.defineProperty || function (obj, key, desc) {
      obj[key] = desc.value;
    },
    $Symbol = "function" == typeof Symbol ? Symbol : {},
    iteratorSymbol = $Symbol.iterator || "@@iterator",
    asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator",
    toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";
  function define(obj, key, value) {
    return Object.defineProperty(obj, key, {
      value: value,
      enumerable: !0,
      configurable: !0,
      writable: !0
    }), obj[key];
  }
  try {
    define({}, "");
  } catch (err) {
    define = function define(obj, key, value) {
      return obj[key] = value;
    };
  }
  function wrap(innerFn, outerFn, self, tryLocsList) {
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator,
      generator = Object.create(protoGenerator.prototype),
      context = new Context(tryLocsList || []);
    return defineProperty(generator, "_invoke", {
      value: makeInvokeMethod(innerFn, self, context)
    }), generator;
  }
  function tryCatch(fn, obj, arg) {
    try {
      return {
        type: "normal",
        arg: fn.call(obj, arg)
      };
    } catch (err) {
      return {
        type: "throw",
        arg: err
      };
    }
  }
  exports.wrap = wrap;
  var ContinueSentinel = {};
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}
  var IteratorPrototype = {};
  define(IteratorPrototype, iteratorSymbol, function () {
    return this;
  });
  var getProto = Object.getPrototypeOf,
    NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype);
  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function (method) {
      define(prototype, method, function (arg) {
        return this._invoke(method, arg);
      });
    });
  }
  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if ("throw" !== record.type) {
        var result = record.arg,
          value = result.value;
        return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) {
          invoke("next", value, resolve, reject);
        }, function (err) {
          invoke("throw", err, resolve, reject);
        }) : PromiseImpl.resolve(value).then(function (unwrapped) {
          result.value = unwrapped, resolve(result);
        }, function (error) {
          return invoke("throw", error, resolve, reject);
        });
      }
      reject(record.arg);
    }
    var previousPromise;
    defineProperty(this, "_invoke", {
      value: function value(method, arg) {
        function callInvokeWithMethodAndArg() {
          return new PromiseImpl(function (resolve, reject) {
            invoke(method, arg, resolve, reject);
          });
        }
        return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
      }
    });
  }
  function makeInvokeMethod(innerFn, self, context) {
    var state = "suspendedStart";
    return function (method, arg) {
      if ("executing" === state) throw new Error("Generator is already running");
      if ("completed" === state) {
        if ("throw" === method) throw arg;
        return doneResult();
      }
      for (context.method = method, context.arg = arg;;) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }
        if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) {
          if ("suspendedStart" === state) throw state = "completed", context.arg;
          context.dispatchException(context.arg);
        } else "return" === context.method && context.abrupt("return", context.arg);
        state = "executing";
        var record = tryCatch(innerFn, self, context);
        if ("normal" === record.type) {
          if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue;
          return {
            value: record.arg,
            done: context.done
          };
        }
        "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg);
      }
    };
  }
  function maybeInvokeDelegate(delegate, context) {
    var methodName = context.method,
      method = delegate.iterator[methodName];
    if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel;
    var record = tryCatch(method, delegate.iterator, context.arg);
    if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel;
    var info = record.arg;
    return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel);
  }
  function pushTryEntry(locs) {
    var entry = {
      tryLoc: locs[0]
    };
    1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry);
  }
  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal", delete record.arg, entry.completion = record;
  }
  function Context(tryLocsList) {
    this.tryEntries = [{
      tryLoc: "root"
    }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0);
  }
  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) return iteratorMethod.call(iterable);
      if ("function" == typeof iterable.next) return iterable;
      if (!isNaN(iterable.length)) {
        var i = -1,
          next = function next() {
            for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next;
            return next.value = undefined, next.done = !0, next;
          };
        return next.next = next;
      }
    }
    return {
      next: doneResult
    };
  }
  function doneResult() {
    return {
      value: undefined,
      done: !0
    };
  }
  return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", {
    value: GeneratorFunctionPrototype,
    configurable: !0
  }), defineProperty(GeneratorFunctionPrototype, "constructor", {
    value: GeneratorFunction,
    configurable: !0
  }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) {
    var ctor = "function" == typeof genFun && genFun.constructor;
    return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name));
  }, exports.mark = function (genFun) {
    return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun;
  }, exports.awrap = function (arg) {
    return {
      __await: arg
    };
  }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
    return this;
  }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    void 0 === PromiseImpl && (PromiseImpl = Promise);
    var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl);
    return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) {
      return result.done ? result.value : iter.next();
    });
  }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () {
    return this;
  }), define(Gp, "toString", function () {
    return "[object Generator]";
  }), exports.keys = function (val) {
    var object = Object(val),
      keys = [];
    for (var key in object) keys.push(key);
    return keys.reverse(), function next() {
      for (; keys.length;) {
        var key = keys.pop();
        if (key in object) return next.value = key, next.done = !1, next;
      }
      return next.done = !0, next;
    };
  }, exports.values = values, Context.prototype = {
    constructor: Context,
    reset: function reset(skipTempReset) {
      if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined);
    },
    stop: function stop() {
      this.done = !0;
      var rootRecord = this.tryEntries[0].completion;
      if ("throw" === rootRecord.type) throw rootRecord.arg;
      return this.rval;
    },
    dispatchException: function dispatchException(exception) {
      if (this.done) throw exception;
      var context = this;
      function handle(loc, caught) {
        return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught;
      }
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i],
          record = entry.completion;
        if ("root" === entry.tryLoc) return handle("end");
        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc"),
            hasFinally = hasOwn.call(entry, "finallyLoc");
          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
            if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
          } else {
            if (!hasFinally) throw new Error("try statement without catch or finally");
            if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
          }
        }
      }
    },
    abrupt: function abrupt(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }
      finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null);
      var record = finallyEntry ? finallyEntry.completion : {};
      return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record);
    },
    complete: function complete(record, afterLoc) {
      if ("throw" === record.type) throw record.arg;
      return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel;
    },
    finish: function finish(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel;
      }
    },
    "catch": function _catch(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if ("throw" === record.type) {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }
      throw new Error("illegal catch attempt");
    },
    delegateYield: function delegateYield(iterable, resultName, nextLoc) {
      return this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      }, "next" === this.method && (this.arg = undefined), ContinueSentinel;
    }
  }, exports;
}
module.exports = _regeneratorRuntime, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 6 */
/***/ ((module) => {

function _typeof(obj) {
  "@babel/helpers - typeof";

  return (module.exports = _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports), _typeof(obj);
}
module.exports = _typeof, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 7 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var toPropertyKey = __webpack_require__(8);
function _defineProperty(obj, key, value) {
  key = toPropertyKey(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
module.exports = _defineProperty, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 8 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var _typeof = (__webpack_require__(6)["default"]);
var toPrimitive = __webpack_require__(9);
function _toPropertyKey(arg) {
  var key = toPrimitive(arg, "string");
  return _typeof(key) === "symbol" ? key : String(key);
}
module.exports = _toPropertyKey, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 9 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var _typeof = (__webpack_require__(6)["default"]);
function _toPrimitive(input, hint) {
  if (_typeof(input) !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== undefined) {
    var res = prim.call(input, hint || "default");
    if (_typeof(res) !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}
module.exports = _toPrimitive, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 10 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var arrayWithoutHoles = __webpack_require__(11);
var iterableToArray = __webpack_require__(13);
var unsupportedIterableToArray = __webpack_require__(14);
var nonIterableSpread = __webpack_require__(15);
function _toConsumableArray(arr) {
  return arrayWithoutHoles(arr) || iterableToArray(arr) || unsupportedIterableToArray(arr) || nonIterableSpread();
}
module.exports = _toConsumableArray, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 11 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var arrayLikeToArray = __webpack_require__(12);
function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return arrayLikeToArray(arr);
}
module.exports = _arrayWithoutHoles, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 12 */
/***/ ((module) => {

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}
module.exports = _arrayLikeToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 13 */
/***/ ((module) => {

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
module.exports = _iterableToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 14 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var arrayLikeToArray = __webpack_require__(12);
function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return arrayLikeToArray(o, minLen);
}
module.exports = _unsupportedIterableToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 15 */
/***/ ((module) => {

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
module.exports = _nonIterableSpread, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 16 */
/***/ ((module) => {

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function _asyncToGenerator(fn) {
  return function () {
    var self = this,
      args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }
      _next(undefined);
    });
  };
}
module.exports = _asyncToGenerator, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 17 */
/***/ ((module) => {

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
module.exports = _classCallCheck, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 18 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var toPropertyKey = __webpack_require__(8);
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
module.exports = _createClass, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 19 */
/***/ ((module, exports, __webpack_require__) => {

var Minilog = __webpack_require__(20);

var oldEnable = Minilog.enable,
    oldDisable = Minilog.disable,
    isChrome = (typeof navigator != 'undefined' && /chrome/i.test(navigator.userAgent)),
    console = __webpack_require__(24);

// Use a more capable logging backend if on Chrome
Minilog.defaultBackend = (isChrome ? console.minilog : console);

// apply enable inputs from localStorage and from the URL
if(typeof window != 'undefined') {
  try {
    Minilog.enable(JSON.parse(window.localStorage['minilogSettings']));
  } catch(e) {}
  if(window.location && window.location.search) {
    var match = RegExp('[?&]minilog=([^&]*)').exec(window.location.search);
    match && Minilog.enable(decodeURIComponent(match[1]));
  }
}

// Make enable also add to localStorage
Minilog.enable = function() {
  oldEnable.call(Minilog, true);
  try { window.localStorage['minilogSettings'] = JSON.stringify(true); } catch(e) {}
  return this;
};

Minilog.disable = function() {
  oldDisable.call(Minilog);
  try { delete window.localStorage.minilogSettings; } catch(e) {}
  return this;
};

exports = module.exports = Minilog;

exports.backends = {
  array: __webpack_require__(28),
  browser: Minilog.defaultBackend,
  localStorage: __webpack_require__(29),
  jQuery: __webpack_require__(30)
};


/***/ }),
/* 20 */
/***/ ((module, exports, __webpack_require__) => {

var Transform = __webpack_require__(21),
    Filter = __webpack_require__(23);

var log = new Transform(),
    slice = Array.prototype.slice;

exports = module.exports = function create(name) {
  var o   = function() { log.write(name, undefined, slice.call(arguments)); return o; };
  o.debug = function() { log.write(name, 'debug', slice.call(arguments)); return o; };
  o.info  = function() { log.write(name, 'info',  slice.call(arguments)); return o; };
  o.warn  = function() { log.write(name, 'warn',  slice.call(arguments)); return o; };
  o.error = function() { log.write(name, 'error', slice.call(arguments)); return o; };
  o.group = function() { log.write(name, 'group', slice.call(arguments)); return o; };
  o.groupEnd = function() { log.write(name, 'groupEnd', slice.call(arguments)); return o; };
  o.log   = o.debug; // for interface compliance with Node and browser consoles
  o.suggest = exports.suggest;
  o.format = log.format;
  return o;
};

// filled in separately
exports.defaultBackend = exports.defaultFormatter = null;

exports.pipe = function(dest) {
  return log.pipe(dest);
};

exports.end = exports.unpipe = exports.disable = function(from) {
  return log.unpipe(from);
};

exports.Transform = Transform;
exports.Filter = Filter;
// this is the default filter that's applied when .enable() is called normally
// you can bypass it completely and set up your own pipes
exports.suggest = new Filter();

exports.enable = function() {
  if(exports.defaultFormatter) {
    return log.pipe(exports.suggest) // filter
              .pipe(exports.defaultFormatter) // formatter
              .pipe(exports.defaultBackend); // backend
  }
  return log.pipe(exports.suggest) // filter
            .pipe(exports.defaultBackend); // formatter
};



/***/ }),
/* 21 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var microee = __webpack_require__(22);

// Implements a subset of Node's stream.Transform - in a cross-platform manner.
function Transform() {}

microee.mixin(Transform);

// The write() signature is different from Node's
// --> makes it much easier to work with objects in logs.
// One of the lessons from v1 was that it's better to target
// a good browser rather than the lowest common denominator
// internally.
// If you want to use external streams, pipe() to ./stringify.js first.
Transform.prototype.write = function(name, level, args) {
  this.emit('item', name, level, args);
};

Transform.prototype.end = function() {
  this.emit('end');
  this.removeAllListeners();
};

Transform.prototype.pipe = function(dest) {
  var s = this;
  // prevent double piping
  s.emit('unpipe', dest);
  // tell the dest that it's being piped to
  dest.emit('pipe', s);

  function onItem() {
    dest.write.apply(dest, Array.prototype.slice.call(arguments));
  }
  function onEnd() { !dest._isStdio && dest.end(); }

  s.on('item', onItem);
  s.on('end', onEnd);

  s.when('unpipe', function(from) {
    var match = (from === dest) || typeof from == 'undefined';
    if(match) {
      s.removeListener('item', onItem);
      s.removeListener('end', onEnd);
      dest.emit('unpipe');
    }
    return match;
  });

  return dest;
};

Transform.prototype.unpipe = function(from) {
  this.emit('unpipe', from);
  return this;
};

Transform.prototype.format = function(dest) {
  throw new Error([
    'Warning: .format() is deprecated in Minilog v2! Use .pipe() instead. For example:',
    'var Minilog = require(\'minilog\');',
    'Minilog',
    '  .pipe(Minilog.backends.console.formatClean)',
    '  .pipe(Minilog.backends.console);'].join('\n'));
};

Transform.mixin = function(dest) {
  var o = Transform.prototype, k;
  for (k in o) {
    o.hasOwnProperty(k) && (dest.prototype[k] = o[k]);
  }
};

module.exports = Transform;


/***/ }),
/* 22 */
/***/ ((module) => {

function M() { this._events = {}; }
M.prototype = {
  on: function(ev, cb) {
    this._events || (this._events = {});
    var e = this._events;
    (e[ev] || (e[ev] = [])).push(cb);
    return this;
  },
  removeListener: function(ev, cb) {
    var e = this._events[ev] || [], i;
    for(i = e.length-1; i >= 0 && e[i]; i--){
      if(e[i] === cb || e[i].cb === cb) { e.splice(i, 1); }
    }
  },
  removeAllListeners: function(ev) {
    if(!ev) { this._events = {}; }
    else { this._events[ev] && (this._events[ev] = []); }
  },
  listeners: function(ev) {
    return (this._events ? this._events[ev] || [] : []);
  },
  emit: function(ev) {
    this._events || (this._events = {});
    var args = Array.prototype.slice.call(arguments, 1), i, e = this._events[ev] || [];
    for(i = e.length-1; i >= 0 && e[i]; i--){
      e[i].apply(this, args);
    }
    return this;
  },
  when: function(ev, cb) {
    return this.once(ev, cb, true);
  },
  once: function(ev, cb, when) {
    if(!cb) return this;
    function c() {
      if(!when) this.removeListener(ev, c);
      if(cb.apply(this, arguments) && when) this.removeListener(ev, c);
    }
    c.cb = cb;
    this.on(ev, c);
    return this;
  }
};
M.mixin = function(dest) {
  var o = M.prototype, k;
  for (k in o) {
    o.hasOwnProperty(k) && (dest.prototype[k] = o[k]);
  }
};
module.exports = M;


/***/ }),
/* 23 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// default filter
var Transform = __webpack_require__(21);

var levelMap = { debug: 1, info: 2, warn: 3, error: 4 };

function Filter() {
  this.enabled = true;
  this.defaultResult = true;
  this.clear();
}

Transform.mixin(Filter);

// allow all matching, with level >= given level
Filter.prototype.allow = function(name, level) {
  this._white.push({ n: name, l: levelMap[level] });
  return this;
};

// deny all matching, with level <= given level
Filter.prototype.deny = function(name, level) {
  this._black.push({ n: name, l: levelMap[level] });
  return this;
};

Filter.prototype.clear = function() {
  this._white = [];
  this._black = [];
  return this;
};

function test(rule, name) {
  // use .test for RegExps
  return (rule.n.test ? rule.n.test(name) : rule.n == name);
};

Filter.prototype.test = function(name, level) {
  var i, len = Math.max(this._white.length, this._black.length);
  for(i = 0; i < len; i++) {
    if(this._white[i] && test(this._white[i], name) && levelMap[level] >= this._white[i].l) {
      return true;
    }
    if(this._black[i] && test(this._black[i], name) && levelMap[level] <= this._black[i].l) {
      return false;
    }
  }
  return this.defaultResult;
};

Filter.prototype.write = function(name, level, args) {
  if(!this.enabled || this.test(name, level)) {
    return this.emit('item', name, level, args);
  }
};

module.exports = Filter;


/***/ }),
/* 24 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Transform = __webpack_require__(21);

var newlines = /\n+$/,
    logger = new Transform();

logger.write = function(name, level, args) {
  var i = args.length-1;
  if (typeof console === 'undefined' || !console.log) {
    return;
  }
  if(console.log.apply) {
    return console.log.apply(console, [name, level].concat(args));
  } else if(JSON && JSON.stringify) {
    // console.log.apply is undefined in IE8 and IE9
    // for IE8/9: make console.log at least a bit less awful
    if(args[i] && typeof args[i] == 'string') {
      args[i] = args[i].replace(newlines, '');
    }
    try {
      for(i = 0; i < args.length; i++) {
        args[i] = JSON.stringify(args[i]);
      }
    } catch(e) {}
    console.log(args.join(' '));
  }
};

logger.formatters = ['color', 'minilog'];
logger.color = __webpack_require__(25);
logger.minilog = __webpack_require__(27);

module.exports = logger;


/***/ }),
/* 25 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Transform = __webpack_require__(21),
    color = __webpack_require__(26);

var colors = { debug: ['cyan'], info: ['purple' ], warn: [ 'yellow', true ], error: [ 'red', true ] },
    logger = new Transform();

logger.write = function(name, level, args) {
  var fn = console.log;
  if(console[level] && console[level].apply) {
    fn = console[level];
    fn.apply(console, [ '%c'+name+' %c'+level, color('gray'), color.apply(color, colors[level])].concat(args));
  }
};

// NOP, because piping the formatted logs can only cause trouble.
logger.pipe = function() { };

module.exports = logger;


/***/ }),
/* 26 */
/***/ ((module) => {

var hex = {
  black: '#000',
  red: '#c23621',
  green: '#25bc26',
  yellow: '#bbbb00',
  blue:  '#492ee1',
  magenta: '#d338d3',
  cyan: '#33bbc8',
  gray: '#808080',
  purple: '#708'
};
function color(fg, isInverse) {
  if(isInverse) {
    return 'color: #fff; background: '+hex[fg]+';';
  } else {
    return 'color: '+hex[fg]+';';
  }
}

module.exports = color;


/***/ }),
/* 27 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Transform = __webpack_require__(21),
    color = __webpack_require__(26),
    colors = { debug: ['gray'], info: ['purple' ], warn: [ 'yellow', true ], error: [ 'red', true ] },
    logger = new Transform();

logger.write = function(name, level, args) {
  var fn = console.log;
  if(level != 'debug' && console[level]) {
    fn = console[level];
  }

  var subset = [], i = 0;
  if(level != 'info') {
    for(; i < args.length; i++) {
      if(typeof args[i] != 'string') break;
    }
    fn.apply(console, [ '%c'+name +' '+ args.slice(0, i).join(' '), color.apply(color, colors[level]) ].concat(args.slice(i)));
  } else {
    fn.apply(console, [ '%c'+name, color.apply(color, colors[level]) ].concat(args));
  }
};

// NOP, because piping the formatted logs can only cause trouble.
logger.pipe = function() { };

module.exports = logger;


/***/ }),
/* 28 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Transform = __webpack_require__(21),
    cache = [ ];

var logger = new Transform();

logger.write = function(name, level, args) {
  cache.push([ name, level, args ]);
};

// utility functions
logger.get = function() { return cache; };
logger.empty = function() { cache = []; };

module.exports = logger;


/***/ }),
/* 29 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Transform = __webpack_require__(21),
    cache = false;

var logger = new Transform();

logger.write = function(name, level, args) {
  if(typeof window == 'undefined' || typeof JSON == 'undefined' || !JSON.stringify || !JSON.parse) return;
  try {
    if(!cache) { cache = (window.localStorage.minilog ? JSON.parse(window.localStorage.minilog) : []); }
    cache.push([ new Date().toString(), name, level, args ]);
    window.localStorage.minilog = JSON.stringify(cache);
  } catch(e) {}
};

module.exports = logger;

/***/ }),
/* 30 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Transform = __webpack_require__(21);

var cid = new Date().valueOf().toString(36);

function AjaxLogger(options) {
  this.url = options.url || '';
  this.cache = [];
  this.timer = null;
  this.interval = options.interval || 30*1000;
  this.enabled = true;
  this.jQuery = window.jQuery;
  this.extras = {};
}

Transform.mixin(AjaxLogger);

AjaxLogger.prototype.write = function(name, level, args) {
  if(!this.timer) { this.init(); }
  this.cache.push([name, level].concat(args));
};

AjaxLogger.prototype.init = function() {
  if(!this.enabled || !this.jQuery) return;
  var self = this;
  this.timer = setTimeout(function() {
    var i, logs = [], ajaxData, url = self.url;
    if(self.cache.length == 0) return self.init();
    // Test each log line and only log the ones that are valid (e.g. don't have circular references).
    // Slight performance hit but benefit is we log all valid lines.
    for(i = 0; i < self.cache.length; i++) {
      try {
        JSON.stringify(self.cache[i]);
        logs.push(self.cache[i]);
      } catch(e) { }
    }
    if(self.jQuery.isEmptyObject(self.extras)) {
        ajaxData = JSON.stringify({ logs: logs });
        url = self.url + '?client_id=' + cid;
    } else {
        ajaxData = JSON.stringify(self.jQuery.extend({logs: logs}, self.extras));
    }

    self.jQuery.ajax(url, {
      type: 'POST',
      cache: false,
      processData: false,
      data: ajaxData,
      contentType: 'application/json',
      timeout: 10000
    }).success(function(data, status, jqxhr) {
      if(data.interval) {
        self.interval = Math.max(1000, data.interval);
      }
    }).error(function() {
      self.interval = 30000;
    }).always(function() {
      self.init();
    });
    self.cache = [];
  }, this.interval);
};

AjaxLogger.prototype.end = function() {};

// wait until jQuery is defined. Useful if you don't control the load order.
AjaxLogger.jQueryWait = function(onDone) {
  if(typeof window !== 'undefined' && (window.jQuery || window.$)) {
    return onDone(window.jQuery || window.$);
  } else if (typeof window !== 'undefined') {
    setTimeout(function() { AjaxLogger.jQueryWait(onDone); }, 200);
  }
};

module.exports = AjaxLogger;


/***/ }),
/* 31 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var _a;
var __defProp$1 = Object.defineProperty;
var __defNormalProp$1 = (obj, key, value) => key in obj ? __defProp$1(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$1 = (obj, key, value) => __defNormalProp$1(obj, typeof key !== "symbol" ? key + "" : key, value);
var NodeType$3 = /* @__PURE__ */ ((NodeType2) => {
  NodeType2[NodeType2["Document"] = 0] = "Document";
  NodeType2[NodeType2["DocumentType"] = 1] = "DocumentType";
  NodeType2[NodeType2["Element"] = 2] = "Element";
  NodeType2[NodeType2["Text"] = 3] = "Text";
  NodeType2[NodeType2["CDATA"] = 4] = "CDATA";
  NodeType2[NodeType2["Comment"] = 5] = "Comment";
  return NodeType2;
})(NodeType$3 || {});
const testableAccessors$1 = {
  Node: ["childNodes", "parentNode", "parentElement", "textContent"],
  ShadowRoot: ["host", "styleSheets"],
  Element: ["shadowRoot", "querySelector", "querySelectorAll"],
  MutationObserver: []
};
const testableMethods$1 = {
  Node: ["contains", "getRootNode"],
  ShadowRoot: ["getSelection"],
  Element: [],
  MutationObserver: ["constructor"]
};
const untaintedBasePrototype$1 = {};
const isAngularZonePresent$1 = () => {
  return !!globalThis.Zone;
};
function getUntaintedPrototype$1(key) {
  if (untaintedBasePrototype$1[key])
    return untaintedBasePrototype$1[key];
  const defaultObj = globalThis[key];
  const defaultPrototype = defaultObj.prototype;
  const accessorNames = key in testableAccessors$1 ? testableAccessors$1[key] : void 0;
  const isUntaintedAccessors = Boolean(
    accessorNames && // @ts-expect-error 2345
    accessorNames.every(
      (accessor) => {
        var _a2, _b;
        return Boolean(
          (_b = (_a2 = Object.getOwnPropertyDescriptor(defaultPrototype, accessor)) == null ? void 0 : _a2.get) == null ? void 0 : _b.toString().includes("[native code]")
        );
      }
    )
  );
  const methodNames = key in testableMethods$1 ? testableMethods$1[key] : void 0;
  const isUntaintedMethods = Boolean(
    methodNames && methodNames.every(
      // @ts-expect-error 2345
      (method) => {
        var _a2;
        return typeof defaultPrototype[method] === "function" && ((_a2 = defaultPrototype[method]) == null ? void 0 : _a2.toString().includes("[native code]"));
      }
    )
  );
  if (isUntaintedAccessors && isUntaintedMethods && !isAngularZonePresent$1()) {
    untaintedBasePrototype$1[key] = defaultObj.prototype;
    return defaultObj.prototype;
  }
  try {
    const iframeEl = document.createElement("iframe");
    document.body.appendChild(iframeEl);
    const win = iframeEl.contentWindow;
    if (!win) return defaultObj.prototype;
    const untaintedObject = win[key].prototype;
    document.body.removeChild(iframeEl);
    if (!untaintedObject) return defaultPrototype;
    return untaintedBasePrototype$1[key] = untaintedObject;
  } catch {
    return defaultPrototype;
  }
}
const untaintedAccessorCache$1 = {};
function getUntaintedAccessor$1(key, instance, accessor) {
  var _a2;
  const cacheKey = `${key}.${String(accessor)}`;
  if (untaintedAccessorCache$1[cacheKey])
    return untaintedAccessorCache$1[cacheKey].call(
      instance
    );
  const untaintedPrototype = getUntaintedPrototype$1(key);
  const untaintedAccessor = (_a2 = Object.getOwnPropertyDescriptor(
    untaintedPrototype,
    accessor
  )) == null ? void 0 : _a2.get;
  if (!untaintedAccessor) return instance[accessor];
  untaintedAccessorCache$1[cacheKey] = untaintedAccessor;
  return untaintedAccessor.call(instance);
}
const untaintedMethodCache$1 = {};
function getUntaintedMethod$1(key, instance, method) {
  const cacheKey = `${key}.${String(method)}`;
  if (untaintedMethodCache$1[cacheKey])
    return untaintedMethodCache$1[cacheKey].bind(
      instance
    );
  const untaintedPrototype = getUntaintedPrototype$1(key);
  const untaintedMethod = untaintedPrototype[method];
  if (typeof untaintedMethod !== "function") return instance[method];
  untaintedMethodCache$1[cacheKey] = untaintedMethod;
  return untaintedMethod.bind(instance);
}
function childNodes$1(n2) {
  return getUntaintedAccessor$1("Node", n2, "childNodes");
}
function parentNode$1(n2) {
  return getUntaintedAccessor$1("Node", n2, "parentNode");
}
function parentElement$1(n2) {
  return getUntaintedAccessor$1("Node", n2, "parentElement");
}
function textContent$1(n2) {
  return getUntaintedAccessor$1("Node", n2, "textContent");
}
function contains$1(n2, other) {
  return getUntaintedMethod$1("Node", n2, "contains")(other);
}
function getRootNode$1(n2) {
  return getUntaintedMethod$1("Node", n2, "getRootNode")();
}
function host$1(n2) {
  if (!n2 || !("host" in n2)) return null;
  return getUntaintedAccessor$1("ShadowRoot", n2, "host");
}
function styleSheets$1(n2) {
  return n2.styleSheets;
}
function shadowRoot$1(n2) {
  if (!n2 || !("shadowRoot" in n2)) return null;
  return getUntaintedAccessor$1("Element", n2, "shadowRoot");
}
function querySelector$1(n2, selectors) {
  return getUntaintedAccessor$1("Element", n2, "querySelector")(selectors);
}
function querySelectorAll$1(n2, selectors) {
  return getUntaintedAccessor$1("Element", n2, "querySelectorAll")(selectors);
}
function mutationObserverCtor$1() {
  return getUntaintedPrototype$1("MutationObserver").constructor;
}
const index$1 = {
  childNodes: childNodes$1,
  parentNode: parentNode$1,
  parentElement: parentElement$1,
  textContent: textContent$1,
  contains: contains$1,
  getRootNode: getRootNode$1,
  host: host$1,
  styleSheets: styleSheets$1,
  shadowRoot: shadowRoot$1,
  querySelector: querySelector$1,
  querySelectorAll: querySelectorAll$1,
  mutationObserver: mutationObserverCtor$1
};
function isElement(n2) {
  return n2.nodeType === n2.ELEMENT_NODE;
}
function isShadowRoot(n2) {
  const hostEl = (
    // anchor and textarea elements also have a `host` property
    // but only shadow roots have a `mode` property
    n2 && "host" in n2 && "mode" in n2 && index$1.host(n2) || null
  );
  return Boolean(
    hostEl && "shadowRoot" in hostEl && index$1.shadowRoot(hostEl) === n2
  );
}
function isNativeShadowDom(shadowRoot2) {
  return Object.prototype.toString.call(shadowRoot2) === "[object ShadowRoot]";
}
function fixBrowserCompatibilityIssuesInCSS(cssText) {
  if (cssText.includes(" background-clip: text;") && !cssText.includes(" -webkit-background-clip: text;")) {
    cssText = cssText.replace(
      /\sbackground-clip:\s*text;/g,
      " -webkit-background-clip: text; background-clip: text;"
    );
  }
  return cssText;
}
function escapeImportStatement(rule2) {
  const { cssText } = rule2;
  if (cssText.split('"').length < 3) return cssText;
  const statement = ["@import", `url(${JSON.stringify(rule2.href)})`];
  if (rule2.layerName === "") {
    statement.push(`layer`);
  } else if (rule2.layerName) {
    statement.push(`layer(${rule2.layerName})`);
  }
  if (rule2.supportsText) {
    statement.push(`supports(${rule2.supportsText})`);
  }
  if (rule2.media.length) {
    statement.push(rule2.media.mediaText);
  }
  return statement.join(" ") + ";";
}
function stringifyStylesheet(s2) {
  try {
    const rules2 = s2.rules || s2.cssRules;
    if (!rules2) {
      return null;
    }
    let sheetHref = s2.href;
    if (!sheetHref && s2.ownerNode && s2.ownerNode.ownerDocument) {
      sheetHref = s2.ownerNode.ownerDocument.location.href;
    }
    const stringifiedRules = Array.from(
      rules2,
      (rule2) => stringifyRule(rule2, sheetHref)
    ).join("");
    return fixBrowserCompatibilityIssuesInCSS(stringifiedRules);
  } catch (error) {
    return null;
  }
}
function stringifyRule(rule2, sheetHref) {
  if (isCSSImportRule(rule2)) {
    let importStringified;
    try {
      importStringified = // for same-origin stylesheets,
      // we can access the imported stylesheet rules directly
      stringifyStylesheet(rule2.styleSheet) || // work around browser issues with the raw string `@import url(...)` statement
      escapeImportStatement(rule2);
    } catch (error) {
      importStringified = rule2.cssText;
    }
    if (rule2.styleSheet.href) {
      return absolutifyURLs(importStringified, rule2.styleSheet.href);
    }
    return importStringified;
  } else {
    let ruleStringified = rule2.cssText;
    if (isCSSStyleRule(rule2) && rule2.selectorText.includes(":")) {
      ruleStringified = fixSafariColons(ruleStringified);
    }
    if (sheetHref) {
      return absolutifyURLs(ruleStringified, sheetHref);
    }
    return ruleStringified;
  }
}
function fixSafariColons(cssStringified) {
  const regex = /(\[(?:[\w-]+)[^\\])(:(?:[\w-]+)\])/gm;
  return cssStringified.replace(regex, "$1\\$2");
}
function isCSSImportRule(rule2) {
  return "styleSheet" in rule2;
}
function isCSSStyleRule(rule2) {
  return "selectorText" in rule2;
}
class Mirror {
  constructor() {
    __publicField$1(this, "idNodeMap", /* @__PURE__ */ new Map());
    __publicField$1(this, "nodeMetaMap", /* @__PURE__ */ new WeakMap());
  }
  getId(n2) {
    var _a2;
    if (!n2) return -1;
    const id = (_a2 = this.getMeta(n2)) == null ? void 0 : _a2.id;
    return id ?? -1;
  }
  getNode(id) {
    return this.idNodeMap.get(id) || null;
  }
  getIds() {
    return Array.from(this.idNodeMap.keys());
  }
  getMeta(n2) {
    return this.nodeMetaMap.get(n2) || null;
  }
  // removes the node from idNodeMap
  // doesn't remove the node from nodeMetaMap
  removeNodeFromMap(n2) {
    const id = this.getId(n2);
    this.idNodeMap.delete(id);
    if (n2.childNodes) {
      n2.childNodes.forEach(
        (childNode) => this.removeNodeFromMap(childNode)
      );
    }
  }
  has(id) {
    return this.idNodeMap.has(id);
  }
  hasNode(node2) {
    return this.nodeMetaMap.has(node2);
  }
  add(n2, meta) {
    const id = meta.id;
    this.idNodeMap.set(id, n2);
    this.nodeMetaMap.set(n2, meta);
  }
  replace(id, n2) {
    const oldNode = this.getNode(id);
    if (oldNode) {
      const meta = this.nodeMetaMap.get(oldNode);
      if (meta) this.nodeMetaMap.set(n2, meta);
    }
    this.idNodeMap.set(id, n2);
  }
  reset() {
    this.idNodeMap = /* @__PURE__ */ new Map();
    this.nodeMetaMap = /* @__PURE__ */ new WeakMap();
  }
}
function createMirror$2() {
  return new Mirror();
}
function maskInputValue({
  element,
  maskInputOptions,
  tagName,
  type,
  value,
  maskInputFn
}) {
  let text = value || "";
  const actualType = type && toLowerCase(type);
  if (maskInputOptions[tagName.toLowerCase()] || actualType && maskInputOptions[actualType]) {
    if (maskInputFn) {
      text = maskInputFn(text, element);
    } else {
      text = "*".repeat(text.length);
    }
  }
  return text;
}
function toLowerCase(str) {
  return str.toLowerCase();
}
const ORIGINAL_ATTRIBUTE_NAME = "__rrweb_original__";
function is2DCanvasBlank(canvas) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return true;
  const chunkSize = 50;
  for (let x2 = 0; x2 < canvas.width; x2 += chunkSize) {
    for (let y = 0; y < canvas.height; y += chunkSize) {
      const getImageData = ctx.getImageData;
      const originalGetImageData = ORIGINAL_ATTRIBUTE_NAME in getImageData ? getImageData[ORIGINAL_ATTRIBUTE_NAME] : getImageData;
      const pixelBuffer = new Uint32Array(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        originalGetImageData.call(
          ctx,
          x2,
          y,
          Math.min(chunkSize, canvas.width - x2),
          Math.min(chunkSize, canvas.height - y)
        ).data.buffer
      );
      if (pixelBuffer.some((pixel) => pixel !== 0)) return false;
    }
  }
  return true;
}
function getInputType(element) {
  const type = element.type;
  return element.hasAttribute("data-rr-is-password") ? "password" : type ? (
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    toLowerCase(type)
  ) : null;
}
function extractFileExtension(path, baseURL) {
  let url;
  try {
    url = new URL(path, baseURL ?? window.location.href);
  } catch (err) {
    return null;
  }
  const regex = /\.([0-9a-z]+)(?:$)/i;
  const match = url.pathname.match(regex);
  return (match == null ? void 0 : match[1]) ?? null;
}
function extractOrigin(url) {
  let origin = "";
  if (url.indexOf("//") > -1) {
    origin = url.split("/").slice(0, 3).join("/");
  } else {
    origin = url.split("/")[0];
  }
  origin = origin.split("?")[0];
  return origin;
}
const URL_IN_CSS_REF = /url\((?:(')([^']*)'|(")(.*?)"|([^)]*))\)/gm;
const URL_PROTOCOL_MATCH = /^(?:[a-z+]+:)?\/\//i;
const URL_WWW_MATCH = /^www\..*/i;
const DATA_URI = /^(data:)([^,]*),(.*)/i;
function absolutifyURLs(cssText, href) {
  return (cssText || "").replace(
    URL_IN_CSS_REF,
    (origin, quote1, path1, quote2, path2, path3) => {
      const filePath = path1 || path2 || path3;
      const maybeQuote = quote1 || quote2 || "";
      if (!filePath) {
        return origin;
      }
      if (URL_PROTOCOL_MATCH.test(filePath) || URL_WWW_MATCH.test(filePath)) {
        return `url(${maybeQuote}${filePath}${maybeQuote})`;
      }
      if (DATA_URI.test(filePath)) {
        return `url(${maybeQuote}${filePath}${maybeQuote})`;
      }
      if (filePath[0] === "/") {
        return `url(${maybeQuote}${extractOrigin(href) + filePath}${maybeQuote})`;
      }
      const stack = href.split("/");
      const parts = filePath.split("/");
      stack.pop();
      for (const part of parts) {
        if (part === ".") {
          continue;
        } else if (part === "..") {
          stack.pop();
        } else {
          stack.push(part);
        }
      }
      return `url(${maybeQuote}${stack.join("/")}${maybeQuote})`;
    }
  );
}
function normalizeCssString(cssText) {
  return cssText.replace(/(\/\*[^*]*\*\/)|[\s;]/g, "");
}
function splitCssText(cssText, style) {
  const childNodes2 = Array.from(style.childNodes);
  const splits = [];
  if (childNodes2.length > 1 && cssText && typeof cssText === "string") {
    const cssTextNorm = normalizeCssString(cssText);
    for (let i2 = 1; i2 < childNodes2.length; i2++) {
      if (childNodes2[i2].textContent && typeof childNodes2[i2].textContent === "string") {
        const textContentNorm = normalizeCssString(childNodes2[i2].textContent);
        for (let j = 3; j < textContentNorm.length; j++) {
          const bit = textContentNorm.substring(0, j);
          if (cssTextNorm.split(bit).length === 2) {
            const splitNorm = cssTextNorm.indexOf(bit);
            for (let k = splitNorm; k < cssText.length; k++) {
              if (normalizeCssString(cssText.substring(0, k)).length === splitNorm) {
                splits.push(cssText.substring(0, k));
                cssText = cssText.substring(k);
                break;
              }
            }
            break;
          }
        }
      }
    }
  }
  splits.push(cssText);
  return splits;
}
function markCssSplits(cssText, style) {
  return splitCssText(cssText, style).join("/* rr_split */");
}
let _id = 1;
const tagNameRegex = new RegExp("[^a-z0-9-_:]");
const IGNORED_NODE = -2;
function genId() {
  return _id++;
}
function getValidTagName$1(element) {
  if (element instanceof HTMLFormElement) {
    return "form";
  }
  const processedTagName = toLowerCase(element.tagName);
  if (tagNameRegex.test(processedTagName)) {
    return "div";
  }
  return processedTagName;
}
let canvasService;
let canvasCtx;
const SRCSET_NOT_SPACES = /^[^ \t\n\r\u000c]+/;
const SRCSET_COMMAS_OR_SPACES = /^[, \t\n\r\u000c]+/;
function getAbsoluteSrcsetString(doc, attributeValue) {
  if (attributeValue.trim() === "") {
    return attributeValue;
  }
  let pos = 0;
  function collectCharacters(regEx) {
    let chars2;
    const match = regEx.exec(attributeValue.substring(pos));
    if (match) {
      chars2 = match[0];
      pos += chars2.length;
      return chars2;
    }
    return "";
  }
  const output = [];
  while (true) {
    collectCharacters(SRCSET_COMMAS_OR_SPACES);
    if (pos >= attributeValue.length) {
      break;
    }
    let url = collectCharacters(SRCSET_NOT_SPACES);
    if (url.slice(-1) === ",") {
      url = absoluteToDoc(doc, url.substring(0, url.length - 1));
      output.push(url);
    } else {
      let descriptorsStr = "";
      url = absoluteToDoc(doc, url);
      let inParens = false;
      while (true) {
        const c2 = attributeValue.charAt(pos);
        if (c2 === "") {
          output.push((url + descriptorsStr).trim());
          break;
        } else if (!inParens) {
          if (c2 === ",") {
            pos += 1;
            output.push((url + descriptorsStr).trim());
            break;
          } else if (c2 === "(") {
            inParens = true;
          }
        } else {
          if (c2 === ")") {
            inParens = false;
          }
        }
        descriptorsStr += c2;
        pos += 1;
      }
    }
  }
  return output.join(", ");
}
const cachedDocument = /* @__PURE__ */ new WeakMap();
function absoluteToDoc(doc, attributeValue) {
  if (!attributeValue || attributeValue.trim() === "") {
    return attributeValue;
  }
  return getHref(doc, attributeValue);
}
function isSVGElement(el) {
  return Boolean(el.tagName === "svg" || el.ownerSVGElement);
}
function getHref(doc, customHref) {
  let a2 = cachedDocument.get(doc);
  if (!a2) {
    a2 = doc.createElement("a");
    cachedDocument.set(doc, a2);
  }
  if (!customHref) {
    customHref = "";
  } else if (customHref.startsWith("blob:") || customHref.startsWith("data:")) {
    return customHref;
  }
  a2.setAttribute("href", customHref);
  return a2.href;
}
function transformAttribute(doc, tagName, name, value) {
  if (!value) {
    return value;
  }
  if (name === "src" || name === "href" && !(tagName === "use" && value[0] === "#")) {
    return absoluteToDoc(doc, value);
  } else if (name === "xlink:href" && value[0] !== "#") {
    return absoluteToDoc(doc, value);
  } else if (name === "background" && (tagName === "table" || tagName === "td" || tagName === "th")) {
    return absoluteToDoc(doc, value);
  } else if (name === "srcset") {
    return getAbsoluteSrcsetString(doc, value);
  } else if (name === "style") {
    return absolutifyURLs(value, getHref(doc));
  } else if (tagName === "object" && name === "data") {
    return absoluteToDoc(doc, value);
  }
  return value;
}
function ignoreAttribute(tagName, name, _value) {
  return (tagName === "video" || tagName === "audio") && name === "autoplay";
}
function _isBlockedElement(element, blockClass, blockSelector) {
  try {
    if (typeof blockClass === "string") {
      if (element.classList.contains(blockClass)) {
        return true;
      }
    } else {
      for (let eIndex = element.classList.length; eIndex--; ) {
        const className = element.classList[eIndex];
        if (blockClass.test(className)) {
          return true;
        }
      }
    }
    if (blockSelector) {
      return element.matches(blockSelector);
    }
  } catch (e2) {
  }
  return false;
}
function classMatchesRegex(node2, regex, checkAncestors) {
  if (!node2) return false;
  if (node2.nodeType !== node2.ELEMENT_NODE) {
    if (!checkAncestors) return false;
    return classMatchesRegex(index$1.parentNode(node2), regex, checkAncestors);
  }
  for (let eIndex = node2.classList.length; eIndex--; ) {
    const className = node2.classList[eIndex];
    if (regex.test(className)) {
      return true;
    }
  }
  if (!checkAncestors) return false;
  return classMatchesRegex(index$1.parentNode(node2), regex, checkAncestors);
}
function needMaskingText(node2, maskTextClass, maskTextSelector, checkAncestors) {
  let el;
  if (isElement(node2)) {
    el = node2;
    if (!index$1.childNodes(el).length) {
      return false;
    }
  } else if (index$1.parentElement(node2) === null) {
    return false;
  } else {
    el = index$1.parentElement(node2);
  }
  try {
    if (typeof maskTextClass === "string") {
      if (checkAncestors) {
        if (el.closest(`.${maskTextClass}`)) return true;
      } else {
        if (el.classList.contains(maskTextClass)) return true;
      }
    } else {
      if (classMatchesRegex(el, maskTextClass, checkAncestors)) return true;
    }
    if (maskTextSelector) {
      if (checkAncestors) {
        if (el.closest(maskTextSelector)) return true;
      } else {
        if (el.matches(maskTextSelector)) return true;
      }
    }
  } catch (e2) {
  }
  return false;
}
function onceIframeLoaded(iframeEl, listener, iframeLoadTimeout) {
  const win = iframeEl.contentWindow;
  if (!win) {
    return;
  }
  let fired = false;
  let readyState;
  try {
    readyState = win.document.readyState;
  } catch (error) {
    return;
  }
  if (readyState !== "complete") {
    const timer = setTimeout(() => {
      if (!fired) {
        listener();
        fired = true;
      }
    }, iframeLoadTimeout);
    iframeEl.addEventListener("load", () => {
      clearTimeout(timer);
      fired = true;
      listener();
    });
    return;
  }
  const blankUrl = "about:blank";
  if (win.location.href !== blankUrl || iframeEl.src === blankUrl || iframeEl.src === "") {
    setTimeout(listener, 0);
    return iframeEl.addEventListener("load", listener);
  }
  iframeEl.addEventListener("load", listener);
}
function onceStylesheetLoaded(link, listener, styleSheetLoadTimeout) {
  let fired = false;
  let styleSheetLoaded;
  try {
    styleSheetLoaded = link.sheet;
  } catch (error) {
    return;
  }
  if (styleSheetLoaded) return;
  const timer = setTimeout(() => {
    if (!fired) {
      listener();
      fired = true;
    }
  }, styleSheetLoadTimeout);
  link.addEventListener("load", () => {
    clearTimeout(timer);
    fired = true;
    listener();
  });
}
function serializeNode(n2, options) {
  const {
    doc,
    mirror: mirror2,
    blockClass,
    blockSelector,
    needsMask,
    inlineStylesheet,
    maskInputOptions = {},
    maskTextFn,
    maskInputFn,
    dataURLOptions = {},
    inlineImages,
    recordCanvas,
    keepIframeSrcFn,
    newlyAddedElement = false,
    cssCaptured = false
  } = options;
  const rootId = getRootId(doc, mirror2);
  switch (n2.nodeType) {
    case n2.DOCUMENT_NODE:
      if (n2.compatMode !== "CSS1Compat") {
        return {
          type: NodeType$3.Document,
          childNodes: [],
          compatMode: n2.compatMode
          // probably "BackCompat"
        };
      } else {
        return {
          type: NodeType$3.Document,
          childNodes: []
        };
      }
    case n2.DOCUMENT_TYPE_NODE:
      return {
        type: NodeType$3.DocumentType,
        name: n2.name,
        publicId: n2.publicId,
        systemId: n2.systemId,
        rootId
      };
    case n2.ELEMENT_NODE:
      return serializeElementNode(n2, {
        doc,
        blockClass,
        blockSelector,
        inlineStylesheet,
        maskInputOptions,
        maskInputFn,
        dataURLOptions,
        inlineImages,
        recordCanvas,
        keepIframeSrcFn,
        newlyAddedElement,
        rootId
      });
    case n2.TEXT_NODE:
      return serializeTextNode(n2, {
        doc,
        needsMask,
        maskTextFn,
        rootId,
        cssCaptured
      });
    case n2.CDATA_SECTION_NODE:
      return {
        type: NodeType$3.CDATA,
        textContent: "",
        rootId
      };
    case n2.COMMENT_NODE:
      return {
        type: NodeType$3.Comment,
        textContent: index$1.textContent(n2) || "",
        rootId
      };
    default:
      return false;
  }
}
function getRootId(doc, mirror2) {
  if (!mirror2.hasNode(doc)) return void 0;
  const docId = mirror2.getId(doc);
  return docId === 1 ? void 0 : docId;
}
function serializeTextNode(n2, options) {
  const { needsMask, maskTextFn, rootId, cssCaptured } = options;
  const parent = index$1.parentNode(n2);
  const parentTagName = parent && parent.tagName;
  let textContent2 = "";
  const isStyle = parentTagName === "STYLE" ? true : void 0;
  const isScript = parentTagName === "SCRIPT" ? true : void 0;
  if (isScript) {
    textContent2 = "SCRIPT_PLACEHOLDER";
  } else if (!cssCaptured) {
    textContent2 = index$1.textContent(n2);
    if (isStyle && textContent2) {
      textContent2 = absolutifyURLs(textContent2, getHref(options.doc));
    }
  }
  if (!isStyle && !isScript && textContent2 && needsMask) {
    textContent2 = maskTextFn ? maskTextFn(textContent2, index$1.parentElement(n2)) : textContent2.replace(/[\S]/g, "*");
  }
  return {
    type: NodeType$3.Text,
    textContent: textContent2 || "",
    rootId
  };
}
function serializeElementNode(n2, options) {
  const {
    doc,
    blockClass,
    blockSelector,
    inlineStylesheet,
    maskInputOptions = {},
    maskInputFn,
    dataURLOptions = {},
    inlineImages,
    recordCanvas,
    keepIframeSrcFn,
    newlyAddedElement = false,
    rootId
  } = options;
  const needBlock = _isBlockedElement(n2, blockClass, blockSelector);
  const tagName = getValidTagName$1(n2);
  let attributes = {};
  const len = n2.attributes.length;
  for (let i2 = 0; i2 < len; i2++) {
    const attr = n2.attributes[i2];
    if (!ignoreAttribute(tagName, attr.name, attr.value)) {
      attributes[attr.name] = transformAttribute(
        doc,
        tagName,
        toLowerCase(attr.name),
        attr.value
      );
    }
  }
  if (tagName === "link" && inlineStylesheet) {
    const stylesheet = Array.from(doc.styleSheets).find((s2) => {
      return s2.href === n2.href;
    });
    let cssText = null;
    if (stylesheet) {
      cssText = stringifyStylesheet(stylesheet);
    }
    if (cssText) {
      delete attributes.rel;
      delete attributes.href;
      attributes._cssText = cssText;
    }
  }
  if (tagName === "style" && n2.sheet) {
    let cssText = stringifyStylesheet(
      n2.sheet
    );
    if (cssText) {
      if (n2.childNodes.length > 1) {
        cssText = markCssSplits(cssText, n2);
      }
      attributes._cssText = cssText;
    }
  }
  if (tagName === "input" || tagName === "textarea" || tagName === "select") {
    const value = n2.value;
    const checked = n2.checked;
    if (attributes.type !== "radio" && attributes.type !== "checkbox" && attributes.type !== "submit" && attributes.type !== "button" && value) {
      attributes.value = maskInputValue({
        element: n2,
        type: getInputType(n2),
        tagName,
        value,
        maskInputOptions,
        maskInputFn
      });
    } else if (checked) {
      attributes.checked = checked;
    }
  }
  if (tagName === "option") {
    if (n2.selected && !maskInputOptions["select"]) {
      attributes.selected = true;
    } else {
      delete attributes.selected;
    }
  }
  if (tagName === "dialog" && n2.open) {
    attributes.rr_open_mode = n2.matches("dialog:modal") ? "modal" : "non-modal";
  }
  if (tagName === "canvas" && recordCanvas) {
    if (n2.__context === "2d") {
      if (!is2DCanvasBlank(n2)) {
        attributes.rr_dataURL = n2.toDataURL(
          dataURLOptions.type,
          dataURLOptions.quality
        );
      }
    } else if (!("__context" in n2)) {
      const canvasDataURL = n2.toDataURL(
        dataURLOptions.type,
        dataURLOptions.quality
      );
      const blankCanvas = doc.createElement("canvas");
      blankCanvas.width = n2.width;
      blankCanvas.height = n2.height;
      const blankCanvasDataURL = blankCanvas.toDataURL(
        dataURLOptions.type,
        dataURLOptions.quality
      );
      if (canvasDataURL !== blankCanvasDataURL) {
        attributes.rr_dataURL = canvasDataURL;
      }
    }
  }
  if (tagName === "img" && inlineImages) {
    if (!canvasService) {
      canvasService = doc.createElement("canvas");
      canvasCtx = canvasService.getContext("2d");
    }
    const image = n2;
    const imageSrc = image.currentSrc || image.getAttribute("src") || "<unknown-src>";
    const priorCrossOrigin = image.crossOrigin;
    const recordInlineImage = () => {
      image.removeEventListener("load", recordInlineImage);
      try {
        canvasService.width = image.naturalWidth;
        canvasService.height = image.naturalHeight;
        canvasCtx.drawImage(image, 0, 0);
        attributes.rr_dataURL = canvasService.toDataURL(
          dataURLOptions.type,
          dataURLOptions.quality
        );
      } catch (err) {
        if (image.crossOrigin !== "anonymous") {
          image.crossOrigin = "anonymous";
          if (image.complete && image.naturalWidth !== 0)
            recordInlineImage();
          else image.addEventListener("load", recordInlineImage);
          return;
        } else {
          console.warn(
            `Cannot inline img src=${imageSrc}! Error: ${err}`
          );
        }
      }
      if (image.crossOrigin === "anonymous") {
        priorCrossOrigin ? attributes.crossOrigin = priorCrossOrigin : image.removeAttribute("crossorigin");
      }
    };
    if (image.complete && image.naturalWidth !== 0) recordInlineImage();
    else image.addEventListener("load", recordInlineImage);
  }
  if (tagName === "audio" || tagName === "video") {
    const mediaAttributes = attributes;
    mediaAttributes.rr_mediaState = n2.paused ? "paused" : "played";
    mediaAttributes.rr_mediaCurrentTime = n2.currentTime;
    mediaAttributes.rr_mediaPlaybackRate = n2.playbackRate;
    mediaAttributes.rr_mediaMuted = n2.muted;
    mediaAttributes.rr_mediaLoop = n2.loop;
    mediaAttributes.rr_mediaVolume = n2.volume;
  }
  if (!newlyAddedElement) {
    if (n2.scrollLeft) {
      attributes.rr_scrollLeft = n2.scrollLeft;
    }
    if (n2.scrollTop) {
      attributes.rr_scrollTop = n2.scrollTop;
    }
  }
  if (needBlock) {
    const { width, height } = n2.getBoundingClientRect();
    attributes = {
      class: attributes.class,
      rr_width: `${width}px`,
      rr_height: `${height}px`
    };
  }
  if (tagName === "iframe" && !keepIframeSrcFn(attributes.src)) {
    if (!n2.contentDocument) {
      attributes.rr_src = attributes.src;
    }
    delete attributes.src;
  }
  let isCustomElement;
  try {
    if (customElements.get(tagName)) isCustomElement = true;
  } catch (e2) {
  }
  return {
    type: NodeType$3.Element,
    tagName,
    attributes,
    childNodes: [],
    isSVG: isSVGElement(n2) || void 0,
    needBlock,
    rootId,
    isCustom: isCustomElement
  };
}
function lowerIfExists(maybeAttr) {
  if (maybeAttr === void 0 || maybeAttr === null) {
    return "";
  } else {
    return maybeAttr.toLowerCase();
  }
}
function slimDOMExcluded(sn, slimDOMOptions) {
  if (slimDOMOptions.comment && sn.type === NodeType$3.Comment) {
    return true;
  } else if (sn.type === NodeType$3.Element) {
    if (slimDOMOptions.script && // script tag
    (sn.tagName === "script" || // (module)preload link
    sn.tagName === "link" && (sn.attributes.rel === "preload" || sn.attributes.rel === "modulepreload") && sn.attributes.as === "script" || // prefetch link
    sn.tagName === "link" && sn.attributes.rel === "prefetch" && typeof sn.attributes.href === "string" && extractFileExtension(sn.attributes.href) === "js")) {
      return true;
    } else if (slimDOMOptions.headFavicon && (sn.tagName === "link" && sn.attributes.rel === "shortcut icon" || sn.tagName === "meta" && (lowerIfExists(sn.attributes.name).match(
      /^msapplication-tile(image|color)$/
    ) || lowerIfExists(sn.attributes.name) === "application-name" || lowerIfExists(sn.attributes.rel) === "icon" || lowerIfExists(sn.attributes.rel) === "apple-touch-icon" || lowerIfExists(sn.attributes.rel) === "shortcut icon"))) {
      return true;
    } else if (sn.tagName === "meta") {
      if (slimDOMOptions.headMetaDescKeywords && lowerIfExists(sn.attributes.name).match(/^description|keywords$/)) {
        return true;
      } else if (slimDOMOptions.headMetaSocial && (lowerIfExists(sn.attributes.property).match(/^(og|twitter|fb):/) || // og = opengraph (facebook)
      lowerIfExists(sn.attributes.name).match(/^(og|twitter):/) || lowerIfExists(sn.attributes.name) === "pinterest")) {
        return true;
      } else if (slimDOMOptions.headMetaRobots && (lowerIfExists(sn.attributes.name) === "robots" || lowerIfExists(sn.attributes.name) === "googlebot" || lowerIfExists(sn.attributes.name) === "bingbot")) {
        return true;
      } else if (slimDOMOptions.headMetaHttpEquiv && sn.attributes["http-equiv"] !== void 0) {
        return true;
      } else if (slimDOMOptions.headMetaAuthorship && (lowerIfExists(sn.attributes.name) === "author" || lowerIfExists(sn.attributes.name) === "generator" || lowerIfExists(sn.attributes.name) === "framework" || lowerIfExists(sn.attributes.name) === "publisher" || lowerIfExists(sn.attributes.name) === "progid" || lowerIfExists(sn.attributes.property).match(/^article:/) || lowerIfExists(sn.attributes.property).match(/^product:/))) {
        return true;
      } else if (slimDOMOptions.headMetaVerification && (lowerIfExists(sn.attributes.name) === "google-site-verification" || lowerIfExists(sn.attributes.name) === "yandex-verification" || lowerIfExists(sn.attributes.name) === "csrf-token" || lowerIfExists(sn.attributes.name) === "p:domain_verify" || lowerIfExists(sn.attributes.name) === "verify-v1" || lowerIfExists(sn.attributes.name) === "verification" || lowerIfExists(sn.attributes.name) === "shopify-checkout-api-token")) {
        return true;
      }
    }
  }
  return false;
}
function serializeNodeWithId(n2, options) {
  const {
    doc,
    mirror: mirror2,
    blockClass,
    blockSelector,
    maskTextClass,
    maskTextSelector,
    skipChild = false,
    inlineStylesheet = true,
    maskInputOptions = {},
    maskTextFn,
    maskInputFn,
    slimDOMOptions,
    dataURLOptions = {},
    inlineImages = false,
    recordCanvas = false,
    onSerialize,
    onIframeLoad,
    iframeLoadTimeout = 5e3,
    onStylesheetLoad,
    stylesheetLoadTimeout = 5e3,
    keepIframeSrcFn = () => false,
    newlyAddedElement = false,
    cssCaptured = false
  } = options;
  let { needsMask } = options;
  let { preserveWhiteSpace = true } = options;
  if (!needsMask) {
    const checkAncestors = needsMask === void 0;
    needsMask = needMaskingText(
      n2,
      maskTextClass,
      maskTextSelector,
      checkAncestors
    );
  }
  const _serializedNode = serializeNode(n2, {
    doc,
    mirror: mirror2,
    blockClass,
    blockSelector,
    needsMask,
    inlineStylesheet,
    maskInputOptions,
    maskTextFn,
    maskInputFn,
    dataURLOptions,
    inlineImages,
    recordCanvas,
    keepIframeSrcFn,
    newlyAddedElement,
    cssCaptured
  });
  if (!_serializedNode) {
    console.warn(n2, "not serialized");
    return null;
  }
  let id;
  if (mirror2.hasNode(n2)) {
    id = mirror2.getId(n2);
  } else if (slimDOMExcluded(_serializedNode, slimDOMOptions) || !preserveWhiteSpace && _serializedNode.type === NodeType$3.Text && !_serializedNode.textContent.replace(/^\s+|\s+$/gm, "").length) {
    id = IGNORED_NODE;
  } else {
    id = genId();
  }
  const serializedNode = Object.assign(_serializedNode, { id });
  mirror2.add(n2, serializedNode);
  if (id === IGNORED_NODE) {
    return null;
  }
  if (onSerialize) {
    onSerialize(n2);
  }
  let recordChild = !skipChild;
  if (serializedNode.type === NodeType$3.Element) {
    recordChild = recordChild && !serializedNode.needBlock;
    delete serializedNode.needBlock;
    const shadowRootEl = index$1.shadowRoot(n2);
    if (shadowRootEl && isNativeShadowDom(shadowRootEl))
      serializedNode.isShadowHost = true;
  }
  if ((serializedNode.type === NodeType$3.Document || serializedNode.type === NodeType$3.Element) && recordChild) {
    if (slimDOMOptions.headWhitespace && serializedNode.type === NodeType$3.Element && serializedNode.tagName === "head") {
      preserveWhiteSpace = false;
    }
    const bypassOptions = {
      doc,
      mirror: mirror2,
      blockClass,
      blockSelector,
      needsMask,
      maskTextClass,
      maskTextSelector,
      skipChild,
      inlineStylesheet,
      maskInputOptions,
      maskTextFn,
      maskInputFn,
      slimDOMOptions,
      dataURLOptions,
      inlineImages,
      recordCanvas,
      preserveWhiteSpace,
      onSerialize,
      onIframeLoad,
      iframeLoadTimeout,
      onStylesheetLoad,
      stylesheetLoadTimeout,
      keepIframeSrcFn,
      cssCaptured: false
    };
    if (serializedNode.type === NodeType$3.Element && serializedNode.tagName === "textarea" && serializedNode.attributes.value !== void 0) ;
    else {
      if (serializedNode.type === NodeType$3.Element && serializedNode.attributes._cssText !== void 0 && typeof serializedNode.attributes._cssText === "string") {
        bypassOptions.cssCaptured = true;
      }
      for (const childN of Array.from(index$1.childNodes(n2))) {
        const serializedChildNode = serializeNodeWithId(childN, bypassOptions);
        if (serializedChildNode) {
          serializedNode.childNodes.push(serializedChildNode);
        }
      }
    }
    let shadowRootEl = null;
    if (isElement(n2) && (shadowRootEl = index$1.shadowRoot(n2))) {
      for (const childN of Array.from(index$1.childNodes(shadowRootEl))) {
        const serializedChildNode = serializeNodeWithId(childN, bypassOptions);
        if (serializedChildNode) {
          isNativeShadowDom(shadowRootEl) && (serializedChildNode.isShadow = true);
          serializedNode.childNodes.push(serializedChildNode);
        }
      }
    }
  }
  const parent = index$1.parentNode(n2);
  if (parent && isShadowRoot(parent) && isNativeShadowDom(parent)) {
    serializedNode.isShadow = true;
  }
  if (serializedNode.type === NodeType$3.Element && serializedNode.tagName === "iframe") {
    onceIframeLoaded(
      n2,
      () => {
        const iframeDoc = n2.contentDocument;
        if (iframeDoc && onIframeLoad) {
          const serializedIframeNode = serializeNodeWithId(iframeDoc, {
            doc: iframeDoc,
            mirror: mirror2,
            blockClass,
            blockSelector,
            needsMask,
            maskTextClass,
            maskTextSelector,
            skipChild: false,
            inlineStylesheet,
            maskInputOptions,
            maskTextFn,
            maskInputFn,
            slimDOMOptions,
            dataURLOptions,
            inlineImages,
            recordCanvas,
            preserveWhiteSpace,
            onSerialize,
            onIframeLoad,
            iframeLoadTimeout,
            onStylesheetLoad,
            stylesheetLoadTimeout,
            keepIframeSrcFn
          });
          if (serializedIframeNode) {
            onIframeLoad(
              n2,
              serializedIframeNode
            );
          }
        }
      },
      iframeLoadTimeout
    );
  }
  if (serializedNode.type === NodeType$3.Element && serializedNode.tagName === "link" && typeof serializedNode.attributes.rel === "string" && (serializedNode.attributes.rel === "stylesheet" || serializedNode.attributes.rel === "preload" && typeof serializedNode.attributes.href === "string" && extractFileExtension(serializedNode.attributes.href) === "css")) {
    onceStylesheetLoaded(
      n2,
      () => {
        if (onStylesheetLoad) {
          const serializedLinkNode = serializeNodeWithId(n2, {
            doc,
            mirror: mirror2,
            blockClass,
            blockSelector,
            needsMask,
            maskTextClass,
            maskTextSelector,
            skipChild: false,
            inlineStylesheet,
            maskInputOptions,
            maskTextFn,
            maskInputFn,
            slimDOMOptions,
            dataURLOptions,
            inlineImages,
            recordCanvas,
            preserveWhiteSpace,
            onSerialize,
            onIframeLoad,
            iframeLoadTimeout,
            onStylesheetLoad,
            stylesheetLoadTimeout,
            keepIframeSrcFn
          });
          if (serializedLinkNode) {
            onStylesheetLoad(
              n2,
              serializedLinkNode
            );
          }
        }
      },
      stylesheetLoadTimeout
    );
  }
  return serializedNode;
}
function snapshot(n2, options) {
  const {
    mirror: mirror2 = new Mirror(),
    blockClass = "rr-block",
    blockSelector = null,
    maskTextClass = "rr-mask",
    maskTextSelector = null,
    inlineStylesheet = true,
    inlineImages = false,
    recordCanvas = false,
    maskAllInputs = false,
    maskTextFn,
    maskInputFn,
    slimDOM = false,
    dataURLOptions,
    preserveWhiteSpace,
    onSerialize,
    onIframeLoad,
    iframeLoadTimeout,
    onStylesheetLoad,
    stylesheetLoadTimeout,
    keepIframeSrcFn = () => false
  } = options || {};
  const maskInputOptions = maskAllInputs === true ? {
    color: true,
    date: true,
    "datetime-local": true,
    email: true,
    month: true,
    number: true,
    range: true,
    search: true,
    tel: true,
    text: true,
    time: true,
    url: true,
    week: true,
    textarea: true,
    select: true,
    password: true
  } : maskAllInputs === false ? {
    password: true
  } : maskAllInputs;
  const slimDOMOptions = slimDOM === true || slimDOM === "all" ? (
    // if true: set of sensible options that should not throw away any information
    {
      script: true,
      comment: true,
      headFavicon: true,
      headWhitespace: true,
      headMetaDescKeywords: slimDOM === "all",
      // destructive
      headMetaSocial: true,
      headMetaRobots: true,
      headMetaHttpEquiv: true,
      headMetaAuthorship: true,
      headMetaVerification: true
    }
  ) : slimDOM === false ? {} : slimDOM;
  return serializeNodeWithId(n2, {
    doc: n2,
    mirror: mirror2,
    blockClass,
    blockSelector,
    maskTextClass,
    maskTextSelector,
    skipChild: false,
    inlineStylesheet,
    maskInputOptions,
    maskTextFn,
    maskInputFn,
    slimDOMOptions,
    dataURLOptions,
    inlineImages,
    recordCanvas,
    preserveWhiteSpace,
    onSerialize,
    onIframeLoad,
    iframeLoadTimeout,
    onStylesheetLoad,
    stylesheetLoadTimeout,
    keepIframeSrcFn,
    newlyAddedElement: false
  });
}
function getDefaultExportFromCjs$1(x2) {
  return x2 && x2.__esModule && Object.prototype.hasOwnProperty.call(x2, "default") ? x2["default"] : x2;
}
function getAugmentedNamespace$1(n2) {
  if (n2.__esModule) return n2;
  var f2 = n2.default;
  if (typeof f2 == "function") {
    var a2 = function a22() {
      if (this instanceof a22) {
        return Reflect.construct(f2, arguments, this.constructor);
      }
      return f2.apply(this, arguments);
    };
    a2.prototype = f2.prototype;
  } else a2 = {};
  Object.defineProperty(a2, "__esModule", { value: true });
  Object.keys(n2).forEach(function(k) {
    var d = Object.getOwnPropertyDescriptor(n2, k);
    Object.defineProperty(a2, k, d.get ? d : {
      enumerable: true,
      get: function() {
        return n2[k];
      }
    });
  });
  return a2;
}
var picocolors_browser$1 = { exports: {} };
var x$1 = String;
var create$1 = function() {
  return { isColorSupported: false, reset: x$1, bold: x$1, dim: x$1, italic: x$1, underline: x$1, inverse: x$1, hidden: x$1, strikethrough: x$1, black: x$1, red: x$1, green: x$1, yellow: x$1, blue: x$1, magenta: x$1, cyan: x$1, white: x$1, gray: x$1, bgBlack: x$1, bgRed: x$1, bgGreen: x$1, bgYellow: x$1, bgBlue: x$1, bgMagenta: x$1, bgCyan: x$1, bgWhite: x$1 };
};
picocolors_browser$1.exports = create$1();
picocolors_browser$1.exports.createColors = create$1;
var picocolors_browserExports$1 = picocolors_browser$1.exports;
const __viteBrowserExternal$2 = {};
const __viteBrowserExternal$1$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __viteBrowserExternal$2
}, Symbol.toStringTag, { value: "Module" }));
const require$$2$1 = /* @__PURE__ */ getAugmentedNamespace$1(__viteBrowserExternal$1$1);
let pico$1 = picocolors_browserExports$1;
let terminalHighlight$1$1 = require$$2$1;
let CssSyntaxError$3$1 = class CssSyntaxError extends Error {
  constructor(message, line, column, source, file, plugin22) {
    super(message);
    this.name = "CssSyntaxError";
    this.reason = message;
    if (file) {
      this.file = file;
    }
    if (source) {
      this.source = source;
    }
    if (plugin22) {
      this.plugin = plugin22;
    }
    if (typeof line !== "undefined" && typeof column !== "undefined") {
      if (typeof line === "number") {
        this.line = line;
        this.column = column;
      } else {
        this.line = line.line;
        this.column = line.column;
        this.endLine = column.line;
        this.endColumn = column.column;
      }
    }
    this.setMessage();
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CssSyntaxError);
    }
  }
  setMessage() {
    this.message = this.plugin ? this.plugin + ": " : "";
    this.message += this.file ? this.file : "<css input>";
    if (typeof this.line !== "undefined") {
      this.message += ":" + this.line + ":" + this.column;
    }
    this.message += ": " + this.reason;
  }
  showSourceCode(color) {
    if (!this.source) return "";
    let css = this.source;
    if (color == null) color = pico$1.isColorSupported;
    if (terminalHighlight$1$1) {
      if (color) css = terminalHighlight$1$1(css);
    }
    let lines = css.split(/\r?\n/);
    let start = Math.max(this.line - 3, 0);
    let end = Math.min(this.line + 2, lines.length);
    let maxWidth = String(end).length;
    let mark, aside;
    if (color) {
      let { bold, gray, red } = pico$1.createColors(true);
      mark = (text) => bold(red(text));
      aside = (text) => gray(text);
    } else {
      mark = aside = (str) => str;
    }
    return lines.slice(start, end).map((line, index2) => {
      let number = start + 1 + index2;
      let gutter = " " + (" " + number).slice(-maxWidth) + " | ";
      if (number === this.line) {
        let spacing = aside(gutter.replace(/\d/g, " ")) + line.slice(0, this.column - 1).replace(/[^\t]/g, " ");
        return mark(">") + aside(gutter) + line + "\n " + spacing + mark("^");
      }
      return " " + aside(gutter) + line;
    }).join("\n");
  }
  toString() {
    let code = this.showSourceCode();
    if (code) {
      code = "\n\n" + code + "\n";
    }
    return this.name + ": " + this.message + code;
  }
};
var cssSyntaxError$1 = CssSyntaxError$3$1;
CssSyntaxError$3$1.default = CssSyntaxError$3$1;
var symbols$1 = {};
symbols$1.isClean = Symbol("isClean");
symbols$1.my = Symbol("my");
const DEFAULT_RAW$1 = {
  after: "\n",
  beforeClose: "\n",
  beforeComment: "\n",
  beforeDecl: "\n",
  beforeOpen: " ",
  beforeRule: "\n",
  colon: ": ",
  commentLeft: " ",
  commentRight: " ",
  emptyBody: "",
  indent: "    ",
  semicolon: false
};
function capitalize$1(str) {
  return str[0].toUpperCase() + str.slice(1);
}
let Stringifier$2$1 = class Stringifier {
  constructor(builder) {
    this.builder = builder;
  }
  atrule(node2, semicolon) {
    let name = "@" + node2.name;
    let params = node2.params ? this.rawValue(node2, "params") : "";
    if (typeof node2.raws.afterName !== "undefined") {
      name += node2.raws.afterName;
    } else if (params) {
      name += " ";
    }
    if (node2.nodes) {
      this.block(node2, name + params);
    } else {
      let end = (node2.raws.between || "") + (semicolon ? ";" : "");
      this.builder(name + params + end, node2);
    }
  }
  beforeAfter(node2, detect) {
    let value;
    if (node2.type === "decl") {
      value = this.raw(node2, null, "beforeDecl");
    } else if (node2.type === "comment") {
      value = this.raw(node2, null, "beforeComment");
    } else if (detect === "before") {
      value = this.raw(node2, null, "beforeRule");
    } else {
      value = this.raw(node2, null, "beforeClose");
    }
    let buf = node2.parent;
    let depth = 0;
    while (buf && buf.type !== "root") {
      depth += 1;
      buf = buf.parent;
    }
    if (value.includes("\n")) {
      let indent = this.raw(node2, null, "indent");
      if (indent.length) {
        for (let step = 0; step < depth; step++) value += indent;
      }
    }
    return value;
  }
  block(node2, start) {
    let between = this.raw(node2, "between", "beforeOpen");
    this.builder(start + between + "{", node2, "start");
    let after;
    if (node2.nodes && node2.nodes.length) {
      this.body(node2);
      after = this.raw(node2, "after");
    } else {
      after = this.raw(node2, "after", "emptyBody");
    }
    if (after) this.builder(after);
    this.builder("}", node2, "end");
  }
  body(node2) {
    let last = node2.nodes.length - 1;
    while (last > 0) {
      if (node2.nodes[last].type !== "comment") break;
      last -= 1;
    }
    let semicolon = this.raw(node2, "semicolon");
    for (let i2 = 0; i2 < node2.nodes.length; i2++) {
      let child = node2.nodes[i2];
      let before = this.raw(child, "before");
      if (before) this.builder(before);
      this.stringify(child, last !== i2 || semicolon);
    }
  }
  comment(node2) {
    let left = this.raw(node2, "left", "commentLeft");
    let right = this.raw(node2, "right", "commentRight");
    this.builder("/*" + left + node2.text + right + "*/", node2);
  }
  decl(node2, semicolon) {
    let between = this.raw(node2, "between", "colon");
    let string = node2.prop + between + this.rawValue(node2, "value");
    if (node2.important) {
      string += node2.raws.important || " !important";
    }
    if (semicolon) string += ";";
    this.builder(string, node2);
  }
  document(node2) {
    this.body(node2);
  }
  raw(node2, own, detect) {
    let value;
    if (!detect) detect = own;
    if (own) {
      value = node2.raws[own];
      if (typeof value !== "undefined") return value;
    }
    let parent = node2.parent;
    if (detect === "before") {
      if (!parent || parent.type === "root" && parent.first === node2) {
        return "";
      }
      if (parent && parent.type === "document") {
        return "";
      }
    }
    if (!parent) return DEFAULT_RAW$1[detect];
    let root2 = node2.root();
    if (!root2.rawCache) root2.rawCache = {};
    if (typeof root2.rawCache[detect] !== "undefined") {
      return root2.rawCache[detect];
    }
    if (detect === "before" || detect === "after") {
      return this.beforeAfter(node2, detect);
    } else {
      let method = "raw" + capitalize$1(detect);
      if (this[method]) {
        value = this[method](root2, node2);
      } else {
        root2.walk((i2) => {
          value = i2.raws[own];
          if (typeof value !== "undefined") return false;
        });
      }
    }
    if (typeof value === "undefined") value = DEFAULT_RAW$1[detect];
    root2.rawCache[detect] = value;
    return value;
  }
  rawBeforeClose(root2) {
    let value;
    root2.walk((i2) => {
      if (i2.nodes && i2.nodes.length > 0) {
        if (typeof i2.raws.after !== "undefined") {
          value = i2.raws.after;
          if (value.includes("\n")) {
            value = value.replace(/[^\n]+$/, "");
          }
          return false;
        }
      }
    });
    if (value) value = value.replace(/\S/g, "");
    return value;
  }
  rawBeforeComment(root2, node2) {
    let value;
    root2.walkComments((i2) => {
      if (typeof i2.raws.before !== "undefined") {
        value = i2.raws.before;
        if (value.includes("\n")) {
          value = value.replace(/[^\n]+$/, "");
        }
        return false;
      }
    });
    if (typeof value === "undefined") {
      value = this.raw(node2, null, "beforeDecl");
    } else if (value) {
      value = value.replace(/\S/g, "");
    }
    return value;
  }
  rawBeforeDecl(root2, node2) {
    let value;
    root2.walkDecls((i2) => {
      if (typeof i2.raws.before !== "undefined") {
        value = i2.raws.before;
        if (value.includes("\n")) {
          value = value.replace(/[^\n]+$/, "");
        }
        return false;
      }
    });
    if (typeof value === "undefined") {
      value = this.raw(node2, null, "beforeRule");
    } else if (value) {
      value = value.replace(/\S/g, "");
    }
    return value;
  }
  rawBeforeOpen(root2) {
    let value;
    root2.walk((i2) => {
      if (i2.type !== "decl") {
        value = i2.raws.between;
        if (typeof value !== "undefined") return false;
      }
    });
    return value;
  }
  rawBeforeRule(root2) {
    let value;
    root2.walk((i2) => {
      if (i2.nodes && (i2.parent !== root2 || root2.first !== i2)) {
        if (typeof i2.raws.before !== "undefined") {
          value = i2.raws.before;
          if (value.includes("\n")) {
            value = value.replace(/[^\n]+$/, "");
          }
          return false;
        }
      }
    });
    if (value) value = value.replace(/\S/g, "");
    return value;
  }
  rawColon(root2) {
    let value;
    root2.walkDecls((i2) => {
      if (typeof i2.raws.between !== "undefined") {
        value = i2.raws.between.replace(/[^\s:]/g, "");
        return false;
      }
    });
    return value;
  }
  rawEmptyBody(root2) {
    let value;
    root2.walk((i2) => {
      if (i2.nodes && i2.nodes.length === 0) {
        value = i2.raws.after;
        if (typeof value !== "undefined") return false;
      }
    });
    return value;
  }
  rawIndent(root2) {
    if (root2.raws.indent) return root2.raws.indent;
    let value;
    root2.walk((i2) => {
      let p = i2.parent;
      if (p && p !== root2 && p.parent && p.parent === root2) {
        if (typeof i2.raws.before !== "undefined") {
          let parts = i2.raws.before.split("\n");
          value = parts[parts.length - 1];
          value = value.replace(/\S/g, "");
          return false;
        }
      }
    });
    return value;
  }
  rawSemicolon(root2) {
    let value;
    root2.walk((i2) => {
      if (i2.nodes && i2.nodes.length && i2.last.type === "decl") {
        value = i2.raws.semicolon;
        if (typeof value !== "undefined") return false;
      }
    });
    return value;
  }
  rawValue(node2, prop) {
    let value = node2[prop];
    let raw = node2.raws[prop];
    if (raw && raw.value === value) {
      return raw.raw;
    }
    return value;
  }
  root(node2) {
    this.body(node2);
    if (node2.raws.after) this.builder(node2.raws.after);
  }
  rule(node2) {
    this.block(node2, this.rawValue(node2, "selector"));
    if (node2.raws.ownSemicolon) {
      this.builder(node2.raws.ownSemicolon, node2, "end");
    }
  }
  stringify(node2, semicolon) {
    if (!this[node2.type]) {
      throw new Error(
        "Unknown AST node type " + node2.type + ". Maybe you need to change PostCSS stringifier."
      );
    }
    this[node2.type](node2, semicolon);
  }
};
var stringifier$1 = Stringifier$2$1;
Stringifier$2$1.default = Stringifier$2$1;
let Stringifier$1$1 = stringifier$1;
function stringify$4$1(node2, builder) {
  let str = new Stringifier$1$1(builder);
  str.stringify(node2);
}
var stringify_1$1 = stringify$4$1;
stringify$4$1.default = stringify$4$1;
let { isClean: isClean$2$1, my: my$2$1 } = symbols$1;
let CssSyntaxError$2$1 = cssSyntaxError$1;
let Stringifier2$1 = stringifier$1;
let stringify$3$1 = stringify_1$1;
function cloneNode$1(obj, parent) {
  let cloned = new obj.constructor();
  for (let i2 in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, i2)) {
      continue;
    }
    if (i2 === "proxyCache") continue;
    let value = obj[i2];
    let type = typeof value;
    if (i2 === "parent" && type === "object") {
      if (parent) cloned[i2] = parent;
    } else if (i2 === "source") {
      cloned[i2] = value;
    } else if (Array.isArray(value)) {
      cloned[i2] = value.map((j) => cloneNode$1(j, cloned));
    } else {
      if (type === "object" && value !== null) value = cloneNode$1(value);
      cloned[i2] = value;
    }
  }
  return cloned;
}
let Node$4$1 = class Node2 {
  constructor(defaults = {}) {
    this.raws = {};
    this[isClean$2$1] = false;
    this[my$2$1] = true;
    for (let name in defaults) {
      if (name === "nodes") {
        this.nodes = [];
        for (let node2 of defaults[name]) {
          if (typeof node2.clone === "function") {
            this.append(node2.clone());
          } else {
            this.append(node2);
          }
        }
      } else {
        this[name] = defaults[name];
      }
    }
  }
  addToError(error) {
    error.postcssNode = this;
    if (error.stack && this.source && /\n\s{4}at /.test(error.stack)) {
      let s2 = this.source;
      error.stack = error.stack.replace(
        /\n\s{4}at /,
        `$&${s2.input.from}:${s2.start.line}:${s2.start.column}$&`
      );
    }
    return error;
  }
  after(add) {
    this.parent.insertAfter(this, add);
    return this;
  }
  assign(overrides = {}) {
    for (let name in overrides) {
      this[name] = overrides[name];
    }
    return this;
  }
  before(add) {
    this.parent.insertBefore(this, add);
    return this;
  }
  cleanRaws(keepBetween) {
    delete this.raws.before;
    delete this.raws.after;
    if (!keepBetween) delete this.raws.between;
  }
  clone(overrides = {}) {
    let cloned = cloneNode$1(this);
    for (let name in overrides) {
      cloned[name] = overrides[name];
    }
    return cloned;
  }
  cloneAfter(overrides = {}) {
    let cloned = this.clone(overrides);
    this.parent.insertAfter(this, cloned);
    return cloned;
  }
  cloneBefore(overrides = {}) {
    let cloned = this.clone(overrides);
    this.parent.insertBefore(this, cloned);
    return cloned;
  }
  error(message, opts = {}) {
    if (this.source) {
      let { end, start } = this.rangeBy(opts);
      return this.source.input.error(
        message,
        { column: start.column, line: start.line },
        { column: end.column, line: end.line },
        opts
      );
    }
    return new CssSyntaxError$2$1(message);
  }
  getProxyProcessor() {
    return {
      get(node2, prop) {
        if (prop === "proxyOf") {
          return node2;
        } else if (prop === "root") {
          return () => node2.root().toProxy();
        } else {
          return node2[prop];
        }
      },
      set(node2, prop, value) {
        if (node2[prop] === value) return true;
        node2[prop] = value;
        if (prop === "prop" || prop === "value" || prop === "name" || prop === "params" || prop === "important" || /* c8 ignore next */
        prop === "text") {
          node2.markDirty();
        }
        return true;
      }
    };
  }
  markDirty() {
    if (this[isClean$2$1]) {
      this[isClean$2$1] = false;
      let next = this;
      while (next = next.parent) {
        next[isClean$2$1] = false;
      }
    }
  }
  next() {
    if (!this.parent) return void 0;
    let index2 = this.parent.index(this);
    return this.parent.nodes[index2 + 1];
  }
  positionBy(opts, stringRepresentation) {
    let pos = this.source.start;
    if (opts.index) {
      pos = this.positionInside(opts.index, stringRepresentation);
    } else if (opts.word) {
      stringRepresentation = this.toString();
      let index2 = stringRepresentation.indexOf(opts.word);
      if (index2 !== -1) pos = this.positionInside(index2, stringRepresentation);
    }
    return pos;
  }
  positionInside(index2, stringRepresentation) {
    let string = stringRepresentation || this.toString();
    let column = this.source.start.column;
    let line = this.source.start.line;
    for (let i2 = 0; i2 < index2; i2++) {
      if (string[i2] === "\n") {
        column = 1;
        line += 1;
      } else {
        column += 1;
      }
    }
    return { column, line };
  }
  prev() {
    if (!this.parent) return void 0;
    let index2 = this.parent.index(this);
    return this.parent.nodes[index2 - 1];
  }
  rangeBy(opts) {
    let start = {
      column: this.source.start.column,
      line: this.source.start.line
    };
    let end = this.source.end ? {
      column: this.source.end.column + 1,
      line: this.source.end.line
    } : {
      column: start.column + 1,
      line: start.line
    };
    if (opts.word) {
      let stringRepresentation = this.toString();
      let index2 = stringRepresentation.indexOf(opts.word);
      if (index2 !== -1) {
        start = this.positionInside(index2, stringRepresentation);
        end = this.positionInside(index2 + opts.word.length, stringRepresentation);
      }
    } else {
      if (opts.start) {
        start = {
          column: opts.start.column,
          line: opts.start.line
        };
      } else if (opts.index) {
        start = this.positionInside(opts.index);
      }
      if (opts.end) {
        end = {
          column: opts.end.column,
          line: opts.end.line
        };
      } else if (typeof opts.endIndex === "number") {
        end = this.positionInside(opts.endIndex);
      } else if (opts.index) {
        end = this.positionInside(opts.index + 1);
      }
    }
    if (end.line < start.line || end.line === start.line && end.column <= start.column) {
      end = { column: start.column + 1, line: start.line };
    }
    return { end, start };
  }
  raw(prop, defaultType) {
    let str = new Stringifier2$1();
    return str.raw(this, prop, defaultType);
  }
  remove() {
    if (this.parent) {
      this.parent.removeChild(this);
    }
    this.parent = void 0;
    return this;
  }
  replaceWith(...nodes) {
    if (this.parent) {
      let bookmark = this;
      let foundSelf = false;
      for (let node2 of nodes) {
        if (node2 === this) {
          foundSelf = true;
        } else if (foundSelf) {
          this.parent.insertAfter(bookmark, node2);
          bookmark = node2;
        } else {
          this.parent.insertBefore(bookmark, node2);
        }
      }
      if (!foundSelf) {
        this.remove();
      }
    }
    return this;
  }
  root() {
    let result2 = this;
    while (result2.parent && result2.parent.type !== "document") {
      result2 = result2.parent;
    }
    return result2;
  }
  toJSON(_, inputs) {
    let fixed = {};
    let emitInputs = inputs == null;
    inputs = inputs || /* @__PURE__ */ new Map();
    let inputsNextIndex = 0;
    for (let name in this) {
      if (!Object.prototype.hasOwnProperty.call(this, name)) {
        continue;
      }
      if (name === "parent" || name === "proxyCache") continue;
      let value = this[name];
      if (Array.isArray(value)) {
        fixed[name] = value.map((i2) => {
          if (typeof i2 === "object" && i2.toJSON) {
            return i2.toJSON(null, inputs);
          } else {
            return i2;
          }
        });
      } else if (typeof value === "object" && value.toJSON) {
        fixed[name] = value.toJSON(null, inputs);
      } else if (name === "source") {
        let inputId = inputs.get(value.input);
        if (inputId == null) {
          inputId = inputsNextIndex;
          inputs.set(value.input, inputsNextIndex);
          inputsNextIndex++;
        }
        fixed[name] = {
          end: value.end,
          inputId,
          start: value.start
        };
      } else {
        fixed[name] = value;
      }
    }
    if (emitInputs) {
      fixed.inputs = [...inputs.keys()].map((input2) => input2.toJSON());
    }
    return fixed;
  }
  toProxy() {
    if (!this.proxyCache) {
      this.proxyCache = new Proxy(this, this.getProxyProcessor());
    }
    return this.proxyCache;
  }
  toString(stringifier2 = stringify$3$1) {
    if (stringifier2.stringify) stringifier2 = stringifier2.stringify;
    let result2 = "";
    stringifier2(this, (i2) => {
      result2 += i2;
    });
    return result2;
  }
  warn(result2, text, opts) {
    let data = { node: this };
    for (let i2 in opts) data[i2] = opts[i2];
    return result2.warn(text, data);
  }
  get proxyOf() {
    return this;
  }
};
var node$1 = Node$4$1;
Node$4$1.default = Node$4$1;
let Node$3$1 = node$1;
let Declaration$4$1 = class Declaration extends Node$3$1 {
  constructor(defaults) {
    if (defaults && typeof defaults.value !== "undefined" && typeof defaults.value !== "string") {
      defaults = { ...defaults, value: String(defaults.value) };
    }
    super(defaults);
    this.type = "decl";
  }
  get variable() {
    return this.prop.startsWith("--") || this.prop[0] === "$";
  }
};
var declaration$1 = Declaration$4$1;
Declaration$4$1.default = Declaration$4$1;
let urlAlphabet$1 = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";
let customAlphabet$1 = (alphabet, defaultSize = 21) => {
  return (size = defaultSize) => {
    let id = "";
    let i2 = size;
    while (i2--) {
      id += alphabet[Math.random() * alphabet.length | 0];
    }
    return id;
  };
};
let nanoid$1$1 = (size = 21) => {
  let id = "";
  let i2 = size;
  while (i2--) {
    id += urlAlphabet$1[Math.random() * 64 | 0];
  }
  return id;
};
var nonSecure$1 = { nanoid: nanoid$1$1, customAlphabet: customAlphabet$1 };
let { SourceMapConsumer: SourceMapConsumer$2$1, SourceMapGenerator: SourceMapGenerator$2$1 } = require$$2$1;
let { existsSync: existsSync$1, readFileSync: readFileSync$1 } = require$$2$1;
let { dirname: dirname$1$1, join: join$1 } = require$$2$1;
function fromBase64$1(str) {
  if (Buffer) {
    return Buffer.from(str, "base64").toString();
  } else {
    return window.atob(str);
  }
}
let PreviousMap$2$1 = class PreviousMap {
  constructor(css, opts) {
    if (opts.map === false) return;
    this.loadAnnotation(css);
    this.inline = this.startWith(this.annotation, "data:");
    let prev = opts.map ? opts.map.prev : void 0;
    let text = this.loadMap(opts.from, prev);
    if (!this.mapFile && opts.from) {
      this.mapFile = opts.from;
    }
    if (this.mapFile) this.root = dirname$1$1(this.mapFile);
    if (text) this.text = text;
  }
  consumer() {
    if (!this.consumerCache) {
      this.consumerCache = new SourceMapConsumer$2$1(this.text);
    }
    return this.consumerCache;
  }
  decodeInline(text) {
    let baseCharsetUri = /^data:application\/json;charset=utf-?8;base64,/;
    let baseUri = /^data:application\/json;base64,/;
    let charsetUri = /^data:application\/json;charset=utf-?8,/;
    let uri = /^data:application\/json,/;
    if (charsetUri.test(text) || uri.test(text)) {
      return decodeURIComponent(text.substr(RegExp.lastMatch.length));
    }
    if (baseCharsetUri.test(text) || baseUri.test(text)) {
      return fromBase64$1(text.substr(RegExp.lastMatch.length));
    }
    let encoding = text.match(/data:application\/json;([^,]+),/)[1];
    throw new Error("Unsupported source map encoding " + encoding);
  }
  getAnnotationURL(sourceMapString) {
    return sourceMapString.replace(/^\/\*\s*# sourceMappingURL=/, "").trim();
  }
  isMap(map) {
    if (typeof map !== "object") return false;
    return typeof map.mappings === "string" || typeof map._mappings === "string" || Array.isArray(map.sections);
  }
  loadAnnotation(css) {
    let comments = css.match(/\/\*\s*# sourceMappingURL=/gm);
    if (!comments) return;
    let start = css.lastIndexOf(comments.pop());
    let end = css.indexOf("*/", start);
    if (start > -1 && end > -1) {
      this.annotation = this.getAnnotationURL(css.substring(start, end));
    }
  }
  loadFile(path) {
    this.root = dirname$1$1(path);
    if (existsSync$1(path)) {
      this.mapFile = path;
      return readFileSync$1(path, "utf-8").toString().trim();
    }
  }
  loadMap(file, prev) {
    if (prev === false) return false;
    if (prev) {
      if (typeof prev === "string") {
        return prev;
      } else if (typeof prev === "function") {
        let prevPath = prev(file);
        if (prevPath) {
          let map = this.loadFile(prevPath);
          if (!map) {
            throw new Error(
              "Unable to load previous source map: " + prevPath.toString()
            );
          }
          return map;
        }
      } else if (prev instanceof SourceMapConsumer$2$1) {
        return SourceMapGenerator$2$1.fromSourceMap(prev).toString();
      } else if (prev instanceof SourceMapGenerator$2$1) {
        return prev.toString();
      } else if (this.isMap(prev)) {
        return JSON.stringify(prev);
      } else {
        throw new Error(
          "Unsupported previous source map format: " + prev.toString()
        );
      }
    } else if (this.inline) {
      return this.decodeInline(this.annotation);
    } else if (this.annotation) {
      let map = this.annotation;
      if (file) map = join$1(dirname$1$1(file), map);
      return this.loadFile(map);
    }
  }
  startWith(string, start) {
    if (!string) return false;
    return string.substr(0, start.length) === start;
  }
  withContent() {
    return !!(this.consumer().sourcesContent && this.consumer().sourcesContent.length > 0);
  }
};
var previousMap$1 = PreviousMap$2$1;
PreviousMap$2$1.default = PreviousMap$2$1;
let { SourceMapConsumer: SourceMapConsumer$1$1, SourceMapGenerator: SourceMapGenerator$1$1 } = require$$2$1;
let { fileURLToPath: fileURLToPath$1, pathToFileURL: pathToFileURL$1$1 } = require$$2$1;
let { isAbsolute: isAbsolute$1, resolve: resolve$1$1 } = require$$2$1;
let { nanoid: nanoid$2 } = nonSecure$1;
let terminalHighlight$2 = require$$2$1;
let CssSyntaxError$1$1 = cssSyntaxError$1;
let PreviousMap$1$1 = previousMap$1;
let fromOffsetCache$1 = Symbol("fromOffsetCache");
let sourceMapAvailable$1$1 = Boolean(SourceMapConsumer$1$1 && SourceMapGenerator$1$1);
let pathAvailable$1$1 = Boolean(resolve$1$1 && isAbsolute$1);
let Input$4$1 = class Input {
  constructor(css, opts = {}) {
    if (css === null || typeof css === "undefined" || typeof css === "object" && !css.toString) {
      throw new Error(`PostCSS received ${css} instead of CSS string`);
    }
    this.css = css.toString();
    if (this.css[0] === "\uFEFF" || this.css[0] === "￾") {
      this.hasBOM = true;
      this.css = this.css.slice(1);
    } else {
      this.hasBOM = false;
    }
    if (opts.from) {
      if (!pathAvailable$1$1 || /^\w+:\/\//.test(opts.from) || isAbsolute$1(opts.from)) {
        this.file = opts.from;
      } else {
        this.file = resolve$1$1(opts.from);
      }
    }
    if (pathAvailable$1$1 && sourceMapAvailable$1$1) {
      let map = new PreviousMap$1$1(this.css, opts);
      if (map.text) {
        this.map = map;
        let file = map.consumer().file;
        if (!this.file && file) this.file = this.mapResolve(file);
      }
    }
    if (!this.file) {
      this.id = "<input css " + nanoid$2(6) + ">";
    }
    if (this.map) this.map.file = this.from;
  }
  error(message, line, column, opts = {}) {
    let result2, endLine, endColumn;
    if (line && typeof line === "object") {
      let start = line;
      let end = column;
      if (typeof start.offset === "number") {
        let pos = this.fromOffset(start.offset);
        line = pos.line;
        column = pos.col;
      } else {
        line = start.line;
        column = start.column;
      }
      if (typeof end.offset === "number") {
        let pos = this.fromOffset(end.offset);
        endLine = pos.line;
        endColumn = pos.col;
      } else {
        endLine = end.line;
        endColumn = end.column;
      }
    } else if (!column) {
      let pos = this.fromOffset(line);
      line = pos.line;
      column = pos.col;
    }
    let origin = this.origin(line, column, endLine, endColumn);
    if (origin) {
      result2 = new CssSyntaxError$1$1(
        message,
        origin.endLine === void 0 ? origin.line : { column: origin.column, line: origin.line },
        origin.endLine === void 0 ? origin.column : { column: origin.endColumn, line: origin.endLine },
        origin.source,
        origin.file,
        opts.plugin
      );
    } else {
      result2 = new CssSyntaxError$1$1(
        message,
        endLine === void 0 ? line : { column, line },
        endLine === void 0 ? column : { column: endColumn, line: endLine },
        this.css,
        this.file,
        opts.plugin
      );
    }
    result2.input = { column, endColumn, endLine, line, source: this.css };
    if (this.file) {
      if (pathToFileURL$1$1) {
        result2.input.url = pathToFileURL$1$1(this.file).toString();
      }
      result2.input.file = this.file;
    }
    return result2;
  }
  fromOffset(offset) {
    let lastLine, lineToIndex;
    if (!this[fromOffsetCache$1]) {
      let lines = this.css.split("\n");
      lineToIndex = new Array(lines.length);
      let prevIndex = 0;
      for (let i2 = 0, l2 = lines.length; i2 < l2; i2++) {
        lineToIndex[i2] = prevIndex;
        prevIndex += lines[i2].length + 1;
      }
      this[fromOffsetCache$1] = lineToIndex;
    } else {
      lineToIndex = this[fromOffsetCache$1];
    }
    lastLine = lineToIndex[lineToIndex.length - 1];
    let min = 0;
    if (offset >= lastLine) {
      min = lineToIndex.length - 1;
    } else {
      let max = lineToIndex.length - 2;
      let mid;
      while (min < max) {
        mid = min + (max - min >> 1);
        if (offset < lineToIndex[mid]) {
          max = mid - 1;
        } else if (offset >= lineToIndex[mid + 1]) {
          min = mid + 1;
        } else {
          min = mid;
          break;
        }
      }
    }
    return {
      col: offset - lineToIndex[min] + 1,
      line: min + 1
    };
  }
  mapResolve(file) {
    if (/^\w+:\/\//.test(file)) {
      return file;
    }
    return resolve$1$1(this.map.consumer().sourceRoot || this.map.root || ".", file);
  }
  origin(line, column, endLine, endColumn) {
    if (!this.map) return false;
    let consumer = this.map.consumer();
    let from = consumer.originalPositionFor({ column, line });
    if (!from.source) return false;
    let to;
    if (typeof endLine === "number") {
      to = consumer.originalPositionFor({ column: endColumn, line: endLine });
    }
    let fromUrl;
    if (isAbsolute$1(from.source)) {
      fromUrl = pathToFileURL$1$1(from.source);
    } else {
      fromUrl = new URL(
        from.source,
        this.map.consumer().sourceRoot || pathToFileURL$1$1(this.map.mapFile)
      );
    }
    let result2 = {
      column: from.column,
      endColumn: to && to.column,
      endLine: to && to.line,
      line: from.line,
      url: fromUrl.toString()
    };
    if (fromUrl.protocol === "file:") {
      if (fileURLToPath$1) {
        result2.file = fileURLToPath$1(fromUrl);
      } else {
        throw new Error(`file: protocol is not available in this PostCSS build`);
      }
    }
    let source = consumer.sourceContentFor(from.source);
    if (source) result2.source = source;
    return result2;
  }
  toJSON() {
    let json = {};
    for (let name of ["hasBOM", "css", "file", "id"]) {
      if (this[name] != null) {
        json[name] = this[name];
      }
    }
    if (this.map) {
      json.map = { ...this.map };
      if (json.map.consumerCache) {
        json.map.consumerCache = void 0;
      }
    }
    return json;
  }
  get from() {
    return this.file || this.id;
  }
};
var input$1 = Input$4$1;
Input$4$1.default = Input$4$1;
if (terminalHighlight$2 && terminalHighlight$2.registerInput) {
  terminalHighlight$2.registerInput(Input$4$1);
}
let { SourceMapConsumer: SourceMapConsumer$3, SourceMapGenerator: SourceMapGenerator$3 } = require$$2$1;
let { dirname: dirname$2, relative: relative$1, resolve: resolve$2, sep: sep$1 } = require$$2$1;
let { pathToFileURL: pathToFileURL$2 } = require$$2$1;
let Input$3$1 = input$1;
let sourceMapAvailable$2 = Boolean(SourceMapConsumer$3 && SourceMapGenerator$3);
let pathAvailable$2 = Boolean(dirname$2 && resolve$2 && relative$1 && sep$1);
let MapGenerator$2$1 = class MapGenerator {
  constructor(stringify2, root2, opts, cssString) {
    this.stringify = stringify2;
    this.mapOpts = opts.map || {};
    this.root = root2;
    this.opts = opts;
    this.css = cssString;
    this.originalCSS = cssString;
    this.usesFileUrls = !this.mapOpts.from && this.mapOpts.absolute;
    this.memoizedFileURLs = /* @__PURE__ */ new Map();
    this.memoizedPaths = /* @__PURE__ */ new Map();
    this.memoizedURLs = /* @__PURE__ */ new Map();
  }
  addAnnotation() {
    let content;
    if (this.isInline()) {
      content = "data:application/json;base64," + this.toBase64(this.map.toString());
    } else if (typeof this.mapOpts.annotation === "string") {
      content = this.mapOpts.annotation;
    } else if (typeof this.mapOpts.annotation === "function") {
      content = this.mapOpts.annotation(this.opts.to, this.root);
    } else {
      content = this.outputFile() + ".map";
    }
    let eol = "\n";
    if (this.css.includes("\r\n")) eol = "\r\n";
    this.css += eol + "/*# sourceMappingURL=" + content + " */";
  }
  applyPrevMaps() {
    for (let prev of this.previous()) {
      let from = this.toUrl(this.path(prev.file));
      let root2 = prev.root || dirname$2(prev.file);
      let map;
      if (this.mapOpts.sourcesContent === false) {
        map = new SourceMapConsumer$3(prev.text);
        if (map.sourcesContent) {
          map.sourcesContent = null;
        }
      } else {
        map = prev.consumer();
      }
      this.map.applySourceMap(map, from, this.toUrl(this.path(root2)));
    }
  }
  clearAnnotation() {
    if (this.mapOpts.annotation === false) return;
    if (this.root) {
      let node2;
      for (let i2 = this.root.nodes.length - 1; i2 >= 0; i2--) {
        node2 = this.root.nodes[i2];
        if (node2.type !== "comment") continue;
        if (node2.text.indexOf("# sourceMappingURL=") === 0) {
          this.root.removeChild(i2);
        }
      }
    } else if (this.css) {
      this.css = this.css.replace(/\n*?\/\*#[\S\s]*?\*\/$/gm, "");
    }
  }
  generate() {
    this.clearAnnotation();
    if (pathAvailable$2 && sourceMapAvailable$2 && this.isMap()) {
      return this.generateMap();
    } else {
      let result2 = "";
      this.stringify(this.root, (i2) => {
        result2 += i2;
      });
      return [result2];
    }
  }
  generateMap() {
    if (this.root) {
      this.generateString();
    } else if (this.previous().length === 1) {
      let prev = this.previous()[0].consumer();
      prev.file = this.outputFile();
      this.map = SourceMapGenerator$3.fromSourceMap(prev, {
        ignoreInvalidMapping: true
      });
    } else {
      this.map = new SourceMapGenerator$3({
        file: this.outputFile(),
        ignoreInvalidMapping: true
      });
      this.map.addMapping({
        generated: { column: 0, line: 1 },
        original: { column: 0, line: 1 },
        source: this.opts.from ? this.toUrl(this.path(this.opts.from)) : "<no source>"
      });
    }
    if (this.isSourcesContent()) this.setSourcesContent();
    if (this.root && this.previous().length > 0) this.applyPrevMaps();
    if (this.isAnnotation()) this.addAnnotation();
    if (this.isInline()) {
      return [this.css];
    } else {
      return [this.css, this.map];
    }
  }
  generateString() {
    this.css = "";
    this.map = new SourceMapGenerator$3({
      file: this.outputFile(),
      ignoreInvalidMapping: true
    });
    let line = 1;
    let column = 1;
    let noSource = "<no source>";
    let mapping = {
      generated: { column: 0, line: 0 },
      original: { column: 0, line: 0 },
      source: ""
    };
    let lines, last;
    this.stringify(this.root, (str, node2, type) => {
      this.css += str;
      if (node2 && type !== "end") {
        mapping.generated.line = line;
        mapping.generated.column = column - 1;
        if (node2.source && node2.source.start) {
          mapping.source = this.sourcePath(node2);
          mapping.original.line = node2.source.start.line;
          mapping.original.column = node2.source.start.column - 1;
          this.map.addMapping(mapping);
        } else {
          mapping.source = noSource;
          mapping.original.line = 1;
          mapping.original.column = 0;
          this.map.addMapping(mapping);
        }
      }
      lines = str.match(/\n/g);
      if (lines) {
        line += lines.length;
        last = str.lastIndexOf("\n");
        column = str.length - last;
      } else {
        column += str.length;
      }
      if (node2 && type !== "start") {
        let p = node2.parent || { raws: {} };
        let childless = node2.type === "decl" || node2.type === "atrule" && !node2.nodes;
        if (!childless || node2 !== p.last || p.raws.semicolon) {
          if (node2.source && node2.source.end) {
            mapping.source = this.sourcePath(node2);
            mapping.original.line = node2.source.end.line;
            mapping.original.column = node2.source.end.column - 1;
            mapping.generated.line = line;
            mapping.generated.column = column - 2;
            this.map.addMapping(mapping);
          } else {
            mapping.source = noSource;
            mapping.original.line = 1;
            mapping.original.column = 0;
            mapping.generated.line = line;
            mapping.generated.column = column - 1;
            this.map.addMapping(mapping);
          }
        }
      }
    });
  }
  isAnnotation() {
    if (this.isInline()) {
      return true;
    }
    if (typeof this.mapOpts.annotation !== "undefined") {
      return this.mapOpts.annotation;
    }
    if (this.previous().length) {
      return this.previous().some((i2) => i2.annotation);
    }
    return true;
  }
  isInline() {
    if (typeof this.mapOpts.inline !== "undefined") {
      return this.mapOpts.inline;
    }
    let annotation = this.mapOpts.annotation;
    if (typeof annotation !== "undefined" && annotation !== true) {
      return false;
    }
    if (this.previous().length) {
      return this.previous().some((i2) => i2.inline);
    }
    return true;
  }
  isMap() {
    if (typeof this.opts.map !== "undefined") {
      return !!this.opts.map;
    }
    return this.previous().length > 0;
  }
  isSourcesContent() {
    if (typeof this.mapOpts.sourcesContent !== "undefined") {
      return this.mapOpts.sourcesContent;
    }
    if (this.previous().length) {
      return this.previous().some((i2) => i2.withContent());
    }
    return true;
  }
  outputFile() {
    if (this.opts.to) {
      return this.path(this.opts.to);
    } else if (this.opts.from) {
      return this.path(this.opts.from);
    } else {
      return "to.css";
    }
  }
  path(file) {
    if (this.mapOpts.absolute) return file;
    if (file.charCodeAt(0) === 60) return file;
    if (/^\w+:\/\//.test(file)) return file;
    let cached = this.memoizedPaths.get(file);
    if (cached) return cached;
    let from = this.opts.to ? dirname$2(this.opts.to) : ".";
    if (typeof this.mapOpts.annotation === "string") {
      from = dirname$2(resolve$2(from, this.mapOpts.annotation));
    }
    let path = relative$1(from, file);
    this.memoizedPaths.set(file, path);
    return path;
  }
  previous() {
    if (!this.previousMaps) {
      this.previousMaps = [];
      if (this.root) {
        this.root.walk((node2) => {
          if (node2.source && node2.source.input.map) {
            let map = node2.source.input.map;
            if (!this.previousMaps.includes(map)) {
              this.previousMaps.push(map);
            }
          }
        });
      } else {
        let input2 = new Input$3$1(this.originalCSS, this.opts);
        if (input2.map) this.previousMaps.push(input2.map);
      }
    }
    return this.previousMaps;
  }
  setSourcesContent() {
    let already = {};
    if (this.root) {
      this.root.walk((node2) => {
        if (node2.source) {
          let from = node2.source.input.from;
          if (from && !already[from]) {
            already[from] = true;
            let fromUrl = this.usesFileUrls ? this.toFileUrl(from) : this.toUrl(this.path(from));
            this.map.setSourceContent(fromUrl, node2.source.input.css);
          }
        }
      });
    } else if (this.css) {
      let from = this.opts.from ? this.toUrl(this.path(this.opts.from)) : "<no source>";
      this.map.setSourceContent(from, this.css);
    }
  }
  sourcePath(node2) {
    if (this.mapOpts.from) {
      return this.toUrl(this.mapOpts.from);
    } else if (this.usesFileUrls) {
      return this.toFileUrl(node2.source.input.from);
    } else {
      return this.toUrl(this.path(node2.source.input.from));
    }
  }
  toBase64(str) {
    if (Buffer) {
      return Buffer.from(str).toString("base64");
    } else {
      return window.btoa(unescape(encodeURIComponent(str)));
    }
  }
  toFileUrl(path) {
    let cached = this.memoizedFileURLs.get(path);
    if (cached) return cached;
    if (pathToFileURL$2) {
      let fileURL = pathToFileURL$2(path).toString();
      this.memoizedFileURLs.set(path, fileURL);
      return fileURL;
    } else {
      throw new Error(
        "`map.absolute` option is not available in this PostCSS build"
      );
    }
  }
  toUrl(path) {
    let cached = this.memoizedURLs.get(path);
    if (cached) return cached;
    if (sep$1 === "\\") {
      path = path.replace(/\\/g, "/");
    }
    let url = encodeURI(path).replace(/[#?]/g, encodeURIComponent);
    this.memoizedURLs.set(path, url);
    return url;
  }
};
var mapGenerator$1 = MapGenerator$2$1;
let Node$2$1 = node$1;
let Comment$4$1 = class Comment extends Node$2$1 {
  constructor(defaults) {
    super(defaults);
    this.type = "comment";
  }
};
var comment$1 = Comment$4$1;
Comment$4$1.default = Comment$4$1;
let { isClean: isClean$1$1, my: my$1$1 } = symbols$1;
let Declaration$3$1 = declaration$1;
let Comment$3$1 = comment$1;
let Node$1$1 = node$1;
let parse$4$1, Rule$4$1, AtRule$4$1, Root$6$1;
function cleanSource$1(nodes) {
  return nodes.map((i2) => {
    if (i2.nodes) i2.nodes = cleanSource$1(i2.nodes);
    delete i2.source;
    return i2;
  });
}
function markDirtyUp$1(node2) {
  node2[isClean$1$1] = false;
  if (node2.proxyOf.nodes) {
    for (let i2 of node2.proxyOf.nodes) {
      markDirtyUp$1(i2);
    }
  }
}
let Container$7$1 = class Container extends Node$1$1 {
  append(...children) {
    for (let child of children) {
      let nodes = this.normalize(child, this.last);
      for (let node2 of nodes) this.proxyOf.nodes.push(node2);
    }
    this.markDirty();
    return this;
  }
  cleanRaws(keepBetween) {
    super.cleanRaws(keepBetween);
    if (this.nodes) {
      for (let node2 of this.nodes) node2.cleanRaws(keepBetween);
    }
  }
  each(callback) {
    if (!this.proxyOf.nodes) return void 0;
    let iterator = this.getIterator();
    let index2, result2;
    while (this.indexes[iterator] < this.proxyOf.nodes.length) {
      index2 = this.indexes[iterator];
      result2 = callback(this.proxyOf.nodes[index2], index2);
      if (result2 === false) break;
      this.indexes[iterator] += 1;
    }
    delete this.indexes[iterator];
    return result2;
  }
  every(condition) {
    return this.nodes.every(condition);
  }
  getIterator() {
    if (!this.lastEach) this.lastEach = 0;
    if (!this.indexes) this.indexes = {};
    this.lastEach += 1;
    let iterator = this.lastEach;
    this.indexes[iterator] = 0;
    return iterator;
  }
  getProxyProcessor() {
    return {
      get(node2, prop) {
        if (prop === "proxyOf") {
          return node2;
        } else if (!node2[prop]) {
          return node2[prop];
        } else if (prop === "each" || typeof prop === "string" && prop.startsWith("walk")) {
          return (...args) => {
            return node2[prop](
              ...args.map((i2) => {
                if (typeof i2 === "function") {
                  return (child, index2) => i2(child.toProxy(), index2);
                } else {
                  return i2;
                }
              })
            );
          };
        } else if (prop === "every" || prop === "some") {
          return (cb) => {
            return node2[prop](
              (child, ...other) => cb(child.toProxy(), ...other)
            );
          };
        } else if (prop === "root") {
          return () => node2.root().toProxy();
        } else if (prop === "nodes") {
          return node2.nodes.map((i2) => i2.toProxy());
        } else if (prop === "first" || prop === "last") {
          return node2[prop].toProxy();
        } else {
          return node2[prop];
        }
      },
      set(node2, prop, value) {
        if (node2[prop] === value) return true;
        node2[prop] = value;
        if (prop === "name" || prop === "params" || prop === "selector") {
          node2.markDirty();
        }
        return true;
      }
    };
  }
  index(child) {
    if (typeof child === "number") return child;
    if (child.proxyOf) child = child.proxyOf;
    return this.proxyOf.nodes.indexOf(child);
  }
  insertAfter(exist, add) {
    let existIndex = this.index(exist);
    let nodes = this.normalize(add, this.proxyOf.nodes[existIndex]).reverse();
    existIndex = this.index(exist);
    for (let node2 of nodes) this.proxyOf.nodes.splice(existIndex + 1, 0, node2);
    let index2;
    for (let id in this.indexes) {
      index2 = this.indexes[id];
      if (existIndex < index2) {
        this.indexes[id] = index2 + nodes.length;
      }
    }
    this.markDirty();
    return this;
  }
  insertBefore(exist, add) {
    let existIndex = this.index(exist);
    let type = existIndex === 0 ? "prepend" : false;
    let nodes = this.normalize(add, this.proxyOf.nodes[existIndex], type).reverse();
    existIndex = this.index(exist);
    for (let node2 of nodes) this.proxyOf.nodes.splice(existIndex, 0, node2);
    let index2;
    for (let id in this.indexes) {
      index2 = this.indexes[id];
      if (existIndex <= index2) {
        this.indexes[id] = index2 + nodes.length;
      }
    }
    this.markDirty();
    return this;
  }
  normalize(nodes, sample) {
    if (typeof nodes === "string") {
      nodes = cleanSource$1(parse$4$1(nodes).nodes);
    } else if (typeof nodes === "undefined") {
      nodes = [];
    } else if (Array.isArray(nodes)) {
      nodes = nodes.slice(0);
      for (let i2 of nodes) {
        if (i2.parent) i2.parent.removeChild(i2, "ignore");
      }
    } else if (nodes.type === "root" && this.type !== "document") {
      nodes = nodes.nodes.slice(0);
      for (let i2 of nodes) {
        if (i2.parent) i2.parent.removeChild(i2, "ignore");
      }
    } else if (nodes.type) {
      nodes = [nodes];
    } else if (nodes.prop) {
      if (typeof nodes.value === "undefined") {
        throw new Error("Value field is missed in node creation");
      } else if (typeof nodes.value !== "string") {
        nodes.value = String(nodes.value);
      }
      nodes = [new Declaration$3$1(nodes)];
    } else if (nodes.selector) {
      nodes = [new Rule$4$1(nodes)];
    } else if (nodes.name) {
      nodes = [new AtRule$4$1(nodes)];
    } else if (nodes.text) {
      nodes = [new Comment$3$1(nodes)];
    } else {
      throw new Error("Unknown node type in node creation");
    }
    let processed = nodes.map((i2) => {
      if (!i2[my$1$1]) Container.rebuild(i2);
      i2 = i2.proxyOf;
      if (i2.parent) i2.parent.removeChild(i2);
      if (i2[isClean$1$1]) markDirtyUp$1(i2);
      if (typeof i2.raws.before === "undefined") {
        if (sample && typeof sample.raws.before !== "undefined") {
          i2.raws.before = sample.raws.before.replace(/\S/g, "");
        }
      }
      i2.parent = this.proxyOf;
      return i2;
    });
    return processed;
  }
  prepend(...children) {
    children = children.reverse();
    for (let child of children) {
      let nodes = this.normalize(child, this.first, "prepend").reverse();
      for (let node2 of nodes) this.proxyOf.nodes.unshift(node2);
      for (let id in this.indexes) {
        this.indexes[id] = this.indexes[id] + nodes.length;
      }
    }
    this.markDirty();
    return this;
  }
  push(child) {
    child.parent = this;
    this.proxyOf.nodes.push(child);
    return this;
  }
  removeAll() {
    for (let node2 of this.proxyOf.nodes) node2.parent = void 0;
    this.proxyOf.nodes = [];
    this.markDirty();
    return this;
  }
  removeChild(child) {
    child = this.index(child);
    this.proxyOf.nodes[child].parent = void 0;
    this.proxyOf.nodes.splice(child, 1);
    let index2;
    for (let id in this.indexes) {
      index2 = this.indexes[id];
      if (index2 >= child) {
        this.indexes[id] = index2 - 1;
      }
    }
    this.markDirty();
    return this;
  }
  replaceValues(pattern, opts, callback) {
    if (!callback) {
      callback = opts;
      opts = {};
    }
    this.walkDecls((decl) => {
      if (opts.props && !opts.props.includes(decl.prop)) return;
      if (opts.fast && !decl.value.includes(opts.fast)) return;
      decl.value = decl.value.replace(pattern, callback);
    });
    this.markDirty();
    return this;
  }
  some(condition) {
    return this.nodes.some(condition);
  }
  walk(callback) {
    return this.each((child, i2) => {
      let result2;
      try {
        result2 = callback(child, i2);
      } catch (e2) {
        throw child.addToError(e2);
      }
      if (result2 !== false && child.walk) {
        result2 = child.walk(callback);
      }
      return result2;
    });
  }
  walkAtRules(name, callback) {
    if (!callback) {
      callback = name;
      return this.walk((child, i2) => {
        if (child.type === "atrule") {
          return callback(child, i2);
        }
      });
    }
    if (name instanceof RegExp) {
      return this.walk((child, i2) => {
        if (child.type === "atrule" && name.test(child.name)) {
          return callback(child, i2);
        }
      });
    }
    return this.walk((child, i2) => {
      if (child.type === "atrule" && child.name === name) {
        return callback(child, i2);
      }
    });
  }
  walkComments(callback) {
    return this.walk((child, i2) => {
      if (child.type === "comment") {
        return callback(child, i2);
      }
    });
  }
  walkDecls(prop, callback) {
    if (!callback) {
      callback = prop;
      return this.walk((child, i2) => {
        if (child.type === "decl") {
          return callback(child, i2);
        }
      });
    }
    if (prop instanceof RegExp) {
      return this.walk((child, i2) => {
        if (child.type === "decl" && prop.test(child.prop)) {
          return callback(child, i2);
        }
      });
    }
    return this.walk((child, i2) => {
      if (child.type === "decl" && child.prop === prop) {
        return callback(child, i2);
      }
    });
  }
  walkRules(selector, callback) {
    if (!callback) {
      callback = selector;
      return this.walk((child, i2) => {
        if (child.type === "rule") {
          return callback(child, i2);
        }
      });
    }
    if (selector instanceof RegExp) {
      return this.walk((child, i2) => {
        if (child.type === "rule" && selector.test(child.selector)) {
          return callback(child, i2);
        }
      });
    }
    return this.walk((child, i2) => {
      if (child.type === "rule" && child.selector === selector) {
        return callback(child, i2);
      }
    });
  }
  get first() {
    if (!this.proxyOf.nodes) return void 0;
    return this.proxyOf.nodes[0];
  }
  get last() {
    if (!this.proxyOf.nodes) return void 0;
    return this.proxyOf.nodes[this.proxyOf.nodes.length - 1];
  }
};
Container$7$1.registerParse = (dependant) => {
  parse$4$1 = dependant;
};
Container$7$1.registerRule = (dependant) => {
  Rule$4$1 = dependant;
};
Container$7$1.registerAtRule = (dependant) => {
  AtRule$4$1 = dependant;
};
Container$7$1.registerRoot = (dependant) => {
  Root$6$1 = dependant;
};
var container$1 = Container$7$1;
Container$7$1.default = Container$7$1;
Container$7$1.rebuild = (node2) => {
  if (node2.type === "atrule") {
    Object.setPrototypeOf(node2, AtRule$4$1.prototype);
  } else if (node2.type === "rule") {
    Object.setPrototypeOf(node2, Rule$4$1.prototype);
  } else if (node2.type === "decl") {
    Object.setPrototypeOf(node2, Declaration$3$1.prototype);
  } else if (node2.type === "comment") {
    Object.setPrototypeOf(node2, Comment$3$1.prototype);
  } else if (node2.type === "root") {
    Object.setPrototypeOf(node2, Root$6$1.prototype);
  }
  node2[my$1$1] = true;
  if (node2.nodes) {
    node2.nodes.forEach((child) => {
      Container$7$1.rebuild(child);
    });
  }
};
let Container$6$1 = container$1;
let LazyResult$4$1, Processor$3$1;
let Document$3$1 = class Document2 extends Container$6$1 {
  constructor(defaults) {
    super({ type: "document", ...defaults });
    if (!this.nodes) {
      this.nodes = [];
    }
  }
  toResult(opts = {}) {
    let lazy = new LazyResult$4$1(new Processor$3$1(), this, opts);
    return lazy.stringify();
  }
};
Document$3$1.registerLazyResult = (dependant) => {
  LazyResult$4$1 = dependant;
};
Document$3$1.registerProcessor = (dependant) => {
  Processor$3$1 = dependant;
};
var document$1$1 = Document$3$1;
Document$3$1.default = Document$3$1;
let printed$1 = {};
var warnOnce$2$1 = function warnOnce(message) {
  if (printed$1[message]) return;
  printed$1[message] = true;
  if (typeof console !== "undefined" && console.warn) {
    console.warn(message);
  }
};
let Warning$2$1 = class Warning {
  constructor(text, opts = {}) {
    this.type = "warning";
    this.text = text;
    if (opts.node && opts.node.source) {
      let range = opts.node.rangeBy(opts);
      this.line = range.start.line;
      this.column = range.start.column;
      this.endLine = range.end.line;
      this.endColumn = range.end.column;
    }
    for (let opt in opts) this[opt] = opts[opt];
  }
  toString() {
    if (this.node) {
      return this.node.error(this.text, {
        index: this.index,
        plugin: this.plugin,
        word: this.word
      }).message;
    }
    if (this.plugin) {
      return this.plugin + ": " + this.text;
    }
    return this.text;
  }
};
var warning$1 = Warning$2$1;
Warning$2$1.default = Warning$2$1;
let Warning$1$1 = warning$1;
let Result$3$1 = class Result {
  constructor(processor2, root2, opts) {
    this.processor = processor2;
    this.messages = [];
    this.root = root2;
    this.opts = opts;
    this.css = void 0;
    this.map = void 0;
  }
  toString() {
    return this.css;
  }
  warn(text, opts = {}) {
    if (!opts.plugin) {
      if (this.lastPlugin && this.lastPlugin.postcssPlugin) {
        opts.plugin = this.lastPlugin.postcssPlugin;
      }
    }
    let warning2 = new Warning$1$1(text, opts);
    this.messages.push(warning2);
    return warning2;
  }
  warnings() {
    return this.messages.filter((i2) => i2.type === "warning");
  }
  get content() {
    return this.css;
  }
};
var result$1 = Result$3$1;
Result$3$1.default = Result$3$1;
const SINGLE_QUOTE$1 = "'".charCodeAt(0);
const DOUBLE_QUOTE$1 = '"'.charCodeAt(0);
const BACKSLASH$1 = "\\".charCodeAt(0);
const SLASH$1 = "/".charCodeAt(0);
const NEWLINE$1 = "\n".charCodeAt(0);
const SPACE$1 = " ".charCodeAt(0);
const FEED$1 = "\f".charCodeAt(0);
const TAB$1 = "	".charCodeAt(0);
const CR$1 = "\r".charCodeAt(0);
const OPEN_SQUARE$1 = "[".charCodeAt(0);
const CLOSE_SQUARE$1 = "]".charCodeAt(0);
const OPEN_PARENTHESES$1 = "(".charCodeAt(0);
const CLOSE_PARENTHESES$1 = ")".charCodeAt(0);
const OPEN_CURLY$1 = "{".charCodeAt(0);
const CLOSE_CURLY$1 = "}".charCodeAt(0);
const SEMICOLON$1 = ";".charCodeAt(0);
const ASTERISK$1 = "*".charCodeAt(0);
const COLON$1 = ":".charCodeAt(0);
const AT$1 = "@".charCodeAt(0);
const RE_AT_END$1 = /[\t\n\f\r "#'()/;[\\\]{}]/g;
const RE_WORD_END$1 = /[\t\n\f\r !"#'():;@[\\\]{}]|\/(?=\*)/g;
const RE_BAD_BRACKET$1 = /.[\r\n"'(/\\]/;
const RE_HEX_ESCAPE$1 = /[\da-f]/i;
var tokenize$1 = function tokenizer(input2, options = {}) {
  let css = input2.css.valueOf();
  let ignore = options.ignoreErrors;
  let code, next, quote, content, escape;
  let escaped, escapePos, prev, n2, currentToken;
  let length = css.length;
  let pos = 0;
  let buffer = [];
  let returned = [];
  function position() {
    return pos;
  }
  function unclosed(what) {
    throw input2.error("Unclosed " + what, pos);
  }
  function endOfFile() {
    return returned.length === 0 && pos >= length;
  }
  function nextToken(opts) {
    if (returned.length) return returned.pop();
    if (pos >= length) return;
    let ignoreUnclosed = opts ? opts.ignoreUnclosed : false;
    code = css.charCodeAt(pos);
    switch (code) {
      case NEWLINE$1:
      case SPACE$1:
      case TAB$1:
      case CR$1:
      case FEED$1: {
        next = pos;
        do {
          next += 1;
          code = css.charCodeAt(next);
        } while (code === SPACE$1 || code === NEWLINE$1 || code === TAB$1 || code === CR$1 || code === FEED$1);
        currentToken = ["space", css.slice(pos, next)];
        pos = next - 1;
        break;
      }
      case OPEN_SQUARE$1:
      case CLOSE_SQUARE$1:
      case OPEN_CURLY$1:
      case CLOSE_CURLY$1:
      case COLON$1:
      case SEMICOLON$1:
      case CLOSE_PARENTHESES$1: {
        let controlChar = String.fromCharCode(code);
        currentToken = [controlChar, controlChar, pos];
        break;
      }
      case OPEN_PARENTHESES$1: {
        prev = buffer.length ? buffer.pop()[1] : "";
        n2 = css.charCodeAt(pos + 1);
        if (prev === "url" && n2 !== SINGLE_QUOTE$1 && n2 !== DOUBLE_QUOTE$1 && n2 !== SPACE$1 && n2 !== NEWLINE$1 && n2 !== TAB$1 && n2 !== FEED$1 && n2 !== CR$1) {
          next = pos;
          do {
            escaped = false;
            next = css.indexOf(")", next + 1);
            if (next === -1) {
              if (ignore || ignoreUnclosed) {
                next = pos;
                break;
              } else {
                unclosed("bracket");
              }
            }
            escapePos = next;
            while (css.charCodeAt(escapePos - 1) === BACKSLASH$1) {
              escapePos -= 1;
              escaped = !escaped;
            }
          } while (escaped);
          currentToken = ["brackets", css.slice(pos, next + 1), pos, next];
          pos = next;
        } else {
          next = css.indexOf(")", pos + 1);
          content = css.slice(pos, next + 1);
          if (next === -1 || RE_BAD_BRACKET$1.test(content)) {
            currentToken = ["(", "(", pos];
          } else {
            currentToken = ["brackets", content, pos, next];
            pos = next;
          }
        }
        break;
      }
      case SINGLE_QUOTE$1:
      case DOUBLE_QUOTE$1: {
        quote = code === SINGLE_QUOTE$1 ? "'" : '"';
        next = pos;
        do {
          escaped = false;
          next = css.indexOf(quote, next + 1);
          if (next === -1) {
            if (ignore || ignoreUnclosed) {
              next = pos + 1;
              break;
            } else {
              unclosed("string");
            }
          }
          escapePos = next;
          while (css.charCodeAt(escapePos - 1) === BACKSLASH$1) {
            escapePos -= 1;
            escaped = !escaped;
          }
        } while (escaped);
        currentToken = ["string", css.slice(pos, next + 1), pos, next];
        pos = next;
        break;
      }
      case AT$1: {
        RE_AT_END$1.lastIndex = pos + 1;
        RE_AT_END$1.test(css);
        if (RE_AT_END$1.lastIndex === 0) {
          next = css.length - 1;
        } else {
          next = RE_AT_END$1.lastIndex - 2;
        }
        currentToken = ["at-word", css.slice(pos, next + 1), pos, next];
        pos = next;
        break;
      }
      case BACKSLASH$1: {
        next = pos;
        escape = true;
        while (css.charCodeAt(next + 1) === BACKSLASH$1) {
          next += 1;
          escape = !escape;
        }
        code = css.charCodeAt(next + 1);
        if (escape && code !== SLASH$1 && code !== SPACE$1 && code !== NEWLINE$1 && code !== TAB$1 && code !== CR$1 && code !== FEED$1) {
          next += 1;
          if (RE_HEX_ESCAPE$1.test(css.charAt(next))) {
            while (RE_HEX_ESCAPE$1.test(css.charAt(next + 1))) {
              next += 1;
            }
            if (css.charCodeAt(next + 1) === SPACE$1) {
              next += 1;
            }
          }
        }
        currentToken = ["word", css.slice(pos, next + 1), pos, next];
        pos = next;
        break;
      }
      default: {
        if (code === SLASH$1 && css.charCodeAt(pos + 1) === ASTERISK$1) {
          next = css.indexOf("*/", pos + 2) + 1;
          if (next === 0) {
            if (ignore || ignoreUnclosed) {
              next = css.length;
            } else {
              unclosed("comment");
            }
          }
          currentToken = ["comment", css.slice(pos, next + 1), pos, next];
          pos = next;
        } else {
          RE_WORD_END$1.lastIndex = pos + 1;
          RE_WORD_END$1.test(css);
          if (RE_WORD_END$1.lastIndex === 0) {
            next = css.length - 1;
          } else {
            next = RE_WORD_END$1.lastIndex - 2;
          }
          currentToken = ["word", css.slice(pos, next + 1), pos, next];
          buffer.push(currentToken);
          pos = next;
        }
        break;
      }
    }
    pos++;
    return currentToken;
  }
  function back(token) {
    returned.push(token);
  }
  return {
    back,
    endOfFile,
    nextToken,
    position
  };
};
let Container$5$1 = container$1;
let AtRule$3$1 = class AtRule extends Container$5$1 {
  constructor(defaults) {
    super(defaults);
    this.type = "atrule";
  }
  append(...children) {
    if (!this.proxyOf.nodes) this.nodes = [];
    return super.append(...children);
  }
  prepend(...children) {
    if (!this.proxyOf.nodes) this.nodes = [];
    return super.prepend(...children);
  }
};
var atRule$1 = AtRule$3$1;
AtRule$3$1.default = AtRule$3$1;
Container$5$1.registerAtRule(AtRule$3$1);
let Container$4$1 = container$1;
let LazyResult$3$1, Processor$2$1;
let Root$5$1 = class Root extends Container$4$1 {
  constructor(defaults) {
    super(defaults);
    this.type = "root";
    if (!this.nodes) this.nodes = [];
  }
  normalize(child, sample, type) {
    let nodes = super.normalize(child);
    if (sample) {
      if (type === "prepend") {
        if (this.nodes.length > 1) {
          sample.raws.before = this.nodes[1].raws.before;
        } else {
          delete sample.raws.before;
        }
      } else if (this.first !== sample) {
        for (let node2 of nodes) {
          node2.raws.before = sample.raws.before;
        }
      }
    }
    return nodes;
  }
  removeChild(child, ignore) {
    let index2 = this.index(child);
    if (!ignore && index2 === 0 && this.nodes.length > 1) {
      this.nodes[1].raws.before = this.nodes[index2].raws.before;
    }
    return super.removeChild(child);
  }
  toResult(opts = {}) {
    let lazy = new LazyResult$3$1(new Processor$2$1(), this, opts);
    return lazy.stringify();
  }
};
Root$5$1.registerLazyResult = (dependant) => {
  LazyResult$3$1 = dependant;
};
Root$5$1.registerProcessor = (dependant) => {
  Processor$2$1 = dependant;
};
var root$1 = Root$5$1;
Root$5$1.default = Root$5$1;
Container$4$1.registerRoot(Root$5$1);
let list$2$1 = {
  comma(string) {
    return list$2$1.split(string, [","], true);
  },
  space(string) {
    let spaces = [" ", "\n", "	"];
    return list$2$1.split(string, spaces);
  },
  split(string, separators, last) {
    let array = [];
    let current = "";
    let split = false;
    let func = 0;
    let inQuote = false;
    let prevQuote = "";
    let escape = false;
    for (let letter of string) {
      if (escape) {
        escape = false;
      } else if (letter === "\\") {
        escape = true;
      } else if (inQuote) {
        if (letter === prevQuote) {
          inQuote = false;
        }
      } else if (letter === '"' || letter === "'") {
        inQuote = true;
        prevQuote = letter;
      } else if (letter === "(") {
        func += 1;
      } else if (letter === ")") {
        if (func > 0) func -= 1;
      } else if (func === 0) {
        if (separators.includes(letter)) split = true;
      }
      if (split) {
        if (current !== "") array.push(current.trim());
        current = "";
        split = false;
      } else {
        current += letter;
      }
    }
    if (last || current !== "") array.push(current.trim());
    return array;
  }
};
var list_1$1 = list$2$1;
list$2$1.default = list$2$1;
let Container$3$1 = container$1;
let list$1$1 = list_1$1;
let Rule$3$1 = class Rule extends Container$3$1 {
  constructor(defaults) {
    super(defaults);
    this.type = "rule";
    if (!this.nodes) this.nodes = [];
  }
  get selectors() {
    return list$1$1.comma(this.selector);
  }
  set selectors(values) {
    let match = this.selector ? this.selector.match(/,\s*/) : null;
    let sep2 = match ? match[0] : "," + this.raw("between", "beforeOpen");
    this.selector = values.join(sep2);
  }
};
var rule$1 = Rule$3$1;
Rule$3$1.default = Rule$3$1;
Container$3$1.registerRule(Rule$3$1);
let Declaration$2$1 = declaration$1;
let tokenizer2$1 = tokenize$1;
let Comment$2$1 = comment$1;
let AtRule$2$1 = atRule$1;
let Root$4$1 = root$1;
let Rule$2$1 = rule$1;
const SAFE_COMMENT_NEIGHBOR$1 = {
  empty: true,
  space: true
};
function findLastWithPosition$1(tokens) {
  for (let i2 = tokens.length - 1; i2 >= 0; i2--) {
    let token = tokens[i2];
    let pos = token[3] || token[2];
    if (pos) return pos;
  }
}
let Parser$1$1 = class Parser {
  constructor(input2) {
    this.input = input2;
    this.root = new Root$4$1();
    this.current = this.root;
    this.spaces = "";
    this.semicolon = false;
    this.createTokenizer();
    this.root.source = { input: input2, start: { column: 1, line: 1, offset: 0 } };
  }
  atrule(token) {
    let node2 = new AtRule$2$1();
    node2.name = token[1].slice(1);
    if (node2.name === "") {
      this.unnamedAtrule(node2, token);
    }
    this.init(node2, token[2]);
    let type;
    let prev;
    let shift;
    let last = false;
    let open = false;
    let params = [];
    let brackets = [];
    while (!this.tokenizer.endOfFile()) {
      token = this.tokenizer.nextToken();
      type = token[0];
      if (type === "(" || type === "[") {
        brackets.push(type === "(" ? ")" : "]");
      } else if (type === "{" && brackets.length > 0) {
        brackets.push("}");
      } else if (type === brackets[brackets.length - 1]) {
        brackets.pop();
      }
      if (brackets.length === 0) {
        if (type === ";") {
          node2.source.end = this.getPosition(token[2]);
          node2.source.end.offset++;
          this.semicolon = true;
          break;
        } else if (type === "{") {
          open = true;
          break;
        } else if (type === "}") {
          if (params.length > 0) {
            shift = params.length - 1;
            prev = params[shift];
            while (prev && prev[0] === "space") {
              prev = params[--shift];
            }
            if (prev) {
              node2.source.end = this.getPosition(prev[3] || prev[2]);
              node2.source.end.offset++;
            }
          }
          this.end(token);
          break;
        } else {
          params.push(token);
        }
      } else {
        params.push(token);
      }
      if (this.tokenizer.endOfFile()) {
        last = true;
        break;
      }
    }
    node2.raws.between = this.spacesAndCommentsFromEnd(params);
    if (params.length) {
      node2.raws.afterName = this.spacesAndCommentsFromStart(params);
      this.raw(node2, "params", params);
      if (last) {
        token = params[params.length - 1];
        node2.source.end = this.getPosition(token[3] || token[2]);
        node2.source.end.offset++;
        this.spaces = node2.raws.between;
        node2.raws.between = "";
      }
    } else {
      node2.raws.afterName = "";
      node2.params = "";
    }
    if (open) {
      node2.nodes = [];
      this.current = node2;
    }
  }
  checkMissedSemicolon(tokens) {
    let colon = this.colon(tokens);
    if (colon === false) return;
    let founded = 0;
    let token;
    for (let j = colon - 1; j >= 0; j--) {
      token = tokens[j];
      if (token[0] !== "space") {
        founded += 1;
        if (founded === 2) break;
      }
    }
    throw this.input.error(
      "Missed semicolon",
      token[0] === "word" ? token[3] + 1 : token[2]
    );
  }
  colon(tokens) {
    let brackets = 0;
    let token, type, prev;
    for (let [i2, element] of tokens.entries()) {
      token = element;
      type = token[0];
      if (type === "(") {
        brackets += 1;
      }
      if (type === ")") {
        brackets -= 1;
      }
      if (brackets === 0 && type === ":") {
        if (!prev) {
          this.doubleColon(token);
        } else if (prev[0] === "word" && prev[1] === "progid") {
          continue;
        } else {
          return i2;
        }
      }
      prev = token;
    }
    return false;
  }
  comment(token) {
    let node2 = new Comment$2$1();
    this.init(node2, token[2]);
    node2.source.end = this.getPosition(token[3] || token[2]);
    node2.source.end.offset++;
    let text = token[1].slice(2, -2);
    if (/^\s*$/.test(text)) {
      node2.text = "";
      node2.raws.left = text;
      node2.raws.right = "";
    } else {
      let match = text.match(/^(\s*)([^]*\S)(\s*)$/);
      node2.text = match[2];
      node2.raws.left = match[1];
      node2.raws.right = match[3];
    }
  }
  createTokenizer() {
    this.tokenizer = tokenizer2$1(this.input);
  }
  decl(tokens, customProperty) {
    let node2 = new Declaration$2$1();
    this.init(node2, tokens[0][2]);
    let last = tokens[tokens.length - 1];
    if (last[0] === ";") {
      this.semicolon = true;
      tokens.pop();
    }
    node2.source.end = this.getPosition(
      last[3] || last[2] || findLastWithPosition$1(tokens)
    );
    node2.source.end.offset++;
    while (tokens[0][0] !== "word") {
      if (tokens.length === 1) this.unknownWord(tokens);
      node2.raws.before += tokens.shift()[1];
    }
    node2.source.start = this.getPosition(tokens[0][2]);
    node2.prop = "";
    while (tokens.length) {
      let type = tokens[0][0];
      if (type === ":" || type === "space" || type === "comment") {
        break;
      }
      node2.prop += tokens.shift()[1];
    }
    node2.raws.between = "";
    let token;
    while (tokens.length) {
      token = tokens.shift();
      if (token[0] === ":") {
        node2.raws.between += token[1];
        break;
      } else {
        if (token[0] === "word" && /\w/.test(token[1])) {
          this.unknownWord([token]);
        }
        node2.raws.between += token[1];
      }
    }
    if (node2.prop[0] === "_" || node2.prop[0] === "*") {
      node2.raws.before += node2.prop[0];
      node2.prop = node2.prop.slice(1);
    }
    let firstSpaces = [];
    let next;
    while (tokens.length) {
      next = tokens[0][0];
      if (next !== "space" && next !== "comment") break;
      firstSpaces.push(tokens.shift());
    }
    this.precheckMissedSemicolon(tokens);
    for (let i2 = tokens.length - 1; i2 >= 0; i2--) {
      token = tokens[i2];
      if (token[1].toLowerCase() === "!important") {
        node2.important = true;
        let string = this.stringFrom(tokens, i2);
        string = this.spacesFromEnd(tokens) + string;
        if (string !== " !important") node2.raws.important = string;
        break;
      } else if (token[1].toLowerCase() === "important") {
        let cache = tokens.slice(0);
        let str = "";
        for (let j = i2; j > 0; j--) {
          let type = cache[j][0];
          if (str.trim().indexOf("!") === 0 && type !== "space") {
            break;
          }
          str = cache.pop()[1] + str;
        }
        if (str.trim().indexOf("!") === 0) {
          node2.important = true;
          node2.raws.important = str;
          tokens = cache;
        }
      }
      if (token[0] !== "space" && token[0] !== "comment") {
        break;
      }
    }
    let hasWord = tokens.some((i2) => i2[0] !== "space" && i2[0] !== "comment");
    if (hasWord) {
      node2.raws.between += firstSpaces.map((i2) => i2[1]).join("");
      firstSpaces = [];
    }
    this.raw(node2, "value", firstSpaces.concat(tokens), customProperty);
    if (node2.value.includes(":") && !customProperty) {
      this.checkMissedSemicolon(tokens);
    }
  }
  doubleColon(token) {
    throw this.input.error(
      "Double colon",
      { offset: token[2] },
      { offset: token[2] + token[1].length }
    );
  }
  emptyRule(token) {
    let node2 = new Rule$2$1();
    this.init(node2, token[2]);
    node2.selector = "";
    node2.raws.between = "";
    this.current = node2;
  }
  end(token) {
    if (this.current.nodes && this.current.nodes.length) {
      this.current.raws.semicolon = this.semicolon;
    }
    this.semicolon = false;
    this.current.raws.after = (this.current.raws.after || "") + this.spaces;
    this.spaces = "";
    if (this.current.parent) {
      this.current.source.end = this.getPosition(token[2]);
      this.current.source.end.offset++;
      this.current = this.current.parent;
    } else {
      this.unexpectedClose(token);
    }
  }
  endFile() {
    if (this.current.parent) this.unclosedBlock();
    if (this.current.nodes && this.current.nodes.length) {
      this.current.raws.semicolon = this.semicolon;
    }
    this.current.raws.after = (this.current.raws.after || "") + this.spaces;
    this.root.source.end = this.getPosition(this.tokenizer.position());
  }
  freeSemicolon(token) {
    this.spaces += token[1];
    if (this.current.nodes) {
      let prev = this.current.nodes[this.current.nodes.length - 1];
      if (prev && prev.type === "rule" && !prev.raws.ownSemicolon) {
        prev.raws.ownSemicolon = this.spaces;
        this.spaces = "";
      }
    }
  }
  // Helpers
  getPosition(offset) {
    let pos = this.input.fromOffset(offset);
    return {
      column: pos.col,
      line: pos.line,
      offset
    };
  }
  init(node2, offset) {
    this.current.push(node2);
    node2.source = {
      input: this.input,
      start: this.getPosition(offset)
    };
    node2.raws.before = this.spaces;
    this.spaces = "";
    if (node2.type !== "comment") this.semicolon = false;
  }
  other(start) {
    let end = false;
    let type = null;
    let colon = false;
    let bracket = null;
    let brackets = [];
    let customProperty = start[1].startsWith("--");
    let tokens = [];
    let token = start;
    while (token) {
      type = token[0];
      tokens.push(token);
      if (type === "(" || type === "[") {
        if (!bracket) bracket = token;
        brackets.push(type === "(" ? ")" : "]");
      } else if (customProperty && colon && type === "{") {
        if (!bracket) bracket = token;
        brackets.push("}");
      } else if (brackets.length === 0) {
        if (type === ";") {
          if (colon) {
            this.decl(tokens, customProperty);
            return;
          } else {
            break;
          }
        } else if (type === "{") {
          this.rule(tokens);
          return;
        } else if (type === "}") {
          this.tokenizer.back(tokens.pop());
          end = true;
          break;
        } else if (type === ":") {
          colon = true;
        }
      } else if (type === brackets[brackets.length - 1]) {
        brackets.pop();
        if (brackets.length === 0) bracket = null;
      }
      token = this.tokenizer.nextToken();
    }
    if (this.tokenizer.endOfFile()) end = true;
    if (brackets.length > 0) this.unclosedBracket(bracket);
    if (end && colon) {
      if (!customProperty) {
        while (tokens.length) {
          token = tokens[tokens.length - 1][0];
          if (token !== "space" && token !== "comment") break;
          this.tokenizer.back(tokens.pop());
        }
      }
      this.decl(tokens, customProperty);
    } else {
      this.unknownWord(tokens);
    }
  }
  parse() {
    let token;
    while (!this.tokenizer.endOfFile()) {
      token = this.tokenizer.nextToken();
      switch (token[0]) {
        case "space":
          this.spaces += token[1];
          break;
        case ";":
          this.freeSemicolon(token);
          break;
        case "}":
          this.end(token);
          break;
        case "comment":
          this.comment(token);
          break;
        case "at-word":
          this.atrule(token);
          break;
        case "{":
          this.emptyRule(token);
          break;
        default:
          this.other(token);
          break;
      }
    }
    this.endFile();
  }
  precheckMissedSemicolon() {
  }
  raw(node2, prop, tokens, customProperty) {
    let token, type;
    let length = tokens.length;
    let value = "";
    let clean = true;
    let next, prev;
    for (let i2 = 0; i2 < length; i2 += 1) {
      token = tokens[i2];
      type = token[0];
      if (type === "space" && i2 === length - 1 && !customProperty) {
        clean = false;
      } else if (type === "comment") {
        prev = tokens[i2 - 1] ? tokens[i2 - 1][0] : "empty";
        next = tokens[i2 + 1] ? tokens[i2 + 1][0] : "empty";
        if (!SAFE_COMMENT_NEIGHBOR$1[prev] && !SAFE_COMMENT_NEIGHBOR$1[next]) {
          if (value.slice(-1) === ",") {
            clean = false;
          } else {
            value += token[1];
          }
        } else {
          clean = false;
        }
      } else {
        value += token[1];
      }
    }
    if (!clean) {
      let raw = tokens.reduce((all, i2) => all + i2[1], "");
      node2.raws[prop] = { raw, value };
    }
    node2[prop] = value;
  }
  rule(tokens) {
    tokens.pop();
    let node2 = new Rule$2$1();
    this.init(node2, tokens[0][2]);
    node2.raws.between = this.spacesAndCommentsFromEnd(tokens);
    this.raw(node2, "selector", tokens);
    this.current = node2;
  }
  spacesAndCommentsFromEnd(tokens) {
    let lastTokenType;
    let spaces = "";
    while (tokens.length) {
      lastTokenType = tokens[tokens.length - 1][0];
      if (lastTokenType !== "space" && lastTokenType !== "comment") break;
      spaces = tokens.pop()[1] + spaces;
    }
    return spaces;
  }
  // Errors
  spacesAndCommentsFromStart(tokens) {
    let next;
    let spaces = "";
    while (tokens.length) {
      next = tokens[0][0];
      if (next !== "space" && next !== "comment") break;
      spaces += tokens.shift()[1];
    }
    return spaces;
  }
  spacesFromEnd(tokens) {
    let lastTokenType;
    let spaces = "";
    while (tokens.length) {
      lastTokenType = tokens[tokens.length - 1][0];
      if (lastTokenType !== "space") break;
      spaces = tokens.pop()[1] + spaces;
    }
    return spaces;
  }
  stringFrom(tokens, from) {
    let result2 = "";
    for (let i2 = from; i2 < tokens.length; i2++) {
      result2 += tokens[i2][1];
    }
    tokens.splice(from, tokens.length - from);
    return result2;
  }
  unclosedBlock() {
    let pos = this.current.source.start;
    throw this.input.error("Unclosed block", pos.line, pos.column);
  }
  unclosedBracket(bracket) {
    throw this.input.error(
      "Unclosed bracket",
      { offset: bracket[2] },
      { offset: bracket[2] + 1 }
    );
  }
  unexpectedClose(token) {
    throw this.input.error(
      "Unexpected }",
      { offset: token[2] },
      { offset: token[2] + 1 }
    );
  }
  unknownWord(tokens) {
    throw this.input.error(
      "Unknown word",
      { offset: tokens[0][2] },
      { offset: tokens[0][2] + tokens[0][1].length }
    );
  }
  unnamedAtrule(node2, token) {
    throw this.input.error(
      "At-rule without name",
      { offset: token[2] },
      { offset: token[2] + token[1].length }
    );
  }
};
var parser$1 = Parser$1$1;
let Container$2$1 = container$1;
let Parser2$1 = parser$1;
let Input$2$1 = input$1;
function parse$3$1(css, opts) {
  let input2 = new Input$2$1(css, opts);
  let parser2 = new Parser2$1(input2);
  try {
    parser2.parse();
  } catch (e2) {
    if (process.env.NODE_ENV !== "production") {
      if (e2.name === "CssSyntaxError" && opts && opts.from) {
        if (/\.scss$/i.test(opts.from)) {
          e2.message += "\nYou tried to parse SCSS with the standard CSS parser; try again with the postcss-scss parser";
        } else if (/\.sass/i.test(opts.from)) {
          e2.message += "\nYou tried to parse Sass with the standard CSS parser; try again with the postcss-sass parser";
        } else if (/\.less$/i.test(opts.from)) {
          e2.message += "\nYou tried to parse Less with the standard CSS parser; try again with the postcss-less parser";
        }
      }
    }
    throw e2;
  }
  return parser2.root;
}
var parse_1$1 = parse$3$1;
parse$3$1.default = parse$3$1;
Container$2$1.registerParse(parse$3$1);
let { isClean: isClean$3, my: my$3 } = symbols$1;
let MapGenerator$1$1 = mapGenerator$1;
let stringify$2$1 = stringify_1$1;
let Container$1$1 = container$1;
let Document$2$1 = document$1$1;
let warnOnce$1$1 = warnOnce$2$1;
let Result$2$1 = result$1;
let parse$2$1 = parse_1$1;
let Root$3$1 = root$1;
const TYPE_TO_CLASS_NAME$1 = {
  atrule: "AtRule",
  comment: "Comment",
  decl: "Declaration",
  document: "Document",
  root: "Root",
  rule: "Rule"
};
const PLUGIN_PROPS$1 = {
  AtRule: true,
  AtRuleExit: true,
  Comment: true,
  CommentExit: true,
  Declaration: true,
  DeclarationExit: true,
  Document: true,
  DocumentExit: true,
  Once: true,
  OnceExit: true,
  postcssPlugin: true,
  prepare: true,
  Root: true,
  RootExit: true,
  Rule: true,
  RuleExit: true
};
const NOT_VISITORS$1 = {
  Once: true,
  postcssPlugin: true,
  prepare: true
};
const CHILDREN$1 = 0;
function isPromise$1(obj) {
  return typeof obj === "object" && typeof obj.then === "function";
}
function getEvents$1(node2) {
  let key = false;
  let type = TYPE_TO_CLASS_NAME$1[node2.type];
  if (node2.type === "decl") {
    key = node2.prop.toLowerCase();
  } else if (node2.type === "atrule") {
    key = node2.name.toLowerCase();
  }
  if (key && node2.append) {
    return [
      type,
      type + "-" + key,
      CHILDREN$1,
      type + "Exit",
      type + "Exit-" + key
    ];
  } else if (key) {
    return [type, type + "-" + key, type + "Exit", type + "Exit-" + key];
  } else if (node2.append) {
    return [type, CHILDREN$1, type + "Exit"];
  } else {
    return [type, type + "Exit"];
  }
}
function toStack$1(node2) {
  let events;
  if (node2.type === "document") {
    events = ["Document", CHILDREN$1, "DocumentExit"];
  } else if (node2.type === "root") {
    events = ["Root", CHILDREN$1, "RootExit"];
  } else {
    events = getEvents$1(node2);
  }
  return {
    eventIndex: 0,
    events,
    iterator: 0,
    node: node2,
    visitorIndex: 0,
    visitors: []
  };
}
function cleanMarks$1(node2) {
  node2[isClean$3] = false;
  if (node2.nodes) node2.nodes.forEach((i2) => cleanMarks$1(i2));
  return node2;
}
let postcss$2$1 = {};
let LazyResult$2$1 = class LazyResult {
  constructor(processor2, css, opts) {
    this.stringified = false;
    this.processed = false;
    let root2;
    if (typeof css === "object" && css !== null && (css.type === "root" || css.type === "document")) {
      root2 = cleanMarks$1(css);
    } else if (css instanceof LazyResult || css instanceof Result$2$1) {
      root2 = cleanMarks$1(css.root);
      if (css.map) {
        if (typeof opts.map === "undefined") opts.map = {};
        if (!opts.map.inline) opts.map.inline = false;
        opts.map.prev = css.map;
      }
    } else {
      let parser2 = parse$2$1;
      if (opts.syntax) parser2 = opts.syntax.parse;
      if (opts.parser) parser2 = opts.parser;
      if (parser2.parse) parser2 = parser2.parse;
      try {
        root2 = parser2(css, opts);
      } catch (error) {
        this.processed = true;
        this.error = error;
      }
      if (root2 && !root2[my$3]) {
        Container$1$1.rebuild(root2);
      }
    }
    this.result = new Result$2$1(processor2, root2, opts);
    this.helpers = { ...postcss$2$1, postcss: postcss$2$1, result: this.result };
    this.plugins = this.processor.plugins.map((plugin22) => {
      if (typeof plugin22 === "object" && plugin22.prepare) {
        return { ...plugin22, ...plugin22.prepare(this.result) };
      } else {
        return plugin22;
      }
    });
  }
  async() {
    if (this.error) return Promise.reject(this.error);
    if (this.processed) return Promise.resolve(this.result);
    if (!this.processing) {
      this.processing = this.runAsync();
    }
    return this.processing;
  }
  catch(onRejected) {
    return this.async().catch(onRejected);
  }
  finally(onFinally) {
    return this.async().then(onFinally, onFinally);
  }
  getAsyncError() {
    throw new Error("Use process(css).then(cb) to work with async plugins");
  }
  handleError(error, node2) {
    let plugin22 = this.result.lastPlugin;
    try {
      if (node2) node2.addToError(error);
      this.error = error;
      if (error.name === "CssSyntaxError" && !error.plugin) {
        error.plugin = plugin22.postcssPlugin;
        error.setMessage();
      } else if (plugin22.postcssVersion) {
        if (process.env.NODE_ENV !== "production") {
          let pluginName = plugin22.postcssPlugin;
          let pluginVer = plugin22.postcssVersion;
          let runtimeVer = this.result.processor.version;
          let a2 = pluginVer.split(".");
          let b = runtimeVer.split(".");
          if (a2[0] !== b[0] || parseInt(a2[1]) > parseInt(b[1])) {
            console.error(
              "Unknown error from PostCSS plugin. Your current PostCSS version is " + runtimeVer + ", but " + pluginName + " uses " + pluginVer + ". Perhaps this is the source of the error below."
            );
          }
        }
      }
    } catch (err) {
      if (console && console.error) console.error(err);
    }
    return error;
  }
  prepareVisitors() {
    this.listeners = {};
    let add = (plugin22, type, cb) => {
      if (!this.listeners[type]) this.listeners[type] = [];
      this.listeners[type].push([plugin22, cb]);
    };
    for (let plugin22 of this.plugins) {
      if (typeof plugin22 === "object") {
        for (let event in plugin22) {
          if (!PLUGIN_PROPS$1[event] && /^[A-Z]/.test(event)) {
            throw new Error(
              `Unknown event ${event} in ${plugin22.postcssPlugin}. Try to update PostCSS (${this.processor.version} now).`
            );
          }
          if (!NOT_VISITORS$1[event]) {
            if (typeof plugin22[event] === "object") {
              for (let filter in plugin22[event]) {
                if (filter === "*") {
                  add(plugin22, event, plugin22[event][filter]);
                } else {
                  add(
                    plugin22,
                    event + "-" + filter.toLowerCase(),
                    plugin22[event][filter]
                  );
                }
              }
            } else if (typeof plugin22[event] === "function") {
              add(plugin22, event, plugin22[event]);
            }
          }
        }
      }
    }
    this.hasListener = Object.keys(this.listeners).length > 0;
  }
  async runAsync() {
    this.plugin = 0;
    for (let i2 = 0; i2 < this.plugins.length; i2++) {
      let plugin22 = this.plugins[i2];
      let promise = this.runOnRoot(plugin22);
      if (isPromise$1(promise)) {
        try {
          await promise;
        } catch (error) {
          throw this.handleError(error);
        }
      }
    }
    this.prepareVisitors();
    if (this.hasListener) {
      let root2 = this.result.root;
      while (!root2[isClean$3]) {
        root2[isClean$3] = true;
        let stack = [toStack$1(root2)];
        while (stack.length > 0) {
          let promise = this.visitTick(stack);
          if (isPromise$1(promise)) {
            try {
              await promise;
            } catch (e2) {
              let node2 = stack[stack.length - 1].node;
              throw this.handleError(e2, node2);
            }
          }
        }
      }
      if (this.listeners.OnceExit) {
        for (let [plugin22, visitor] of this.listeners.OnceExit) {
          this.result.lastPlugin = plugin22;
          try {
            if (root2.type === "document") {
              let roots = root2.nodes.map(
                (subRoot) => visitor(subRoot, this.helpers)
              );
              await Promise.all(roots);
            } else {
              await visitor(root2, this.helpers);
            }
          } catch (e2) {
            throw this.handleError(e2);
          }
        }
      }
    }
    this.processed = true;
    return this.stringify();
  }
  runOnRoot(plugin22) {
    this.result.lastPlugin = plugin22;
    try {
      if (typeof plugin22 === "object" && plugin22.Once) {
        if (this.result.root.type === "document") {
          let roots = this.result.root.nodes.map(
            (root2) => plugin22.Once(root2, this.helpers)
          );
          if (isPromise$1(roots[0])) {
            return Promise.all(roots);
          }
          return roots;
        }
        return plugin22.Once(this.result.root, this.helpers);
      } else if (typeof plugin22 === "function") {
        return plugin22(this.result.root, this.result);
      }
    } catch (error) {
      throw this.handleError(error);
    }
  }
  stringify() {
    if (this.error) throw this.error;
    if (this.stringified) return this.result;
    this.stringified = true;
    this.sync();
    let opts = this.result.opts;
    let str = stringify$2$1;
    if (opts.syntax) str = opts.syntax.stringify;
    if (opts.stringifier) str = opts.stringifier;
    if (str.stringify) str = str.stringify;
    let map = new MapGenerator$1$1(str, this.result.root, this.result.opts);
    let data = map.generate();
    this.result.css = data[0];
    this.result.map = data[1];
    return this.result;
  }
  sync() {
    if (this.error) throw this.error;
    if (this.processed) return this.result;
    this.processed = true;
    if (this.processing) {
      throw this.getAsyncError();
    }
    for (let plugin22 of this.plugins) {
      let promise = this.runOnRoot(plugin22);
      if (isPromise$1(promise)) {
        throw this.getAsyncError();
      }
    }
    this.prepareVisitors();
    if (this.hasListener) {
      let root2 = this.result.root;
      while (!root2[isClean$3]) {
        root2[isClean$3] = true;
        this.walkSync(root2);
      }
      if (this.listeners.OnceExit) {
        if (root2.type === "document") {
          for (let subRoot of root2.nodes) {
            this.visitSync(this.listeners.OnceExit, subRoot);
          }
        } else {
          this.visitSync(this.listeners.OnceExit, root2);
        }
      }
    }
    return this.result;
  }
  then(onFulfilled, onRejected) {
    if (process.env.NODE_ENV !== "production") {
      if (!("from" in this.opts)) {
        warnOnce$1$1(
          "Without `from` option PostCSS could generate wrong source map and will not find Browserslist config. Set it to CSS file path or to `undefined` to prevent this warning."
        );
      }
    }
    return this.async().then(onFulfilled, onRejected);
  }
  toString() {
    return this.css;
  }
  visitSync(visitors, node2) {
    for (let [plugin22, visitor] of visitors) {
      this.result.lastPlugin = plugin22;
      let promise;
      try {
        promise = visitor(node2, this.helpers);
      } catch (e2) {
        throw this.handleError(e2, node2.proxyOf);
      }
      if (node2.type !== "root" && node2.type !== "document" && !node2.parent) {
        return true;
      }
      if (isPromise$1(promise)) {
        throw this.getAsyncError();
      }
    }
  }
  visitTick(stack) {
    let visit2 = stack[stack.length - 1];
    let { node: node2, visitors } = visit2;
    if (node2.type !== "root" && node2.type !== "document" && !node2.parent) {
      stack.pop();
      return;
    }
    if (visitors.length > 0 && visit2.visitorIndex < visitors.length) {
      let [plugin22, visitor] = visitors[visit2.visitorIndex];
      visit2.visitorIndex += 1;
      if (visit2.visitorIndex === visitors.length) {
        visit2.visitors = [];
        visit2.visitorIndex = 0;
      }
      this.result.lastPlugin = plugin22;
      try {
        return visitor(node2.toProxy(), this.helpers);
      } catch (e2) {
        throw this.handleError(e2, node2);
      }
    }
    if (visit2.iterator !== 0) {
      let iterator = visit2.iterator;
      let child;
      while (child = node2.nodes[node2.indexes[iterator]]) {
        node2.indexes[iterator] += 1;
        if (!child[isClean$3]) {
          child[isClean$3] = true;
          stack.push(toStack$1(child));
          return;
        }
      }
      visit2.iterator = 0;
      delete node2.indexes[iterator];
    }
    let events = visit2.events;
    while (visit2.eventIndex < events.length) {
      let event = events[visit2.eventIndex];
      visit2.eventIndex += 1;
      if (event === CHILDREN$1) {
        if (node2.nodes && node2.nodes.length) {
          node2[isClean$3] = true;
          visit2.iterator = node2.getIterator();
        }
        return;
      } else if (this.listeners[event]) {
        visit2.visitors = this.listeners[event];
        return;
      }
    }
    stack.pop();
  }
  walkSync(node2) {
    node2[isClean$3] = true;
    let events = getEvents$1(node2);
    for (let event of events) {
      if (event === CHILDREN$1) {
        if (node2.nodes) {
          node2.each((child) => {
            if (!child[isClean$3]) this.walkSync(child);
          });
        }
      } else {
        let visitors = this.listeners[event];
        if (visitors) {
          if (this.visitSync(visitors, node2.toProxy())) return;
        }
      }
    }
  }
  warnings() {
    return this.sync().warnings();
  }
  get content() {
    return this.stringify().content;
  }
  get css() {
    return this.stringify().css;
  }
  get map() {
    return this.stringify().map;
  }
  get messages() {
    return this.sync().messages;
  }
  get opts() {
    return this.result.opts;
  }
  get processor() {
    return this.result.processor;
  }
  get root() {
    return this.sync().root;
  }
  get [Symbol.toStringTag]() {
    return "LazyResult";
  }
};
LazyResult$2$1.registerPostcss = (dependant) => {
  postcss$2$1 = dependant;
};
var lazyResult$1 = LazyResult$2$1;
LazyResult$2$1.default = LazyResult$2$1;
Root$3$1.registerLazyResult(LazyResult$2$1);
Document$2$1.registerLazyResult(LazyResult$2$1);
let MapGenerator2$1 = mapGenerator$1;
let stringify$1$1 = stringify_1$1;
let warnOnce2$1 = warnOnce$2$1;
let parse$1$1 = parse_1$1;
const Result$1$1 = result$1;
let NoWorkResult$1$1 = class NoWorkResult {
  constructor(processor2, css, opts) {
    css = css.toString();
    this.stringified = false;
    this._processor = processor2;
    this._css = css;
    this._opts = opts;
    this._map = void 0;
    let root2;
    let str = stringify$1$1;
    this.result = new Result$1$1(this._processor, root2, this._opts);
    this.result.css = css;
    let self = this;
    Object.defineProperty(this.result, "root", {
      get() {
        return self.root;
      }
    });
    let map = new MapGenerator2$1(str, root2, this._opts, css);
    if (map.isMap()) {
      let [generatedCSS, generatedMap] = map.generate();
      if (generatedCSS) {
        this.result.css = generatedCSS;
      }
      if (generatedMap) {
        this.result.map = generatedMap;
      }
    } else {
      map.clearAnnotation();
      this.result.css = map.css;
    }
  }
  async() {
    if (this.error) return Promise.reject(this.error);
    return Promise.resolve(this.result);
  }
  catch(onRejected) {
    return this.async().catch(onRejected);
  }
  finally(onFinally) {
    return this.async().then(onFinally, onFinally);
  }
  sync() {
    if (this.error) throw this.error;
    return this.result;
  }
  then(onFulfilled, onRejected) {
    if (process.env.NODE_ENV !== "production") {
      if (!("from" in this._opts)) {
        warnOnce2$1(
          "Without `from` option PostCSS could generate wrong source map and will not find Browserslist config. Set it to CSS file path or to `undefined` to prevent this warning."
        );
      }
    }
    return this.async().then(onFulfilled, onRejected);
  }
  toString() {
    return this._css;
  }
  warnings() {
    return [];
  }
  get content() {
    return this.result.css;
  }
  get css() {
    return this.result.css;
  }
  get map() {
    return this.result.map;
  }
  get messages() {
    return [];
  }
  get opts() {
    return this.result.opts;
  }
  get processor() {
    return this.result.processor;
  }
  get root() {
    if (this._root) {
      return this._root;
    }
    let root2;
    let parser2 = parse$1$1;
    try {
      root2 = parser2(this._css, this._opts);
    } catch (error) {
      this.error = error;
    }
    if (this.error) {
      throw this.error;
    } else {
      this._root = root2;
      return root2;
    }
  }
  get [Symbol.toStringTag]() {
    return "NoWorkResult";
  }
};
var noWorkResult$1 = NoWorkResult$1$1;
NoWorkResult$1$1.default = NoWorkResult$1$1;
let NoWorkResult2$1 = noWorkResult$1;
let LazyResult$1$1 = lazyResult$1;
let Document$1$1 = document$1$1;
let Root$2$1 = root$1;
let Processor$1$1 = class Processor {
  constructor(plugins = []) {
    this.version = "8.4.38";
    this.plugins = this.normalize(plugins);
  }
  normalize(plugins) {
    let normalized = [];
    for (let i2 of plugins) {
      if (i2.postcss === true) {
        i2 = i2();
      } else if (i2.postcss) {
        i2 = i2.postcss;
      }
      if (typeof i2 === "object" && Array.isArray(i2.plugins)) {
        normalized = normalized.concat(i2.plugins);
      } else if (typeof i2 === "object" && i2.postcssPlugin) {
        normalized.push(i2);
      } else if (typeof i2 === "function") {
        normalized.push(i2);
      } else if (typeof i2 === "object" && (i2.parse || i2.stringify)) {
        if (process.env.NODE_ENV !== "production") {
          throw new Error(
            "PostCSS syntaxes cannot be used as plugins. Instead, please use one of the syntax/parser/stringifier options as outlined in your PostCSS runner documentation."
          );
        }
      } else {
        throw new Error(i2 + " is not a PostCSS plugin");
      }
    }
    return normalized;
  }
  process(css, opts = {}) {
    if (!this.plugins.length && !opts.parser && !opts.stringifier && !opts.syntax) {
      return new NoWorkResult2$1(this, css, opts);
    } else {
      return new LazyResult$1$1(this, css, opts);
    }
  }
  use(plugin22) {
    this.plugins = this.plugins.concat(this.normalize([plugin22]));
    return this;
  }
};
var processor$1 = Processor$1$1;
Processor$1$1.default = Processor$1$1;
Root$2$1.registerProcessor(Processor$1$1);
Document$1$1.registerProcessor(Processor$1$1);
let Declaration$1$1 = declaration$1;
let PreviousMap2$1 = previousMap$1;
let Comment$1$1 = comment$1;
let AtRule$1$1 = atRule$1;
let Input$1$1 = input$1;
let Root$1$1 = root$1;
let Rule$1$1 = rule$1;
function fromJSON$1$1(json, inputs) {
  if (Array.isArray(json)) return json.map((n2) => fromJSON$1$1(n2));
  let { inputs: ownInputs, ...defaults } = json;
  if (ownInputs) {
    inputs = [];
    for (let input2 of ownInputs) {
      let inputHydrated = { ...input2, __proto__: Input$1$1.prototype };
      if (inputHydrated.map) {
        inputHydrated.map = {
          ...inputHydrated.map,
          __proto__: PreviousMap2$1.prototype
        };
      }
      inputs.push(inputHydrated);
    }
  }
  if (defaults.nodes) {
    defaults.nodes = json.nodes.map((n2) => fromJSON$1$1(n2, inputs));
  }
  if (defaults.source) {
    let { inputId, ...source } = defaults.source;
    defaults.source = source;
    if (inputId != null) {
      defaults.source.input = inputs[inputId];
    }
  }
  if (defaults.type === "root") {
    return new Root$1$1(defaults);
  } else if (defaults.type === "decl") {
    return new Declaration$1$1(defaults);
  } else if (defaults.type === "rule") {
    return new Rule$1$1(defaults);
  } else if (defaults.type === "comment") {
    return new Comment$1$1(defaults);
  } else if (defaults.type === "atrule") {
    return new AtRule$1$1(defaults);
  } else {
    throw new Error("Unknown node type: " + json.type);
  }
}
var fromJSON_1$1 = fromJSON$1$1;
fromJSON$1$1.default = fromJSON$1$1;
let CssSyntaxError2$1 = cssSyntaxError$1;
let Declaration2$1 = declaration$1;
let LazyResult2$1 = lazyResult$1;
let Container2$1 = container$1;
let Processor2$1 = processor$1;
let stringify$5 = stringify_1$1;
let fromJSON$2 = fromJSON_1$1;
let Document22 = document$1$1;
let Warning2$1 = warning$1;
let Comment2$1 = comment$1;
let AtRule2$1 = atRule$1;
let Result2$1 = result$1;
let Input2$1 = input$1;
let parse$5 = parse_1$1;
let list$3 = list_1$1;
let Rule2$1 = rule$1;
let Root2$1 = root$1;
let Node2$1 = node$1;
function postcss$3(...plugins) {
  if (plugins.length === 1 && Array.isArray(plugins[0])) {
    plugins = plugins[0];
  }
  return new Processor2$1(plugins);
}
postcss$3.plugin = function plugin(name, initializer) {
  let warningPrinted = false;
  function creator(...args) {
    if (console && console.warn && !warningPrinted) {
      warningPrinted = true;
      console.warn(
        name + ": postcss.plugin was deprecated. Migration guide:\nhttps://evilmartians.com/chronicles/postcss-8-plugin-migration"
      );
      if (process.env.LANG && process.env.LANG.startsWith("cn")) {
        console.warn(
          name + ": 里面 postcss.plugin 被弃用. 迁移指南:\nhttps://www.w3ctech.com/topic/2226"
        );
      }
    }
    let transformer = initializer(...args);
    transformer.postcssPlugin = name;
    transformer.postcssVersion = new Processor2$1().version;
    return transformer;
  }
  let cache;
  Object.defineProperty(creator, "postcss", {
    get() {
      if (!cache) cache = creator();
      return cache;
    }
  });
  creator.process = function(css, processOpts, pluginOpts) {
    return postcss$3([creator(pluginOpts)]).process(css, processOpts);
  };
  return creator;
};
postcss$3.stringify = stringify$5;
postcss$3.parse = parse$5;
postcss$3.fromJSON = fromJSON$2;
postcss$3.list = list$3;
postcss$3.comment = (defaults) => new Comment2$1(defaults);
postcss$3.atRule = (defaults) => new AtRule2$1(defaults);
postcss$3.decl = (defaults) => new Declaration2$1(defaults);
postcss$3.rule = (defaults) => new Rule2$1(defaults);
postcss$3.root = (defaults) => new Root2$1(defaults);
postcss$3.document = (defaults) => new Document22(defaults);
postcss$3.CssSyntaxError = CssSyntaxError2$1;
postcss$3.Declaration = Declaration2$1;
postcss$3.Container = Container2$1;
postcss$3.Processor = Processor2$1;
postcss$3.Document = Document22;
postcss$3.Comment = Comment2$1;
postcss$3.Warning = Warning2$1;
postcss$3.AtRule = AtRule2$1;
postcss$3.Result = Result2$1;
postcss$3.Input = Input2$1;
postcss$3.Rule = Rule2$1;
postcss$3.Root = Root2$1;
postcss$3.Node = Node2$1;
LazyResult2$1.registerPostcss(postcss$3);
var postcss_1$1 = postcss$3;
postcss$3.default = postcss$3;
const postcss$1$1 = /* @__PURE__ */ getDefaultExportFromCjs$1(postcss_1$1);
postcss$1$1.stringify;
postcss$1$1.fromJSON;
postcss$1$1.plugin;
postcss$1$1.parse;
postcss$1$1.list;
postcss$1$1.document;
postcss$1$1.comment;
postcss$1$1.atRule;
postcss$1$1.rule;
postcss$1$1.decl;
postcss$1$1.root;
postcss$1$1.CssSyntaxError;
postcss$1$1.Declaration;
postcss$1$1.Container;
postcss$1$1.Processor;
postcss$1$1.Document;
postcss$1$1.Comment;
postcss$1$1.Warning;
postcss$1$1.AtRule;
postcss$1$1.Result;
postcss$1$1.Input;
postcss$1$1.Rule;
postcss$1$1.Root;
postcss$1$1.Node;
var __defProp2 = Object.defineProperty;
var __defNormalProp2 = (obj, key, value) => key in obj ? __defProp2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField2 = (obj, key, value) => __defNormalProp2(obj, typeof key !== "symbol" ? key + "" : key, value);
function getDefaultExportFromCjs(x2) {
  return x2 && x2.__esModule && Object.prototype.hasOwnProperty.call(x2, "default") ? x2["default"] : x2;
}
function getAugmentedNamespace(n2) {
  if (n2.__esModule) return n2;
  var f2 = n2.default;
  if (typeof f2 == "function") {
    var a2 = function a22() {
      if (this instanceof a22) {
        return Reflect.construct(f2, arguments, this.constructor);
      }
      return f2.apply(this, arguments);
    };
    a2.prototype = f2.prototype;
  } else a2 = {};
  Object.defineProperty(a2, "__esModule", { value: true });
  Object.keys(n2).forEach(function(k) {
    var d = Object.getOwnPropertyDescriptor(n2, k);
    Object.defineProperty(a2, k, d.get ? d : {
      enumerable: true,
      get: function() {
        return n2[k];
      }
    });
  });
  return a2;
}
var picocolors_browser = { exports: {} };
var x = String;
var create = function() {
  return { isColorSupported: false, reset: x, bold: x, dim: x, italic: x, underline: x, inverse: x, hidden: x, strikethrough: x, black: x, red: x, green: x, yellow: x, blue: x, magenta: x, cyan: x, white: x, gray: x, bgBlack: x, bgRed: x, bgGreen: x, bgYellow: x, bgBlue: x, bgMagenta: x, bgCyan: x, bgWhite: x };
};
picocolors_browser.exports = create();
picocolors_browser.exports.createColors = create;
var picocolors_browserExports = picocolors_browser.exports;
const __viteBrowserExternal = {};
const __viteBrowserExternal$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __viteBrowserExternal
}, Symbol.toStringTag, { value: "Module" }));
const require$$2 = /* @__PURE__ */ getAugmentedNamespace(__viteBrowserExternal$1);
let pico = picocolors_browserExports;
let terminalHighlight$1 = require$$2;
let CssSyntaxError$3 = class CssSyntaxError2 extends Error {
  constructor(message, line, column, source, file, plugin22) {
    super(message);
    this.name = "CssSyntaxError";
    this.reason = message;
    if (file) {
      this.file = file;
    }
    if (source) {
      this.source = source;
    }
    if (plugin22) {
      this.plugin = plugin22;
    }
    if (typeof line !== "undefined" && typeof column !== "undefined") {
      if (typeof line === "number") {
        this.line = line;
        this.column = column;
      } else {
        this.line = line.line;
        this.column = line.column;
        this.endLine = column.line;
        this.endColumn = column.column;
      }
    }
    this.setMessage();
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CssSyntaxError2);
    }
  }
  setMessage() {
    this.message = this.plugin ? this.plugin + ": " : "";
    this.message += this.file ? this.file : "<css input>";
    if (typeof this.line !== "undefined") {
      this.message += ":" + this.line + ":" + this.column;
    }
    this.message += ": " + this.reason;
  }
  showSourceCode(color) {
    if (!this.source) return "";
    let css = this.source;
    if (color == null) color = pico.isColorSupported;
    if (terminalHighlight$1) {
      if (color) css = terminalHighlight$1(css);
    }
    let lines = css.split(/\r?\n/);
    let start = Math.max(this.line - 3, 0);
    let end = Math.min(this.line + 2, lines.length);
    let maxWidth = String(end).length;
    let mark, aside;
    if (color) {
      let { bold, gray, red } = pico.createColors(true);
      mark = (text) => bold(red(text));
      aside = (text) => gray(text);
    } else {
      mark = aside = (str) => str;
    }
    return lines.slice(start, end).map((line, index2) => {
      let number = start + 1 + index2;
      let gutter = " " + (" " + number).slice(-maxWidth) + " | ";
      if (number === this.line) {
        let spacing = aside(gutter.replace(/\d/g, " ")) + line.slice(0, this.column - 1).replace(/[^\t]/g, " ");
        return mark(">") + aside(gutter) + line + "\n " + spacing + mark("^");
      }
      return " " + aside(gutter) + line;
    }).join("\n");
  }
  toString() {
    let code = this.showSourceCode();
    if (code) {
      code = "\n\n" + code + "\n";
    }
    return this.name + ": " + this.message + code;
  }
};
var cssSyntaxError = CssSyntaxError$3;
CssSyntaxError$3.default = CssSyntaxError$3;
var symbols = {};
symbols.isClean = Symbol("isClean");
symbols.my = Symbol("my");
const DEFAULT_RAW = {
  after: "\n",
  beforeClose: "\n",
  beforeComment: "\n",
  beforeDecl: "\n",
  beforeOpen: " ",
  beforeRule: "\n",
  colon: ": ",
  commentLeft: " ",
  commentRight: " ",
  emptyBody: "",
  indent: "    ",
  semicolon: false
};
function capitalize(str) {
  return str[0].toUpperCase() + str.slice(1);
}
let Stringifier$2 = class Stringifier2 {
  constructor(builder) {
    this.builder = builder;
  }
  atrule(node2, semicolon) {
    let name = "@" + node2.name;
    let params = node2.params ? this.rawValue(node2, "params") : "";
    if (typeof node2.raws.afterName !== "undefined") {
      name += node2.raws.afterName;
    } else if (params) {
      name += " ";
    }
    if (node2.nodes) {
      this.block(node2, name + params);
    } else {
      let end = (node2.raws.between || "") + (semicolon ? ";" : "");
      this.builder(name + params + end, node2);
    }
  }
  beforeAfter(node2, detect) {
    let value;
    if (node2.type === "decl") {
      value = this.raw(node2, null, "beforeDecl");
    } else if (node2.type === "comment") {
      value = this.raw(node2, null, "beforeComment");
    } else if (detect === "before") {
      value = this.raw(node2, null, "beforeRule");
    } else {
      value = this.raw(node2, null, "beforeClose");
    }
    let buf = node2.parent;
    let depth = 0;
    while (buf && buf.type !== "root") {
      depth += 1;
      buf = buf.parent;
    }
    if (value.includes("\n")) {
      let indent = this.raw(node2, null, "indent");
      if (indent.length) {
        for (let step = 0; step < depth; step++) value += indent;
      }
    }
    return value;
  }
  block(node2, start) {
    let between = this.raw(node2, "between", "beforeOpen");
    this.builder(start + between + "{", node2, "start");
    let after;
    if (node2.nodes && node2.nodes.length) {
      this.body(node2);
      after = this.raw(node2, "after");
    } else {
      after = this.raw(node2, "after", "emptyBody");
    }
    if (after) this.builder(after);
    this.builder("}", node2, "end");
  }
  body(node2) {
    let last = node2.nodes.length - 1;
    while (last > 0) {
      if (node2.nodes[last].type !== "comment") break;
      last -= 1;
    }
    let semicolon = this.raw(node2, "semicolon");
    for (let i2 = 0; i2 < node2.nodes.length; i2++) {
      let child = node2.nodes[i2];
      let before = this.raw(child, "before");
      if (before) this.builder(before);
      this.stringify(child, last !== i2 || semicolon);
    }
  }
  comment(node2) {
    let left = this.raw(node2, "left", "commentLeft");
    let right = this.raw(node2, "right", "commentRight");
    this.builder("/*" + left + node2.text + right + "*/", node2);
  }
  decl(node2, semicolon) {
    let between = this.raw(node2, "between", "colon");
    let string = node2.prop + between + this.rawValue(node2, "value");
    if (node2.important) {
      string += node2.raws.important || " !important";
    }
    if (semicolon) string += ";";
    this.builder(string, node2);
  }
  document(node2) {
    this.body(node2);
  }
  raw(node2, own, detect) {
    let value;
    if (!detect) detect = own;
    if (own) {
      value = node2.raws[own];
      if (typeof value !== "undefined") return value;
    }
    let parent = node2.parent;
    if (detect === "before") {
      if (!parent || parent.type === "root" && parent.first === node2) {
        return "";
      }
      if (parent && parent.type === "document") {
        return "";
      }
    }
    if (!parent) return DEFAULT_RAW[detect];
    let root2 = node2.root();
    if (!root2.rawCache) root2.rawCache = {};
    if (typeof root2.rawCache[detect] !== "undefined") {
      return root2.rawCache[detect];
    }
    if (detect === "before" || detect === "after") {
      return this.beforeAfter(node2, detect);
    } else {
      let method = "raw" + capitalize(detect);
      if (this[method]) {
        value = this[method](root2, node2);
      } else {
        root2.walk((i2) => {
          value = i2.raws[own];
          if (typeof value !== "undefined") return false;
        });
      }
    }
    if (typeof value === "undefined") value = DEFAULT_RAW[detect];
    root2.rawCache[detect] = value;
    return value;
  }
  rawBeforeClose(root2) {
    let value;
    root2.walk((i2) => {
      if (i2.nodes && i2.nodes.length > 0) {
        if (typeof i2.raws.after !== "undefined") {
          value = i2.raws.after;
          if (value.includes("\n")) {
            value = value.replace(/[^\n]+$/, "");
          }
          return false;
        }
      }
    });
    if (value) value = value.replace(/\S/g, "");
    return value;
  }
  rawBeforeComment(root2, node2) {
    let value;
    root2.walkComments((i2) => {
      if (typeof i2.raws.before !== "undefined") {
        value = i2.raws.before;
        if (value.includes("\n")) {
          value = value.replace(/[^\n]+$/, "");
        }
        return false;
      }
    });
    if (typeof value === "undefined") {
      value = this.raw(node2, null, "beforeDecl");
    } else if (value) {
      value = value.replace(/\S/g, "");
    }
    return value;
  }
  rawBeforeDecl(root2, node2) {
    let value;
    root2.walkDecls((i2) => {
      if (typeof i2.raws.before !== "undefined") {
        value = i2.raws.before;
        if (value.includes("\n")) {
          value = value.replace(/[^\n]+$/, "");
        }
        return false;
      }
    });
    if (typeof value === "undefined") {
      value = this.raw(node2, null, "beforeRule");
    } else if (value) {
      value = value.replace(/\S/g, "");
    }
    return value;
  }
  rawBeforeOpen(root2) {
    let value;
    root2.walk((i2) => {
      if (i2.type !== "decl") {
        value = i2.raws.between;
        if (typeof value !== "undefined") return false;
      }
    });
    return value;
  }
  rawBeforeRule(root2) {
    let value;
    root2.walk((i2) => {
      if (i2.nodes && (i2.parent !== root2 || root2.first !== i2)) {
        if (typeof i2.raws.before !== "undefined") {
          value = i2.raws.before;
          if (value.includes("\n")) {
            value = value.replace(/[^\n]+$/, "");
          }
          return false;
        }
      }
    });
    if (value) value = value.replace(/\S/g, "");
    return value;
  }
  rawColon(root2) {
    let value;
    root2.walkDecls((i2) => {
      if (typeof i2.raws.between !== "undefined") {
        value = i2.raws.between.replace(/[^\s:]/g, "");
        return false;
      }
    });
    return value;
  }
  rawEmptyBody(root2) {
    let value;
    root2.walk((i2) => {
      if (i2.nodes && i2.nodes.length === 0) {
        value = i2.raws.after;
        if (typeof value !== "undefined") return false;
      }
    });
    return value;
  }
  rawIndent(root2) {
    if (root2.raws.indent) return root2.raws.indent;
    let value;
    root2.walk((i2) => {
      let p = i2.parent;
      if (p && p !== root2 && p.parent && p.parent === root2) {
        if (typeof i2.raws.before !== "undefined") {
          let parts = i2.raws.before.split("\n");
          value = parts[parts.length - 1];
          value = value.replace(/\S/g, "");
          return false;
        }
      }
    });
    return value;
  }
  rawSemicolon(root2) {
    let value;
    root2.walk((i2) => {
      if (i2.nodes && i2.nodes.length && i2.last.type === "decl") {
        value = i2.raws.semicolon;
        if (typeof value !== "undefined") return false;
      }
    });
    return value;
  }
  rawValue(node2, prop) {
    let value = node2[prop];
    let raw = node2.raws[prop];
    if (raw && raw.value === value) {
      return raw.raw;
    }
    return value;
  }
  root(node2) {
    this.body(node2);
    if (node2.raws.after) this.builder(node2.raws.after);
  }
  rule(node2) {
    this.block(node2, this.rawValue(node2, "selector"));
    if (node2.raws.ownSemicolon) {
      this.builder(node2.raws.ownSemicolon, node2, "end");
    }
  }
  stringify(node2, semicolon) {
    if (!this[node2.type]) {
      throw new Error(
        "Unknown AST node type " + node2.type + ". Maybe you need to change PostCSS stringifier."
      );
    }
    this[node2.type](node2, semicolon);
  }
};
var stringifier = Stringifier$2;
Stringifier$2.default = Stringifier$2;
let Stringifier$1 = stringifier;
function stringify$4(node2, builder) {
  let str = new Stringifier$1(builder);
  str.stringify(node2);
}
var stringify_1 = stringify$4;
stringify$4.default = stringify$4;
let { isClean: isClean$2, my: my$2 } = symbols;
let CssSyntaxError$2 = cssSyntaxError;
let Stringifier22 = stringifier;
let stringify$3 = stringify_1;
function cloneNode(obj, parent) {
  let cloned = new obj.constructor();
  for (let i2 in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, i2)) {
      continue;
    }
    if (i2 === "proxyCache") continue;
    let value = obj[i2];
    let type = typeof value;
    if (i2 === "parent" && type === "object") {
      if (parent) cloned[i2] = parent;
    } else if (i2 === "source") {
      cloned[i2] = value;
    } else if (Array.isArray(value)) {
      cloned[i2] = value.map((j) => cloneNode(j, cloned));
    } else {
      if (type === "object" && value !== null) value = cloneNode(value);
      cloned[i2] = value;
    }
  }
  return cloned;
}
let Node$4 = class Node3 {
  constructor(defaults = {}) {
    this.raws = {};
    this[isClean$2] = false;
    this[my$2] = true;
    for (let name in defaults) {
      if (name === "nodes") {
        this.nodes = [];
        for (let node2 of defaults[name]) {
          if (typeof node2.clone === "function") {
            this.append(node2.clone());
          } else {
            this.append(node2);
          }
        }
      } else {
        this[name] = defaults[name];
      }
    }
  }
  addToError(error) {
    error.postcssNode = this;
    if (error.stack && this.source && /\n\s{4}at /.test(error.stack)) {
      let s2 = this.source;
      error.stack = error.stack.replace(
        /\n\s{4}at /,
        `$&${s2.input.from}:${s2.start.line}:${s2.start.column}$&`
      );
    }
    return error;
  }
  after(add) {
    this.parent.insertAfter(this, add);
    return this;
  }
  assign(overrides = {}) {
    for (let name in overrides) {
      this[name] = overrides[name];
    }
    return this;
  }
  before(add) {
    this.parent.insertBefore(this, add);
    return this;
  }
  cleanRaws(keepBetween) {
    delete this.raws.before;
    delete this.raws.after;
    if (!keepBetween) delete this.raws.between;
  }
  clone(overrides = {}) {
    let cloned = cloneNode(this);
    for (let name in overrides) {
      cloned[name] = overrides[name];
    }
    return cloned;
  }
  cloneAfter(overrides = {}) {
    let cloned = this.clone(overrides);
    this.parent.insertAfter(this, cloned);
    return cloned;
  }
  cloneBefore(overrides = {}) {
    let cloned = this.clone(overrides);
    this.parent.insertBefore(this, cloned);
    return cloned;
  }
  error(message, opts = {}) {
    if (this.source) {
      let { end, start } = this.rangeBy(opts);
      return this.source.input.error(
        message,
        { column: start.column, line: start.line },
        { column: end.column, line: end.line },
        opts
      );
    }
    return new CssSyntaxError$2(message);
  }
  getProxyProcessor() {
    return {
      get(node2, prop) {
        if (prop === "proxyOf") {
          return node2;
        } else if (prop === "root") {
          return () => node2.root().toProxy();
        } else {
          return node2[prop];
        }
      },
      set(node2, prop, value) {
        if (node2[prop] === value) return true;
        node2[prop] = value;
        if (prop === "prop" || prop === "value" || prop === "name" || prop === "params" || prop === "important" || /* c8 ignore next */
        prop === "text") {
          node2.markDirty();
        }
        return true;
      }
    };
  }
  markDirty() {
    if (this[isClean$2]) {
      this[isClean$2] = false;
      let next = this;
      while (next = next.parent) {
        next[isClean$2] = false;
      }
    }
  }
  next() {
    if (!this.parent) return void 0;
    let index2 = this.parent.index(this);
    return this.parent.nodes[index2 + 1];
  }
  positionBy(opts, stringRepresentation) {
    let pos = this.source.start;
    if (opts.index) {
      pos = this.positionInside(opts.index, stringRepresentation);
    } else if (opts.word) {
      stringRepresentation = this.toString();
      let index2 = stringRepresentation.indexOf(opts.word);
      if (index2 !== -1) pos = this.positionInside(index2, stringRepresentation);
    }
    return pos;
  }
  positionInside(index2, stringRepresentation) {
    let string = stringRepresentation || this.toString();
    let column = this.source.start.column;
    let line = this.source.start.line;
    for (let i2 = 0; i2 < index2; i2++) {
      if (string[i2] === "\n") {
        column = 1;
        line += 1;
      } else {
        column += 1;
      }
    }
    return { column, line };
  }
  prev() {
    if (!this.parent) return void 0;
    let index2 = this.parent.index(this);
    return this.parent.nodes[index2 - 1];
  }
  rangeBy(opts) {
    let start = {
      column: this.source.start.column,
      line: this.source.start.line
    };
    let end = this.source.end ? {
      column: this.source.end.column + 1,
      line: this.source.end.line
    } : {
      column: start.column + 1,
      line: start.line
    };
    if (opts.word) {
      let stringRepresentation = this.toString();
      let index2 = stringRepresentation.indexOf(opts.word);
      if (index2 !== -1) {
        start = this.positionInside(index2, stringRepresentation);
        end = this.positionInside(index2 + opts.word.length, stringRepresentation);
      }
    } else {
      if (opts.start) {
        start = {
          column: opts.start.column,
          line: opts.start.line
        };
      } else if (opts.index) {
        start = this.positionInside(opts.index);
      }
      if (opts.end) {
        end = {
          column: opts.end.column,
          line: opts.end.line
        };
      } else if (typeof opts.endIndex === "number") {
        end = this.positionInside(opts.endIndex);
      } else if (opts.index) {
        end = this.positionInside(opts.index + 1);
      }
    }
    if (end.line < start.line || end.line === start.line && end.column <= start.column) {
      end = { column: start.column + 1, line: start.line };
    }
    return { end, start };
  }
  raw(prop, defaultType) {
    let str = new Stringifier22();
    return str.raw(this, prop, defaultType);
  }
  remove() {
    if (this.parent) {
      this.parent.removeChild(this);
    }
    this.parent = void 0;
    return this;
  }
  replaceWith(...nodes) {
    if (this.parent) {
      let bookmark = this;
      let foundSelf = false;
      for (let node2 of nodes) {
        if (node2 === this) {
          foundSelf = true;
        } else if (foundSelf) {
          this.parent.insertAfter(bookmark, node2);
          bookmark = node2;
        } else {
          this.parent.insertBefore(bookmark, node2);
        }
      }
      if (!foundSelf) {
        this.remove();
      }
    }
    return this;
  }
  root() {
    let result2 = this;
    while (result2.parent && result2.parent.type !== "document") {
      result2 = result2.parent;
    }
    return result2;
  }
  toJSON(_, inputs) {
    let fixed = {};
    let emitInputs = inputs == null;
    inputs = inputs || /* @__PURE__ */ new Map();
    let inputsNextIndex = 0;
    for (let name in this) {
      if (!Object.prototype.hasOwnProperty.call(this, name)) {
        continue;
      }
      if (name === "parent" || name === "proxyCache") continue;
      let value = this[name];
      if (Array.isArray(value)) {
        fixed[name] = value.map((i2) => {
          if (typeof i2 === "object" && i2.toJSON) {
            return i2.toJSON(null, inputs);
          } else {
            return i2;
          }
        });
      } else if (typeof value === "object" && value.toJSON) {
        fixed[name] = value.toJSON(null, inputs);
      } else if (name === "source") {
        let inputId = inputs.get(value.input);
        if (inputId == null) {
          inputId = inputsNextIndex;
          inputs.set(value.input, inputsNextIndex);
          inputsNextIndex++;
        }
        fixed[name] = {
          end: value.end,
          inputId,
          start: value.start
        };
      } else {
        fixed[name] = value;
      }
    }
    if (emitInputs) {
      fixed.inputs = [...inputs.keys()].map((input2) => input2.toJSON());
    }
    return fixed;
  }
  toProxy() {
    if (!this.proxyCache) {
      this.proxyCache = new Proxy(this, this.getProxyProcessor());
    }
    return this.proxyCache;
  }
  toString(stringifier2 = stringify$3) {
    if (stringifier2.stringify) stringifier2 = stringifier2.stringify;
    let result2 = "";
    stringifier2(this, (i2) => {
      result2 += i2;
    });
    return result2;
  }
  warn(result2, text, opts) {
    let data = { node: this };
    for (let i2 in opts) data[i2] = opts[i2];
    return result2.warn(text, data);
  }
  get proxyOf() {
    return this;
  }
};
var node = Node$4;
Node$4.default = Node$4;
let Node$3 = node;
let Declaration$4 = class Declaration2 extends Node$3 {
  constructor(defaults) {
    if (defaults && typeof defaults.value !== "undefined" && typeof defaults.value !== "string") {
      defaults = { ...defaults, value: String(defaults.value) };
    }
    super(defaults);
    this.type = "decl";
  }
  get variable() {
    return this.prop.startsWith("--") || this.prop[0] === "$";
  }
};
var declaration = Declaration$4;
Declaration$4.default = Declaration$4;
let urlAlphabet = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";
let customAlphabet = (alphabet, defaultSize = 21) => {
  return (size = defaultSize) => {
    let id = "";
    let i2 = size;
    while (i2--) {
      id += alphabet[Math.random() * alphabet.length | 0];
    }
    return id;
  };
};
let nanoid$1 = (size = 21) => {
  let id = "";
  let i2 = size;
  while (i2--) {
    id += urlAlphabet[Math.random() * 64 | 0];
  }
  return id;
};
var nonSecure = { nanoid: nanoid$1, customAlphabet };
let { SourceMapConsumer: SourceMapConsumer$2, SourceMapGenerator: SourceMapGenerator$2 } = require$$2;
let { existsSync, readFileSync } = require$$2;
let { dirname: dirname$1, join } = require$$2;
function fromBase64(str) {
  if (Buffer) {
    return Buffer.from(str, "base64").toString();
  } else {
    return window.atob(str);
  }
}
let PreviousMap$2 = class PreviousMap2 {
  constructor(css, opts) {
    if (opts.map === false) return;
    this.loadAnnotation(css);
    this.inline = this.startWith(this.annotation, "data:");
    let prev = opts.map ? opts.map.prev : void 0;
    let text = this.loadMap(opts.from, prev);
    if (!this.mapFile && opts.from) {
      this.mapFile = opts.from;
    }
    if (this.mapFile) this.root = dirname$1(this.mapFile);
    if (text) this.text = text;
  }
  consumer() {
    if (!this.consumerCache) {
      this.consumerCache = new SourceMapConsumer$2(this.text);
    }
    return this.consumerCache;
  }
  decodeInline(text) {
    let baseCharsetUri = /^data:application\/json;charset=utf-?8;base64,/;
    let baseUri = /^data:application\/json;base64,/;
    let charsetUri = /^data:application\/json;charset=utf-?8,/;
    let uri = /^data:application\/json,/;
    if (charsetUri.test(text) || uri.test(text)) {
      return decodeURIComponent(text.substr(RegExp.lastMatch.length));
    }
    if (baseCharsetUri.test(text) || baseUri.test(text)) {
      return fromBase64(text.substr(RegExp.lastMatch.length));
    }
    let encoding = text.match(/data:application\/json;([^,]+),/)[1];
    throw new Error("Unsupported source map encoding " + encoding);
  }
  getAnnotationURL(sourceMapString) {
    return sourceMapString.replace(/^\/\*\s*# sourceMappingURL=/, "").trim();
  }
  isMap(map) {
    if (typeof map !== "object") return false;
    return typeof map.mappings === "string" || typeof map._mappings === "string" || Array.isArray(map.sections);
  }
  loadAnnotation(css) {
    let comments = css.match(/\/\*\s*# sourceMappingURL=/gm);
    if (!comments) return;
    let start = css.lastIndexOf(comments.pop());
    let end = css.indexOf("*/", start);
    if (start > -1 && end > -1) {
      this.annotation = this.getAnnotationURL(css.substring(start, end));
    }
  }
  loadFile(path) {
    this.root = dirname$1(path);
    if (existsSync(path)) {
      this.mapFile = path;
      return readFileSync(path, "utf-8").toString().trim();
    }
  }
  loadMap(file, prev) {
    if (prev === false) return false;
    if (prev) {
      if (typeof prev === "string") {
        return prev;
      } else if (typeof prev === "function") {
        let prevPath = prev(file);
        if (prevPath) {
          let map = this.loadFile(prevPath);
          if (!map) {
            throw new Error(
              "Unable to load previous source map: " + prevPath.toString()
            );
          }
          return map;
        }
      } else if (prev instanceof SourceMapConsumer$2) {
        return SourceMapGenerator$2.fromSourceMap(prev).toString();
      } else if (prev instanceof SourceMapGenerator$2) {
        return prev.toString();
      } else if (this.isMap(prev)) {
        return JSON.stringify(prev);
      } else {
        throw new Error(
          "Unsupported previous source map format: " + prev.toString()
        );
      }
    } else if (this.inline) {
      return this.decodeInline(this.annotation);
    } else if (this.annotation) {
      let map = this.annotation;
      if (file) map = join(dirname$1(file), map);
      return this.loadFile(map);
    }
  }
  startWith(string, start) {
    if (!string) return false;
    return string.substr(0, start.length) === start;
  }
  withContent() {
    return !!(this.consumer().sourcesContent && this.consumer().sourcesContent.length > 0);
  }
};
var previousMap = PreviousMap$2;
PreviousMap$2.default = PreviousMap$2;
let { SourceMapConsumer: SourceMapConsumer$1, SourceMapGenerator: SourceMapGenerator$1 } = require$$2;
let { fileURLToPath, pathToFileURL: pathToFileURL$1 } = require$$2;
let { isAbsolute, resolve: resolve$1 } = require$$2;
let { nanoid } = nonSecure;
let terminalHighlight = require$$2;
let CssSyntaxError$1 = cssSyntaxError;
let PreviousMap$1 = previousMap;
let fromOffsetCache = Symbol("fromOffsetCache");
let sourceMapAvailable$1 = Boolean(SourceMapConsumer$1 && SourceMapGenerator$1);
let pathAvailable$1 = Boolean(resolve$1 && isAbsolute);
let Input$4 = class Input2 {
  constructor(css, opts = {}) {
    if (css === null || typeof css === "undefined" || typeof css === "object" && !css.toString) {
      throw new Error(`PostCSS received ${css} instead of CSS string`);
    }
    this.css = css.toString();
    if (this.css[0] === "\uFEFF" || this.css[0] === "￾") {
      this.hasBOM = true;
      this.css = this.css.slice(1);
    } else {
      this.hasBOM = false;
    }
    if (opts.from) {
      if (!pathAvailable$1 || /^\w+:\/\//.test(opts.from) || isAbsolute(opts.from)) {
        this.file = opts.from;
      } else {
        this.file = resolve$1(opts.from);
      }
    }
    if (pathAvailable$1 && sourceMapAvailable$1) {
      let map = new PreviousMap$1(this.css, opts);
      if (map.text) {
        this.map = map;
        let file = map.consumer().file;
        if (!this.file && file) this.file = this.mapResolve(file);
      }
    }
    if (!this.file) {
      this.id = "<input css " + nanoid(6) + ">";
    }
    if (this.map) this.map.file = this.from;
  }
  error(message, line, column, opts = {}) {
    let result2, endLine, endColumn;
    if (line && typeof line === "object") {
      let start = line;
      let end = column;
      if (typeof start.offset === "number") {
        let pos = this.fromOffset(start.offset);
        line = pos.line;
        column = pos.col;
      } else {
        line = start.line;
        column = start.column;
      }
      if (typeof end.offset === "number") {
        let pos = this.fromOffset(end.offset);
        endLine = pos.line;
        endColumn = pos.col;
      } else {
        endLine = end.line;
        endColumn = end.column;
      }
    } else if (!column) {
      let pos = this.fromOffset(line);
      line = pos.line;
      column = pos.col;
    }
    let origin = this.origin(line, column, endLine, endColumn);
    if (origin) {
      result2 = new CssSyntaxError$1(
        message,
        origin.endLine === void 0 ? origin.line : { column: origin.column, line: origin.line },
        origin.endLine === void 0 ? origin.column : { column: origin.endColumn, line: origin.endLine },
        origin.source,
        origin.file,
        opts.plugin
      );
    } else {
      result2 = new CssSyntaxError$1(
        message,
        endLine === void 0 ? line : { column, line },
        endLine === void 0 ? column : { column: endColumn, line: endLine },
        this.css,
        this.file,
        opts.plugin
      );
    }
    result2.input = { column, endColumn, endLine, line, source: this.css };
    if (this.file) {
      if (pathToFileURL$1) {
        result2.input.url = pathToFileURL$1(this.file).toString();
      }
      result2.input.file = this.file;
    }
    return result2;
  }
  fromOffset(offset) {
    let lastLine, lineToIndex;
    if (!this[fromOffsetCache]) {
      let lines = this.css.split("\n");
      lineToIndex = new Array(lines.length);
      let prevIndex = 0;
      for (let i2 = 0, l2 = lines.length; i2 < l2; i2++) {
        lineToIndex[i2] = prevIndex;
        prevIndex += lines[i2].length + 1;
      }
      this[fromOffsetCache] = lineToIndex;
    } else {
      lineToIndex = this[fromOffsetCache];
    }
    lastLine = lineToIndex[lineToIndex.length - 1];
    let min = 0;
    if (offset >= lastLine) {
      min = lineToIndex.length - 1;
    } else {
      let max = lineToIndex.length - 2;
      let mid;
      while (min < max) {
        mid = min + (max - min >> 1);
        if (offset < lineToIndex[mid]) {
          max = mid - 1;
        } else if (offset >= lineToIndex[mid + 1]) {
          min = mid + 1;
        } else {
          min = mid;
          break;
        }
      }
    }
    return {
      col: offset - lineToIndex[min] + 1,
      line: min + 1
    };
  }
  mapResolve(file) {
    if (/^\w+:\/\//.test(file)) {
      return file;
    }
    return resolve$1(this.map.consumer().sourceRoot || this.map.root || ".", file);
  }
  origin(line, column, endLine, endColumn) {
    if (!this.map) return false;
    let consumer = this.map.consumer();
    let from = consumer.originalPositionFor({ column, line });
    if (!from.source) return false;
    let to;
    if (typeof endLine === "number") {
      to = consumer.originalPositionFor({ column: endColumn, line: endLine });
    }
    let fromUrl;
    if (isAbsolute(from.source)) {
      fromUrl = pathToFileURL$1(from.source);
    } else {
      fromUrl = new URL(
        from.source,
        this.map.consumer().sourceRoot || pathToFileURL$1(this.map.mapFile)
      );
    }
    let result2 = {
      column: from.column,
      endColumn: to && to.column,
      endLine: to && to.line,
      line: from.line,
      url: fromUrl.toString()
    };
    if (fromUrl.protocol === "file:") {
      if (fileURLToPath) {
        result2.file = fileURLToPath(fromUrl);
      } else {
        throw new Error(`file: protocol is not available in this PostCSS build`);
      }
    }
    let source = consumer.sourceContentFor(from.source);
    if (source) result2.source = source;
    return result2;
  }
  toJSON() {
    let json = {};
    for (let name of ["hasBOM", "css", "file", "id"]) {
      if (this[name] != null) {
        json[name] = this[name];
      }
    }
    if (this.map) {
      json.map = { ...this.map };
      if (json.map.consumerCache) {
        json.map.consumerCache = void 0;
      }
    }
    return json;
  }
  get from() {
    return this.file || this.id;
  }
};
var input = Input$4;
Input$4.default = Input$4;
if (terminalHighlight && terminalHighlight.registerInput) {
  terminalHighlight.registerInput(Input$4);
}
let { SourceMapConsumer, SourceMapGenerator } = require$$2;
let { dirname, relative, resolve, sep } = require$$2;
let { pathToFileURL } = require$$2;
let Input$3 = input;
let sourceMapAvailable = Boolean(SourceMapConsumer && SourceMapGenerator);
let pathAvailable = Boolean(dirname && resolve && relative && sep);
let MapGenerator$2 = class MapGenerator2 {
  constructor(stringify2, root2, opts, cssString) {
    this.stringify = stringify2;
    this.mapOpts = opts.map || {};
    this.root = root2;
    this.opts = opts;
    this.css = cssString;
    this.originalCSS = cssString;
    this.usesFileUrls = !this.mapOpts.from && this.mapOpts.absolute;
    this.memoizedFileURLs = /* @__PURE__ */ new Map();
    this.memoizedPaths = /* @__PURE__ */ new Map();
    this.memoizedURLs = /* @__PURE__ */ new Map();
  }
  addAnnotation() {
    let content;
    if (this.isInline()) {
      content = "data:application/json;base64," + this.toBase64(this.map.toString());
    } else if (typeof this.mapOpts.annotation === "string") {
      content = this.mapOpts.annotation;
    } else if (typeof this.mapOpts.annotation === "function") {
      content = this.mapOpts.annotation(this.opts.to, this.root);
    } else {
      content = this.outputFile() + ".map";
    }
    let eol = "\n";
    if (this.css.includes("\r\n")) eol = "\r\n";
    this.css += eol + "/*# sourceMappingURL=" + content + " */";
  }
  applyPrevMaps() {
    for (let prev of this.previous()) {
      let from = this.toUrl(this.path(prev.file));
      let root2 = prev.root || dirname(prev.file);
      let map;
      if (this.mapOpts.sourcesContent === false) {
        map = new SourceMapConsumer(prev.text);
        if (map.sourcesContent) {
          map.sourcesContent = null;
        }
      } else {
        map = prev.consumer();
      }
      this.map.applySourceMap(map, from, this.toUrl(this.path(root2)));
    }
  }
  clearAnnotation() {
    if (this.mapOpts.annotation === false) return;
    if (this.root) {
      let node2;
      for (let i2 = this.root.nodes.length - 1; i2 >= 0; i2--) {
        node2 = this.root.nodes[i2];
        if (node2.type !== "comment") continue;
        if (node2.text.indexOf("# sourceMappingURL=") === 0) {
          this.root.removeChild(i2);
        }
      }
    } else if (this.css) {
      this.css = this.css.replace(/\n*?\/\*#[\S\s]*?\*\/$/gm, "");
    }
  }
  generate() {
    this.clearAnnotation();
    if (pathAvailable && sourceMapAvailable && this.isMap()) {
      return this.generateMap();
    } else {
      let result2 = "";
      this.stringify(this.root, (i2) => {
        result2 += i2;
      });
      return [result2];
    }
  }
  generateMap() {
    if (this.root) {
      this.generateString();
    } else if (this.previous().length === 1) {
      let prev = this.previous()[0].consumer();
      prev.file = this.outputFile();
      this.map = SourceMapGenerator.fromSourceMap(prev, {
        ignoreInvalidMapping: true
      });
    } else {
      this.map = new SourceMapGenerator({
        file: this.outputFile(),
        ignoreInvalidMapping: true
      });
      this.map.addMapping({
        generated: { column: 0, line: 1 },
        original: { column: 0, line: 1 },
        source: this.opts.from ? this.toUrl(this.path(this.opts.from)) : "<no source>"
      });
    }
    if (this.isSourcesContent()) this.setSourcesContent();
    if (this.root && this.previous().length > 0) this.applyPrevMaps();
    if (this.isAnnotation()) this.addAnnotation();
    if (this.isInline()) {
      return [this.css];
    } else {
      return [this.css, this.map];
    }
  }
  generateString() {
    this.css = "";
    this.map = new SourceMapGenerator({
      file: this.outputFile(),
      ignoreInvalidMapping: true
    });
    let line = 1;
    let column = 1;
    let noSource = "<no source>";
    let mapping = {
      generated: { column: 0, line: 0 },
      original: { column: 0, line: 0 },
      source: ""
    };
    let lines, last;
    this.stringify(this.root, (str, node2, type) => {
      this.css += str;
      if (node2 && type !== "end") {
        mapping.generated.line = line;
        mapping.generated.column = column - 1;
        if (node2.source && node2.source.start) {
          mapping.source = this.sourcePath(node2);
          mapping.original.line = node2.source.start.line;
          mapping.original.column = node2.source.start.column - 1;
          this.map.addMapping(mapping);
        } else {
          mapping.source = noSource;
          mapping.original.line = 1;
          mapping.original.column = 0;
          this.map.addMapping(mapping);
        }
      }
      lines = str.match(/\n/g);
      if (lines) {
        line += lines.length;
        last = str.lastIndexOf("\n");
        column = str.length - last;
      } else {
        column += str.length;
      }
      if (node2 && type !== "start") {
        let p = node2.parent || { raws: {} };
        let childless = node2.type === "decl" || node2.type === "atrule" && !node2.nodes;
        if (!childless || node2 !== p.last || p.raws.semicolon) {
          if (node2.source && node2.source.end) {
            mapping.source = this.sourcePath(node2);
            mapping.original.line = node2.source.end.line;
            mapping.original.column = node2.source.end.column - 1;
            mapping.generated.line = line;
            mapping.generated.column = column - 2;
            this.map.addMapping(mapping);
          } else {
            mapping.source = noSource;
            mapping.original.line = 1;
            mapping.original.column = 0;
            mapping.generated.line = line;
            mapping.generated.column = column - 1;
            this.map.addMapping(mapping);
          }
        }
      }
    });
  }
  isAnnotation() {
    if (this.isInline()) {
      return true;
    }
    if (typeof this.mapOpts.annotation !== "undefined") {
      return this.mapOpts.annotation;
    }
    if (this.previous().length) {
      return this.previous().some((i2) => i2.annotation);
    }
    return true;
  }
  isInline() {
    if (typeof this.mapOpts.inline !== "undefined") {
      return this.mapOpts.inline;
    }
    let annotation = this.mapOpts.annotation;
    if (typeof annotation !== "undefined" && annotation !== true) {
      return false;
    }
    if (this.previous().length) {
      return this.previous().some((i2) => i2.inline);
    }
    return true;
  }
  isMap() {
    if (typeof this.opts.map !== "undefined") {
      return !!this.opts.map;
    }
    return this.previous().length > 0;
  }
  isSourcesContent() {
    if (typeof this.mapOpts.sourcesContent !== "undefined") {
      return this.mapOpts.sourcesContent;
    }
    if (this.previous().length) {
      return this.previous().some((i2) => i2.withContent());
    }
    return true;
  }
  outputFile() {
    if (this.opts.to) {
      return this.path(this.opts.to);
    } else if (this.opts.from) {
      return this.path(this.opts.from);
    } else {
      return "to.css";
    }
  }
  path(file) {
    if (this.mapOpts.absolute) return file;
    if (file.charCodeAt(0) === 60) return file;
    if (/^\w+:\/\//.test(file)) return file;
    let cached = this.memoizedPaths.get(file);
    if (cached) return cached;
    let from = this.opts.to ? dirname(this.opts.to) : ".";
    if (typeof this.mapOpts.annotation === "string") {
      from = dirname(resolve(from, this.mapOpts.annotation));
    }
    let path = relative(from, file);
    this.memoizedPaths.set(file, path);
    return path;
  }
  previous() {
    if (!this.previousMaps) {
      this.previousMaps = [];
      if (this.root) {
        this.root.walk((node2) => {
          if (node2.source && node2.source.input.map) {
            let map = node2.source.input.map;
            if (!this.previousMaps.includes(map)) {
              this.previousMaps.push(map);
            }
          }
        });
      } else {
        let input2 = new Input$3(this.originalCSS, this.opts);
        if (input2.map) this.previousMaps.push(input2.map);
      }
    }
    return this.previousMaps;
  }
  setSourcesContent() {
    let already = {};
    if (this.root) {
      this.root.walk((node2) => {
        if (node2.source) {
          let from = node2.source.input.from;
          if (from && !already[from]) {
            already[from] = true;
            let fromUrl = this.usesFileUrls ? this.toFileUrl(from) : this.toUrl(this.path(from));
            this.map.setSourceContent(fromUrl, node2.source.input.css);
          }
        }
      });
    } else if (this.css) {
      let from = this.opts.from ? this.toUrl(this.path(this.opts.from)) : "<no source>";
      this.map.setSourceContent(from, this.css);
    }
  }
  sourcePath(node2) {
    if (this.mapOpts.from) {
      return this.toUrl(this.mapOpts.from);
    } else if (this.usesFileUrls) {
      return this.toFileUrl(node2.source.input.from);
    } else {
      return this.toUrl(this.path(node2.source.input.from));
    }
  }
  toBase64(str) {
    if (Buffer) {
      return Buffer.from(str).toString("base64");
    } else {
      return window.btoa(unescape(encodeURIComponent(str)));
    }
  }
  toFileUrl(path) {
    let cached = this.memoizedFileURLs.get(path);
    if (cached) return cached;
    if (pathToFileURL) {
      let fileURL = pathToFileURL(path).toString();
      this.memoizedFileURLs.set(path, fileURL);
      return fileURL;
    } else {
      throw new Error(
        "`map.absolute` option is not available in this PostCSS build"
      );
    }
  }
  toUrl(path) {
    let cached = this.memoizedURLs.get(path);
    if (cached) return cached;
    if (sep === "\\") {
      path = path.replace(/\\/g, "/");
    }
    let url = encodeURI(path).replace(/[#?]/g, encodeURIComponent);
    this.memoizedURLs.set(path, url);
    return url;
  }
};
var mapGenerator = MapGenerator$2;
let Node$2 = node;
let Comment$4 = class Comment2 extends Node$2 {
  constructor(defaults) {
    super(defaults);
    this.type = "comment";
  }
};
var comment = Comment$4;
Comment$4.default = Comment$4;
let { isClean: isClean$1, my: my$1 } = symbols;
let Declaration$3 = declaration;
let Comment$3 = comment;
let Node$1 = node;
let parse$4, Rule$4, AtRule$4, Root$6;
function cleanSource(nodes) {
  return nodes.map((i2) => {
    if (i2.nodes) i2.nodes = cleanSource(i2.nodes);
    delete i2.source;
    return i2;
  });
}
function markDirtyUp(node2) {
  node2[isClean$1] = false;
  if (node2.proxyOf.nodes) {
    for (let i2 of node2.proxyOf.nodes) {
      markDirtyUp(i2);
    }
  }
}
let Container$7 = class Container2 extends Node$1 {
  append(...children) {
    for (let child of children) {
      let nodes = this.normalize(child, this.last);
      for (let node2 of nodes) this.proxyOf.nodes.push(node2);
    }
    this.markDirty();
    return this;
  }
  cleanRaws(keepBetween) {
    super.cleanRaws(keepBetween);
    if (this.nodes) {
      for (let node2 of this.nodes) node2.cleanRaws(keepBetween);
    }
  }
  each(callback) {
    if (!this.proxyOf.nodes) return void 0;
    let iterator = this.getIterator();
    let index2, result2;
    while (this.indexes[iterator] < this.proxyOf.nodes.length) {
      index2 = this.indexes[iterator];
      result2 = callback(this.proxyOf.nodes[index2], index2);
      if (result2 === false) break;
      this.indexes[iterator] += 1;
    }
    delete this.indexes[iterator];
    return result2;
  }
  every(condition) {
    return this.nodes.every(condition);
  }
  getIterator() {
    if (!this.lastEach) this.lastEach = 0;
    if (!this.indexes) this.indexes = {};
    this.lastEach += 1;
    let iterator = this.lastEach;
    this.indexes[iterator] = 0;
    return iterator;
  }
  getProxyProcessor() {
    return {
      get(node2, prop) {
        if (prop === "proxyOf") {
          return node2;
        } else if (!node2[prop]) {
          return node2[prop];
        } else if (prop === "each" || typeof prop === "string" && prop.startsWith("walk")) {
          return (...args) => {
            return node2[prop](
              ...args.map((i2) => {
                if (typeof i2 === "function") {
                  return (child, index2) => i2(child.toProxy(), index2);
                } else {
                  return i2;
                }
              })
            );
          };
        } else if (prop === "every" || prop === "some") {
          return (cb) => {
            return node2[prop](
              (child, ...other) => cb(child.toProxy(), ...other)
            );
          };
        } else if (prop === "root") {
          return () => node2.root().toProxy();
        } else if (prop === "nodes") {
          return node2.nodes.map((i2) => i2.toProxy());
        } else if (prop === "first" || prop === "last") {
          return node2[prop].toProxy();
        } else {
          return node2[prop];
        }
      },
      set(node2, prop, value) {
        if (node2[prop] === value) return true;
        node2[prop] = value;
        if (prop === "name" || prop === "params" || prop === "selector") {
          node2.markDirty();
        }
        return true;
      }
    };
  }
  index(child) {
    if (typeof child === "number") return child;
    if (child.proxyOf) child = child.proxyOf;
    return this.proxyOf.nodes.indexOf(child);
  }
  insertAfter(exist, add) {
    let existIndex = this.index(exist);
    let nodes = this.normalize(add, this.proxyOf.nodes[existIndex]).reverse();
    existIndex = this.index(exist);
    for (let node2 of nodes) this.proxyOf.nodes.splice(existIndex + 1, 0, node2);
    let index2;
    for (let id in this.indexes) {
      index2 = this.indexes[id];
      if (existIndex < index2) {
        this.indexes[id] = index2 + nodes.length;
      }
    }
    this.markDirty();
    return this;
  }
  insertBefore(exist, add) {
    let existIndex = this.index(exist);
    let type = existIndex === 0 ? "prepend" : false;
    let nodes = this.normalize(add, this.proxyOf.nodes[existIndex], type).reverse();
    existIndex = this.index(exist);
    for (let node2 of nodes) this.proxyOf.nodes.splice(existIndex, 0, node2);
    let index2;
    for (let id in this.indexes) {
      index2 = this.indexes[id];
      if (existIndex <= index2) {
        this.indexes[id] = index2 + nodes.length;
      }
    }
    this.markDirty();
    return this;
  }
  normalize(nodes, sample) {
    if (typeof nodes === "string") {
      nodes = cleanSource(parse$4(nodes).nodes);
    } else if (typeof nodes === "undefined") {
      nodes = [];
    } else if (Array.isArray(nodes)) {
      nodes = nodes.slice(0);
      for (let i2 of nodes) {
        if (i2.parent) i2.parent.removeChild(i2, "ignore");
      }
    } else if (nodes.type === "root" && this.type !== "document") {
      nodes = nodes.nodes.slice(0);
      for (let i2 of nodes) {
        if (i2.parent) i2.parent.removeChild(i2, "ignore");
      }
    } else if (nodes.type) {
      nodes = [nodes];
    } else if (nodes.prop) {
      if (typeof nodes.value === "undefined") {
        throw new Error("Value field is missed in node creation");
      } else if (typeof nodes.value !== "string") {
        nodes.value = String(nodes.value);
      }
      nodes = [new Declaration$3(nodes)];
    } else if (nodes.selector) {
      nodes = [new Rule$4(nodes)];
    } else if (nodes.name) {
      nodes = [new AtRule$4(nodes)];
    } else if (nodes.text) {
      nodes = [new Comment$3(nodes)];
    } else {
      throw new Error("Unknown node type in node creation");
    }
    let processed = nodes.map((i2) => {
      if (!i2[my$1]) Container2.rebuild(i2);
      i2 = i2.proxyOf;
      if (i2.parent) i2.parent.removeChild(i2);
      if (i2[isClean$1]) markDirtyUp(i2);
      if (typeof i2.raws.before === "undefined") {
        if (sample && typeof sample.raws.before !== "undefined") {
          i2.raws.before = sample.raws.before.replace(/\S/g, "");
        }
      }
      i2.parent = this.proxyOf;
      return i2;
    });
    return processed;
  }
  prepend(...children) {
    children = children.reverse();
    for (let child of children) {
      let nodes = this.normalize(child, this.first, "prepend").reverse();
      for (let node2 of nodes) this.proxyOf.nodes.unshift(node2);
      for (let id in this.indexes) {
        this.indexes[id] = this.indexes[id] + nodes.length;
      }
    }
    this.markDirty();
    return this;
  }
  push(child) {
    child.parent = this;
    this.proxyOf.nodes.push(child);
    return this;
  }
  removeAll() {
    for (let node2 of this.proxyOf.nodes) node2.parent = void 0;
    this.proxyOf.nodes = [];
    this.markDirty();
    return this;
  }
  removeChild(child) {
    child = this.index(child);
    this.proxyOf.nodes[child].parent = void 0;
    this.proxyOf.nodes.splice(child, 1);
    let index2;
    for (let id in this.indexes) {
      index2 = this.indexes[id];
      if (index2 >= child) {
        this.indexes[id] = index2 - 1;
      }
    }
    this.markDirty();
    return this;
  }
  replaceValues(pattern, opts, callback) {
    if (!callback) {
      callback = opts;
      opts = {};
    }
    this.walkDecls((decl) => {
      if (opts.props && !opts.props.includes(decl.prop)) return;
      if (opts.fast && !decl.value.includes(opts.fast)) return;
      decl.value = decl.value.replace(pattern, callback);
    });
    this.markDirty();
    return this;
  }
  some(condition) {
    return this.nodes.some(condition);
  }
  walk(callback) {
    return this.each((child, i2) => {
      let result2;
      try {
        result2 = callback(child, i2);
      } catch (e2) {
        throw child.addToError(e2);
      }
      if (result2 !== false && child.walk) {
        result2 = child.walk(callback);
      }
      return result2;
    });
  }
  walkAtRules(name, callback) {
    if (!callback) {
      callback = name;
      return this.walk((child, i2) => {
        if (child.type === "atrule") {
          return callback(child, i2);
        }
      });
    }
    if (name instanceof RegExp) {
      return this.walk((child, i2) => {
        if (child.type === "atrule" && name.test(child.name)) {
          return callback(child, i2);
        }
      });
    }
    return this.walk((child, i2) => {
      if (child.type === "atrule" && child.name === name) {
        return callback(child, i2);
      }
    });
  }
  walkComments(callback) {
    return this.walk((child, i2) => {
      if (child.type === "comment") {
        return callback(child, i2);
      }
    });
  }
  walkDecls(prop, callback) {
    if (!callback) {
      callback = prop;
      return this.walk((child, i2) => {
        if (child.type === "decl") {
          return callback(child, i2);
        }
      });
    }
    if (prop instanceof RegExp) {
      return this.walk((child, i2) => {
        if (child.type === "decl" && prop.test(child.prop)) {
          return callback(child, i2);
        }
      });
    }
    return this.walk((child, i2) => {
      if (child.type === "decl" && child.prop === prop) {
        return callback(child, i2);
      }
    });
  }
  walkRules(selector, callback) {
    if (!callback) {
      callback = selector;
      return this.walk((child, i2) => {
        if (child.type === "rule") {
          return callback(child, i2);
        }
      });
    }
    if (selector instanceof RegExp) {
      return this.walk((child, i2) => {
        if (child.type === "rule" && selector.test(child.selector)) {
          return callback(child, i2);
        }
      });
    }
    return this.walk((child, i2) => {
      if (child.type === "rule" && child.selector === selector) {
        return callback(child, i2);
      }
    });
  }
  get first() {
    if (!this.proxyOf.nodes) return void 0;
    return this.proxyOf.nodes[0];
  }
  get last() {
    if (!this.proxyOf.nodes) return void 0;
    return this.proxyOf.nodes[this.proxyOf.nodes.length - 1];
  }
};
Container$7.registerParse = (dependant) => {
  parse$4 = dependant;
};
Container$7.registerRule = (dependant) => {
  Rule$4 = dependant;
};
Container$7.registerAtRule = (dependant) => {
  AtRule$4 = dependant;
};
Container$7.registerRoot = (dependant) => {
  Root$6 = dependant;
};
var container = Container$7;
Container$7.default = Container$7;
Container$7.rebuild = (node2) => {
  if (node2.type === "atrule") {
    Object.setPrototypeOf(node2, AtRule$4.prototype);
  } else if (node2.type === "rule") {
    Object.setPrototypeOf(node2, Rule$4.prototype);
  } else if (node2.type === "decl") {
    Object.setPrototypeOf(node2, Declaration$3.prototype);
  } else if (node2.type === "comment") {
    Object.setPrototypeOf(node2, Comment$3.prototype);
  } else if (node2.type === "root") {
    Object.setPrototypeOf(node2, Root$6.prototype);
  }
  node2[my$1] = true;
  if (node2.nodes) {
    node2.nodes.forEach((child) => {
      Container$7.rebuild(child);
    });
  }
};
let Container$6 = container;
let LazyResult$4, Processor$3;
let Document$3 = class Document23 extends Container$6 {
  constructor(defaults) {
    super({ type: "document", ...defaults });
    if (!this.nodes) {
      this.nodes = [];
    }
  }
  toResult(opts = {}) {
    let lazy = new LazyResult$4(new Processor$3(), this, opts);
    return lazy.stringify();
  }
};
Document$3.registerLazyResult = (dependant) => {
  LazyResult$4 = dependant;
};
Document$3.registerProcessor = (dependant) => {
  Processor$3 = dependant;
};
var document$1 = Document$3;
Document$3.default = Document$3;
let printed = {};
var warnOnce$2 = function warnOnce2(message) {
  if (printed[message]) return;
  printed[message] = true;
  if (typeof console !== "undefined" && console.warn) {
    console.warn(message);
  }
};
let Warning$2 = class Warning2 {
  constructor(text, opts = {}) {
    this.type = "warning";
    this.text = text;
    if (opts.node && opts.node.source) {
      let range = opts.node.rangeBy(opts);
      this.line = range.start.line;
      this.column = range.start.column;
      this.endLine = range.end.line;
      this.endColumn = range.end.column;
    }
    for (let opt in opts) this[opt] = opts[opt];
  }
  toString() {
    if (this.node) {
      return this.node.error(this.text, {
        index: this.index,
        plugin: this.plugin,
        word: this.word
      }).message;
    }
    if (this.plugin) {
      return this.plugin + ": " + this.text;
    }
    return this.text;
  }
};
var warning = Warning$2;
Warning$2.default = Warning$2;
let Warning$1 = warning;
let Result$3 = class Result2 {
  constructor(processor2, root2, opts) {
    this.processor = processor2;
    this.messages = [];
    this.root = root2;
    this.opts = opts;
    this.css = void 0;
    this.map = void 0;
  }
  toString() {
    return this.css;
  }
  warn(text, opts = {}) {
    if (!opts.plugin) {
      if (this.lastPlugin && this.lastPlugin.postcssPlugin) {
        opts.plugin = this.lastPlugin.postcssPlugin;
      }
    }
    let warning2 = new Warning$1(text, opts);
    this.messages.push(warning2);
    return warning2;
  }
  warnings() {
    return this.messages.filter((i2) => i2.type === "warning");
  }
  get content() {
    return this.css;
  }
};
var result = Result$3;
Result$3.default = Result$3;
const SINGLE_QUOTE = "'".charCodeAt(0);
const DOUBLE_QUOTE = '"'.charCodeAt(0);
const BACKSLASH = "\\".charCodeAt(0);
const SLASH = "/".charCodeAt(0);
const NEWLINE = "\n".charCodeAt(0);
const SPACE = " ".charCodeAt(0);
const FEED = "\f".charCodeAt(0);
const TAB = "	".charCodeAt(0);
const CR = "\r".charCodeAt(0);
const OPEN_SQUARE = "[".charCodeAt(0);
const CLOSE_SQUARE = "]".charCodeAt(0);
const OPEN_PARENTHESES = "(".charCodeAt(0);
const CLOSE_PARENTHESES = ")".charCodeAt(0);
const OPEN_CURLY = "{".charCodeAt(0);
const CLOSE_CURLY = "}".charCodeAt(0);
const SEMICOLON = ";".charCodeAt(0);
const ASTERISK = "*".charCodeAt(0);
const COLON = ":".charCodeAt(0);
const AT = "@".charCodeAt(0);
const RE_AT_END = /[\t\n\f\r "#'()/;[\\\]{}]/g;
const RE_WORD_END = /[\t\n\f\r !"#'():;@[\\\]{}]|\/(?=\*)/g;
const RE_BAD_BRACKET = /.[\r\n"'(/\\]/;
const RE_HEX_ESCAPE = /[\da-f]/i;
var tokenize = function tokenizer2(input2, options = {}) {
  let css = input2.css.valueOf();
  let ignore = options.ignoreErrors;
  let code, next, quote, content, escape;
  let escaped, escapePos, prev, n2, currentToken;
  let length = css.length;
  let pos = 0;
  let buffer = [];
  let returned = [];
  function position() {
    return pos;
  }
  function unclosed(what) {
    throw input2.error("Unclosed " + what, pos);
  }
  function endOfFile() {
    return returned.length === 0 && pos >= length;
  }
  function nextToken(opts) {
    if (returned.length) return returned.pop();
    if (pos >= length) return;
    let ignoreUnclosed = opts ? opts.ignoreUnclosed : false;
    code = css.charCodeAt(pos);
    switch (code) {
      case NEWLINE:
      case SPACE:
      case TAB:
      case CR:
      case FEED: {
        next = pos;
        do {
          next += 1;
          code = css.charCodeAt(next);
        } while (code === SPACE || code === NEWLINE || code === TAB || code === CR || code === FEED);
        currentToken = ["space", css.slice(pos, next)];
        pos = next - 1;
        break;
      }
      case OPEN_SQUARE:
      case CLOSE_SQUARE:
      case OPEN_CURLY:
      case CLOSE_CURLY:
      case COLON:
      case SEMICOLON:
      case CLOSE_PARENTHESES: {
        let controlChar = String.fromCharCode(code);
        currentToken = [controlChar, controlChar, pos];
        break;
      }
      case OPEN_PARENTHESES: {
        prev = buffer.length ? buffer.pop()[1] : "";
        n2 = css.charCodeAt(pos + 1);
        if (prev === "url" && n2 !== SINGLE_QUOTE && n2 !== DOUBLE_QUOTE && n2 !== SPACE && n2 !== NEWLINE && n2 !== TAB && n2 !== FEED && n2 !== CR) {
          next = pos;
          do {
            escaped = false;
            next = css.indexOf(")", next + 1);
            if (next === -1) {
              if (ignore || ignoreUnclosed) {
                next = pos;
                break;
              } else {
                unclosed("bracket");
              }
            }
            escapePos = next;
            while (css.charCodeAt(escapePos - 1) === BACKSLASH) {
              escapePos -= 1;
              escaped = !escaped;
            }
          } while (escaped);
          currentToken = ["brackets", css.slice(pos, next + 1), pos, next];
          pos = next;
        } else {
          next = css.indexOf(")", pos + 1);
          content = css.slice(pos, next + 1);
          if (next === -1 || RE_BAD_BRACKET.test(content)) {
            currentToken = ["(", "(", pos];
          } else {
            currentToken = ["brackets", content, pos, next];
            pos = next;
          }
        }
        break;
      }
      case SINGLE_QUOTE:
      case DOUBLE_QUOTE: {
        quote = code === SINGLE_QUOTE ? "'" : '"';
        next = pos;
        do {
          escaped = false;
          next = css.indexOf(quote, next + 1);
          if (next === -1) {
            if (ignore || ignoreUnclosed) {
              next = pos + 1;
              break;
            } else {
              unclosed("string");
            }
          }
          escapePos = next;
          while (css.charCodeAt(escapePos - 1) === BACKSLASH) {
            escapePos -= 1;
            escaped = !escaped;
          }
        } while (escaped);
        currentToken = ["string", css.slice(pos, next + 1), pos, next];
        pos = next;
        break;
      }
      case AT: {
        RE_AT_END.lastIndex = pos + 1;
        RE_AT_END.test(css);
        if (RE_AT_END.lastIndex === 0) {
          next = css.length - 1;
        } else {
          next = RE_AT_END.lastIndex - 2;
        }
        currentToken = ["at-word", css.slice(pos, next + 1), pos, next];
        pos = next;
        break;
      }
      case BACKSLASH: {
        next = pos;
        escape = true;
        while (css.charCodeAt(next + 1) === BACKSLASH) {
          next += 1;
          escape = !escape;
        }
        code = css.charCodeAt(next + 1);
        if (escape && code !== SLASH && code !== SPACE && code !== NEWLINE && code !== TAB && code !== CR && code !== FEED) {
          next += 1;
          if (RE_HEX_ESCAPE.test(css.charAt(next))) {
            while (RE_HEX_ESCAPE.test(css.charAt(next + 1))) {
              next += 1;
            }
            if (css.charCodeAt(next + 1) === SPACE) {
              next += 1;
            }
          }
        }
        currentToken = ["word", css.slice(pos, next + 1), pos, next];
        pos = next;
        break;
      }
      default: {
        if (code === SLASH && css.charCodeAt(pos + 1) === ASTERISK) {
          next = css.indexOf("*/", pos + 2) + 1;
          if (next === 0) {
            if (ignore || ignoreUnclosed) {
              next = css.length;
            } else {
              unclosed("comment");
            }
          }
          currentToken = ["comment", css.slice(pos, next + 1), pos, next];
          pos = next;
        } else {
          RE_WORD_END.lastIndex = pos + 1;
          RE_WORD_END.test(css);
          if (RE_WORD_END.lastIndex === 0) {
            next = css.length - 1;
          } else {
            next = RE_WORD_END.lastIndex - 2;
          }
          currentToken = ["word", css.slice(pos, next + 1), pos, next];
          buffer.push(currentToken);
          pos = next;
        }
        break;
      }
    }
    pos++;
    return currentToken;
  }
  function back(token) {
    returned.push(token);
  }
  return {
    back,
    endOfFile,
    nextToken,
    position
  };
};
let Container$5 = container;
let AtRule$3 = class AtRule2 extends Container$5 {
  constructor(defaults) {
    super(defaults);
    this.type = "atrule";
  }
  append(...children) {
    if (!this.proxyOf.nodes) this.nodes = [];
    return super.append(...children);
  }
  prepend(...children) {
    if (!this.proxyOf.nodes) this.nodes = [];
    return super.prepend(...children);
  }
};
var atRule = AtRule$3;
AtRule$3.default = AtRule$3;
Container$5.registerAtRule(AtRule$3);
let Container$4 = container;
let LazyResult$3, Processor$2;
let Root$5 = class Root2 extends Container$4 {
  constructor(defaults) {
    super(defaults);
    this.type = "root";
    if (!this.nodes) this.nodes = [];
  }
  normalize(child, sample, type) {
    let nodes = super.normalize(child);
    if (sample) {
      if (type === "prepend") {
        if (this.nodes.length > 1) {
          sample.raws.before = this.nodes[1].raws.before;
        } else {
          delete sample.raws.before;
        }
      } else if (this.first !== sample) {
        for (let node2 of nodes) {
          node2.raws.before = sample.raws.before;
        }
      }
    }
    return nodes;
  }
  removeChild(child, ignore) {
    let index2 = this.index(child);
    if (!ignore && index2 === 0 && this.nodes.length > 1) {
      this.nodes[1].raws.before = this.nodes[index2].raws.before;
    }
    return super.removeChild(child);
  }
  toResult(opts = {}) {
    let lazy = new LazyResult$3(new Processor$2(), this, opts);
    return lazy.stringify();
  }
};
Root$5.registerLazyResult = (dependant) => {
  LazyResult$3 = dependant;
};
Root$5.registerProcessor = (dependant) => {
  Processor$2 = dependant;
};
var root = Root$5;
Root$5.default = Root$5;
Container$4.registerRoot(Root$5);
let list$2 = {
  comma(string) {
    return list$2.split(string, [","], true);
  },
  space(string) {
    let spaces = [" ", "\n", "	"];
    return list$2.split(string, spaces);
  },
  split(string, separators, last) {
    let array = [];
    let current = "";
    let split = false;
    let func = 0;
    let inQuote = false;
    let prevQuote = "";
    let escape = false;
    for (let letter of string) {
      if (escape) {
        escape = false;
      } else if (letter === "\\") {
        escape = true;
      } else if (inQuote) {
        if (letter === prevQuote) {
          inQuote = false;
        }
      } else if (letter === '"' || letter === "'") {
        inQuote = true;
        prevQuote = letter;
      } else if (letter === "(") {
        func += 1;
      } else if (letter === ")") {
        if (func > 0) func -= 1;
      } else if (func === 0) {
        if (separators.includes(letter)) split = true;
      }
      if (split) {
        if (current !== "") array.push(current.trim());
        current = "";
        split = false;
      } else {
        current += letter;
      }
    }
    if (last || current !== "") array.push(current.trim());
    return array;
  }
};
var list_1 = list$2;
list$2.default = list$2;
let Container$3 = container;
let list$1 = list_1;
let Rule$3 = class Rule2 extends Container$3 {
  constructor(defaults) {
    super(defaults);
    this.type = "rule";
    if (!this.nodes) this.nodes = [];
  }
  get selectors() {
    return list$1.comma(this.selector);
  }
  set selectors(values) {
    let match = this.selector ? this.selector.match(/,\s*/) : null;
    let sep2 = match ? match[0] : "," + this.raw("between", "beforeOpen");
    this.selector = values.join(sep2);
  }
};
var rule = Rule$3;
Rule$3.default = Rule$3;
Container$3.registerRule(Rule$3);
let Declaration$2 = declaration;
let tokenizer22 = tokenize;
let Comment$2 = comment;
let AtRule$2 = atRule;
let Root$4 = root;
let Rule$2 = rule;
const SAFE_COMMENT_NEIGHBOR = {
  empty: true,
  space: true
};
function findLastWithPosition(tokens) {
  for (let i2 = tokens.length - 1; i2 >= 0; i2--) {
    let token = tokens[i2];
    let pos = token[3] || token[2];
    if (pos) return pos;
  }
}
let Parser$1 = class Parser2 {
  constructor(input2) {
    this.input = input2;
    this.root = new Root$4();
    this.current = this.root;
    this.spaces = "";
    this.semicolon = false;
    this.createTokenizer();
    this.root.source = { input: input2, start: { column: 1, line: 1, offset: 0 } };
  }
  atrule(token) {
    let node2 = new AtRule$2();
    node2.name = token[1].slice(1);
    if (node2.name === "") {
      this.unnamedAtrule(node2, token);
    }
    this.init(node2, token[2]);
    let type;
    let prev;
    let shift;
    let last = false;
    let open = false;
    let params = [];
    let brackets = [];
    while (!this.tokenizer.endOfFile()) {
      token = this.tokenizer.nextToken();
      type = token[0];
      if (type === "(" || type === "[") {
        brackets.push(type === "(" ? ")" : "]");
      } else if (type === "{" && brackets.length > 0) {
        brackets.push("}");
      } else if (type === brackets[brackets.length - 1]) {
        brackets.pop();
      }
      if (brackets.length === 0) {
        if (type === ";") {
          node2.source.end = this.getPosition(token[2]);
          node2.source.end.offset++;
          this.semicolon = true;
          break;
        } else if (type === "{") {
          open = true;
          break;
        } else if (type === "}") {
          if (params.length > 0) {
            shift = params.length - 1;
            prev = params[shift];
            while (prev && prev[0] === "space") {
              prev = params[--shift];
            }
            if (prev) {
              node2.source.end = this.getPosition(prev[3] || prev[2]);
              node2.source.end.offset++;
            }
          }
          this.end(token);
          break;
        } else {
          params.push(token);
        }
      } else {
        params.push(token);
      }
      if (this.tokenizer.endOfFile()) {
        last = true;
        break;
      }
    }
    node2.raws.between = this.spacesAndCommentsFromEnd(params);
    if (params.length) {
      node2.raws.afterName = this.spacesAndCommentsFromStart(params);
      this.raw(node2, "params", params);
      if (last) {
        token = params[params.length - 1];
        node2.source.end = this.getPosition(token[3] || token[2]);
        node2.source.end.offset++;
        this.spaces = node2.raws.between;
        node2.raws.between = "";
      }
    } else {
      node2.raws.afterName = "";
      node2.params = "";
    }
    if (open) {
      node2.nodes = [];
      this.current = node2;
    }
  }
  checkMissedSemicolon(tokens) {
    let colon = this.colon(tokens);
    if (colon === false) return;
    let founded = 0;
    let token;
    for (let j = colon - 1; j >= 0; j--) {
      token = tokens[j];
      if (token[0] !== "space") {
        founded += 1;
        if (founded === 2) break;
      }
    }
    throw this.input.error(
      "Missed semicolon",
      token[0] === "word" ? token[3] + 1 : token[2]
    );
  }
  colon(tokens) {
    let brackets = 0;
    let token, type, prev;
    for (let [i2, element] of tokens.entries()) {
      token = element;
      type = token[0];
      if (type === "(") {
        brackets += 1;
      }
      if (type === ")") {
        brackets -= 1;
      }
      if (brackets === 0 && type === ":") {
        if (!prev) {
          this.doubleColon(token);
        } else if (prev[0] === "word" && prev[1] === "progid") {
          continue;
        } else {
          return i2;
        }
      }
      prev = token;
    }
    return false;
  }
  comment(token) {
    let node2 = new Comment$2();
    this.init(node2, token[2]);
    node2.source.end = this.getPosition(token[3] || token[2]);
    node2.source.end.offset++;
    let text = token[1].slice(2, -2);
    if (/^\s*$/.test(text)) {
      node2.text = "";
      node2.raws.left = text;
      node2.raws.right = "";
    } else {
      let match = text.match(/^(\s*)([^]*\S)(\s*)$/);
      node2.text = match[2];
      node2.raws.left = match[1];
      node2.raws.right = match[3];
    }
  }
  createTokenizer() {
    this.tokenizer = tokenizer22(this.input);
  }
  decl(tokens, customProperty) {
    let node2 = new Declaration$2();
    this.init(node2, tokens[0][2]);
    let last = tokens[tokens.length - 1];
    if (last[0] === ";") {
      this.semicolon = true;
      tokens.pop();
    }
    node2.source.end = this.getPosition(
      last[3] || last[2] || findLastWithPosition(tokens)
    );
    node2.source.end.offset++;
    while (tokens[0][0] !== "word") {
      if (tokens.length === 1) this.unknownWord(tokens);
      node2.raws.before += tokens.shift()[1];
    }
    node2.source.start = this.getPosition(tokens[0][2]);
    node2.prop = "";
    while (tokens.length) {
      let type = tokens[0][0];
      if (type === ":" || type === "space" || type === "comment") {
        break;
      }
      node2.prop += tokens.shift()[1];
    }
    node2.raws.between = "";
    let token;
    while (tokens.length) {
      token = tokens.shift();
      if (token[0] === ":") {
        node2.raws.between += token[1];
        break;
      } else {
        if (token[0] === "word" && /\w/.test(token[1])) {
          this.unknownWord([token]);
        }
        node2.raws.between += token[1];
      }
    }
    if (node2.prop[0] === "_" || node2.prop[0] === "*") {
      node2.raws.before += node2.prop[0];
      node2.prop = node2.prop.slice(1);
    }
    let firstSpaces = [];
    let next;
    while (tokens.length) {
      next = tokens[0][0];
      if (next !== "space" && next !== "comment") break;
      firstSpaces.push(tokens.shift());
    }
    this.precheckMissedSemicolon(tokens);
    for (let i2 = tokens.length - 1; i2 >= 0; i2--) {
      token = tokens[i2];
      if (token[1].toLowerCase() === "!important") {
        node2.important = true;
        let string = this.stringFrom(tokens, i2);
        string = this.spacesFromEnd(tokens) + string;
        if (string !== " !important") node2.raws.important = string;
        break;
      } else if (token[1].toLowerCase() === "important") {
        let cache = tokens.slice(0);
        let str = "";
        for (let j = i2; j > 0; j--) {
          let type = cache[j][0];
          if (str.trim().indexOf("!") === 0 && type !== "space") {
            break;
          }
          str = cache.pop()[1] + str;
        }
        if (str.trim().indexOf("!") === 0) {
          node2.important = true;
          node2.raws.important = str;
          tokens = cache;
        }
      }
      if (token[0] !== "space" && token[0] !== "comment") {
        break;
      }
    }
    let hasWord = tokens.some((i2) => i2[0] !== "space" && i2[0] !== "comment");
    if (hasWord) {
      node2.raws.between += firstSpaces.map((i2) => i2[1]).join("");
      firstSpaces = [];
    }
    this.raw(node2, "value", firstSpaces.concat(tokens), customProperty);
    if (node2.value.includes(":") && !customProperty) {
      this.checkMissedSemicolon(tokens);
    }
  }
  doubleColon(token) {
    throw this.input.error(
      "Double colon",
      { offset: token[2] },
      { offset: token[2] + token[1].length }
    );
  }
  emptyRule(token) {
    let node2 = new Rule$2();
    this.init(node2, token[2]);
    node2.selector = "";
    node2.raws.between = "";
    this.current = node2;
  }
  end(token) {
    if (this.current.nodes && this.current.nodes.length) {
      this.current.raws.semicolon = this.semicolon;
    }
    this.semicolon = false;
    this.current.raws.after = (this.current.raws.after || "") + this.spaces;
    this.spaces = "";
    if (this.current.parent) {
      this.current.source.end = this.getPosition(token[2]);
      this.current.source.end.offset++;
      this.current = this.current.parent;
    } else {
      this.unexpectedClose(token);
    }
  }
  endFile() {
    if (this.current.parent) this.unclosedBlock();
    if (this.current.nodes && this.current.nodes.length) {
      this.current.raws.semicolon = this.semicolon;
    }
    this.current.raws.after = (this.current.raws.after || "") + this.spaces;
    this.root.source.end = this.getPosition(this.tokenizer.position());
  }
  freeSemicolon(token) {
    this.spaces += token[1];
    if (this.current.nodes) {
      let prev = this.current.nodes[this.current.nodes.length - 1];
      if (prev && prev.type === "rule" && !prev.raws.ownSemicolon) {
        prev.raws.ownSemicolon = this.spaces;
        this.spaces = "";
      }
    }
  }
  // Helpers
  getPosition(offset) {
    let pos = this.input.fromOffset(offset);
    return {
      column: pos.col,
      line: pos.line,
      offset
    };
  }
  init(node2, offset) {
    this.current.push(node2);
    node2.source = {
      input: this.input,
      start: this.getPosition(offset)
    };
    node2.raws.before = this.spaces;
    this.spaces = "";
    if (node2.type !== "comment") this.semicolon = false;
  }
  other(start) {
    let end = false;
    let type = null;
    let colon = false;
    let bracket = null;
    let brackets = [];
    let customProperty = start[1].startsWith("--");
    let tokens = [];
    let token = start;
    while (token) {
      type = token[0];
      tokens.push(token);
      if (type === "(" || type === "[") {
        if (!bracket) bracket = token;
        brackets.push(type === "(" ? ")" : "]");
      } else if (customProperty && colon && type === "{") {
        if (!bracket) bracket = token;
        brackets.push("}");
      } else if (brackets.length === 0) {
        if (type === ";") {
          if (colon) {
            this.decl(tokens, customProperty);
            return;
          } else {
            break;
          }
        } else if (type === "{") {
          this.rule(tokens);
          return;
        } else if (type === "}") {
          this.tokenizer.back(tokens.pop());
          end = true;
          break;
        } else if (type === ":") {
          colon = true;
        }
      } else if (type === brackets[brackets.length - 1]) {
        brackets.pop();
        if (brackets.length === 0) bracket = null;
      }
      token = this.tokenizer.nextToken();
    }
    if (this.tokenizer.endOfFile()) end = true;
    if (brackets.length > 0) this.unclosedBracket(bracket);
    if (end && colon) {
      if (!customProperty) {
        while (tokens.length) {
          token = tokens[tokens.length - 1][0];
          if (token !== "space" && token !== "comment") break;
          this.tokenizer.back(tokens.pop());
        }
      }
      this.decl(tokens, customProperty);
    } else {
      this.unknownWord(tokens);
    }
  }
  parse() {
    let token;
    while (!this.tokenizer.endOfFile()) {
      token = this.tokenizer.nextToken();
      switch (token[0]) {
        case "space":
          this.spaces += token[1];
          break;
        case ";":
          this.freeSemicolon(token);
          break;
        case "}":
          this.end(token);
          break;
        case "comment":
          this.comment(token);
          break;
        case "at-word":
          this.atrule(token);
          break;
        case "{":
          this.emptyRule(token);
          break;
        default:
          this.other(token);
          break;
      }
    }
    this.endFile();
  }
  precheckMissedSemicolon() {
  }
  raw(node2, prop, tokens, customProperty) {
    let token, type;
    let length = tokens.length;
    let value = "";
    let clean = true;
    let next, prev;
    for (let i2 = 0; i2 < length; i2 += 1) {
      token = tokens[i2];
      type = token[0];
      if (type === "space" && i2 === length - 1 && !customProperty) {
        clean = false;
      } else if (type === "comment") {
        prev = tokens[i2 - 1] ? tokens[i2 - 1][0] : "empty";
        next = tokens[i2 + 1] ? tokens[i2 + 1][0] : "empty";
        if (!SAFE_COMMENT_NEIGHBOR[prev] && !SAFE_COMMENT_NEIGHBOR[next]) {
          if (value.slice(-1) === ",") {
            clean = false;
          } else {
            value += token[1];
          }
        } else {
          clean = false;
        }
      } else {
        value += token[1];
      }
    }
    if (!clean) {
      let raw = tokens.reduce((all, i2) => all + i2[1], "");
      node2.raws[prop] = { raw, value };
    }
    node2[prop] = value;
  }
  rule(tokens) {
    tokens.pop();
    let node2 = new Rule$2();
    this.init(node2, tokens[0][2]);
    node2.raws.between = this.spacesAndCommentsFromEnd(tokens);
    this.raw(node2, "selector", tokens);
    this.current = node2;
  }
  spacesAndCommentsFromEnd(tokens) {
    let lastTokenType;
    let spaces = "";
    while (tokens.length) {
      lastTokenType = tokens[tokens.length - 1][0];
      if (lastTokenType !== "space" && lastTokenType !== "comment") break;
      spaces = tokens.pop()[1] + spaces;
    }
    return spaces;
  }
  // Errors
  spacesAndCommentsFromStart(tokens) {
    let next;
    let spaces = "";
    while (tokens.length) {
      next = tokens[0][0];
      if (next !== "space" && next !== "comment") break;
      spaces += tokens.shift()[1];
    }
    return spaces;
  }
  spacesFromEnd(tokens) {
    let lastTokenType;
    let spaces = "";
    while (tokens.length) {
      lastTokenType = tokens[tokens.length - 1][0];
      if (lastTokenType !== "space") break;
      spaces = tokens.pop()[1] + spaces;
    }
    return spaces;
  }
  stringFrom(tokens, from) {
    let result2 = "";
    for (let i2 = from; i2 < tokens.length; i2++) {
      result2 += tokens[i2][1];
    }
    tokens.splice(from, tokens.length - from);
    return result2;
  }
  unclosedBlock() {
    let pos = this.current.source.start;
    throw this.input.error("Unclosed block", pos.line, pos.column);
  }
  unclosedBracket(bracket) {
    throw this.input.error(
      "Unclosed bracket",
      { offset: bracket[2] },
      { offset: bracket[2] + 1 }
    );
  }
  unexpectedClose(token) {
    throw this.input.error(
      "Unexpected }",
      { offset: token[2] },
      { offset: token[2] + 1 }
    );
  }
  unknownWord(tokens) {
    throw this.input.error(
      "Unknown word",
      { offset: tokens[0][2] },
      { offset: tokens[0][2] + tokens[0][1].length }
    );
  }
  unnamedAtrule(node2, token) {
    throw this.input.error(
      "At-rule without name",
      { offset: token[2] },
      { offset: token[2] + token[1].length }
    );
  }
};
var parser = Parser$1;
let Container$2 = container;
let Parser22 = parser;
let Input$2 = input;
function parse$3(css, opts) {
  let input2 = new Input$2(css, opts);
  let parser2 = new Parser22(input2);
  try {
    parser2.parse();
  } catch (e2) {
    if (process.env.NODE_ENV !== "production") {
      if (e2.name === "CssSyntaxError" && opts && opts.from) {
        if (/\.scss$/i.test(opts.from)) {
          e2.message += "\nYou tried to parse SCSS with the standard CSS parser; try again with the postcss-scss parser";
        } else if (/\.sass/i.test(opts.from)) {
          e2.message += "\nYou tried to parse Sass with the standard CSS parser; try again with the postcss-sass parser";
        } else if (/\.less$/i.test(opts.from)) {
          e2.message += "\nYou tried to parse Less with the standard CSS parser; try again with the postcss-less parser";
        }
      }
    }
    throw e2;
  }
  return parser2.root;
}
var parse_1 = parse$3;
parse$3.default = parse$3;
Container$2.registerParse(parse$3);
let { isClean, my } = symbols;
let MapGenerator$1 = mapGenerator;
let stringify$2 = stringify_1;
let Container$1 = container;
let Document$2 = document$1;
let warnOnce$1 = warnOnce$2;
let Result$2 = result;
let parse$2 = parse_1;
let Root$3 = root;
const TYPE_TO_CLASS_NAME = {
  atrule: "AtRule",
  comment: "Comment",
  decl: "Declaration",
  document: "Document",
  root: "Root",
  rule: "Rule"
};
const PLUGIN_PROPS = {
  AtRule: true,
  AtRuleExit: true,
  Comment: true,
  CommentExit: true,
  Declaration: true,
  DeclarationExit: true,
  Document: true,
  DocumentExit: true,
  Once: true,
  OnceExit: true,
  postcssPlugin: true,
  prepare: true,
  Root: true,
  RootExit: true,
  Rule: true,
  RuleExit: true
};
const NOT_VISITORS = {
  Once: true,
  postcssPlugin: true,
  prepare: true
};
const CHILDREN = 0;
function isPromise(obj) {
  return typeof obj === "object" && typeof obj.then === "function";
}
function getEvents(node2) {
  let key = false;
  let type = TYPE_TO_CLASS_NAME[node2.type];
  if (node2.type === "decl") {
    key = node2.prop.toLowerCase();
  } else if (node2.type === "atrule") {
    key = node2.name.toLowerCase();
  }
  if (key && node2.append) {
    return [
      type,
      type + "-" + key,
      CHILDREN,
      type + "Exit",
      type + "Exit-" + key
    ];
  } else if (key) {
    return [type, type + "-" + key, type + "Exit", type + "Exit-" + key];
  } else if (node2.append) {
    return [type, CHILDREN, type + "Exit"];
  } else {
    return [type, type + "Exit"];
  }
}
function toStack(node2) {
  let events;
  if (node2.type === "document") {
    events = ["Document", CHILDREN, "DocumentExit"];
  } else if (node2.type === "root") {
    events = ["Root", CHILDREN, "RootExit"];
  } else {
    events = getEvents(node2);
  }
  return {
    eventIndex: 0,
    events,
    iterator: 0,
    node: node2,
    visitorIndex: 0,
    visitors: []
  };
}
function cleanMarks(node2) {
  node2[isClean] = false;
  if (node2.nodes) node2.nodes.forEach((i2) => cleanMarks(i2));
  return node2;
}
let postcss$2 = {};
let LazyResult$2 = class LazyResult2 {
  constructor(processor2, css, opts) {
    this.stringified = false;
    this.processed = false;
    let root2;
    if (typeof css === "object" && css !== null && (css.type === "root" || css.type === "document")) {
      root2 = cleanMarks(css);
    } else if (css instanceof LazyResult2 || css instanceof Result$2) {
      root2 = cleanMarks(css.root);
      if (css.map) {
        if (typeof opts.map === "undefined") opts.map = {};
        if (!opts.map.inline) opts.map.inline = false;
        opts.map.prev = css.map;
      }
    } else {
      let parser2 = parse$2;
      if (opts.syntax) parser2 = opts.syntax.parse;
      if (opts.parser) parser2 = opts.parser;
      if (parser2.parse) parser2 = parser2.parse;
      try {
        root2 = parser2(css, opts);
      } catch (error) {
        this.processed = true;
        this.error = error;
      }
      if (root2 && !root2[my]) {
        Container$1.rebuild(root2);
      }
    }
    this.result = new Result$2(processor2, root2, opts);
    this.helpers = { ...postcss$2, postcss: postcss$2, result: this.result };
    this.plugins = this.processor.plugins.map((plugin22) => {
      if (typeof plugin22 === "object" && plugin22.prepare) {
        return { ...plugin22, ...plugin22.prepare(this.result) };
      } else {
        return plugin22;
      }
    });
  }
  async() {
    if (this.error) return Promise.reject(this.error);
    if (this.processed) return Promise.resolve(this.result);
    if (!this.processing) {
      this.processing = this.runAsync();
    }
    return this.processing;
  }
  catch(onRejected) {
    return this.async().catch(onRejected);
  }
  finally(onFinally) {
    return this.async().then(onFinally, onFinally);
  }
  getAsyncError() {
    throw new Error("Use process(css).then(cb) to work with async plugins");
  }
  handleError(error, node2) {
    let plugin22 = this.result.lastPlugin;
    try {
      if (node2) node2.addToError(error);
      this.error = error;
      if (error.name === "CssSyntaxError" && !error.plugin) {
        error.plugin = plugin22.postcssPlugin;
        error.setMessage();
      } else if (plugin22.postcssVersion) {
        if (process.env.NODE_ENV !== "production") {
          let pluginName = plugin22.postcssPlugin;
          let pluginVer = plugin22.postcssVersion;
          let runtimeVer = this.result.processor.version;
          let a2 = pluginVer.split(".");
          let b = runtimeVer.split(".");
          if (a2[0] !== b[0] || parseInt(a2[1]) > parseInt(b[1])) {
            console.error(
              "Unknown error from PostCSS plugin. Your current PostCSS version is " + runtimeVer + ", but " + pluginName + " uses " + pluginVer + ". Perhaps this is the source of the error below."
            );
          }
        }
      }
    } catch (err) {
      if (console && console.error) console.error(err);
    }
    return error;
  }
  prepareVisitors() {
    this.listeners = {};
    let add = (plugin22, type, cb) => {
      if (!this.listeners[type]) this.listeners[type] = [];
      this.listeners[type].push([plugin22, cb]);
    };
    for (let plugin22 of this.plugins) {
      if (typeof plugin22 === "object") {
        for (let event in plugin22) {
          if (!PLUGIN_PROPS[event] && /^[A-Z]/.test(event)) {
            throw new Error(
              `Unknown event ${event} in ${plugin22.postcssPlugin}. Try to update PostCSS (${this.processor.version} now).`
            );
          }
          if (!NOT_VISITORS[event]) {
            if (typeof plugin22[event] === "object") {
              for (let filter in plugin22[event]) {
                if (filter === "*") {
                  add(plugin22, event, plugin22[event][filter]);
                } else {
                  add(
                    plugin22,
                    event + "-" + filter.toLowerCase(),
                    plugin22[event][filter]
                  );
                }
              }
            } else if (typeof plugin22[event] === "function") {
              add(plugin22, event, plugin22[event]);
            }
          }
        }
      }
    }
    this.hasListener = Object.keys(this.listeners).length > 0;
  }
  async runAsync() {
    this.plugin = 0;
    for (let i2 = 0; i2 < this.plugins.length; i2++) {
      let plugin22 = this.plugins[i2];
      let promise = this.runOnRoot(plugin22);
      if (isPromise(promise)) {
        try {
          await promise;
        } catch (error) {
          throw this.handleError(error);
        }
      }
    }
    this.prepareVisitors();
    if (this.hasListener) {
      let root2 = this.result.root;
      while (!root2[isClean]) {
        root2[isClean] = true;
        let stack = [toStack(root2)];
        while (stack.length > 0) {
          let promise = this.visitTick(stack);
          if (isPromise(promise)) {
            try {
              await promise;
            } catch (e2) {
              let node2 = stack[stack.length - 1].node;
              throw this.handleError(e2, node2);
            }
          }
        }
      }
      if (this.listeners.OnceExit) {
        for (let [plugin22, visitor] of this.listeners.OnceExit) {
          this.result.lastPlugin = plugin22;
          try {
            if (root2.type === "document") {
              let roots = root2.nodes.map(
                (subRoot) => visitor(subRoot, this.helpers)
              );
              await Promise.all(roots);
            } else {
              await visitor(root2, this.helpers);
            }
          } catch (e2) {
            throw this.handleError(e2);
          }
        }
      }
    }
    this.processed = true;
    return this.stringify();
  }
  runOnRoot(plugin22) {
    this.result.lastPlugin = plugin22;
    try {
      if (typeof plugin22 === "object" && plugin22.Once) {
        if (this.result.root.type === "document") {
          let roots = this.result.root.nodes.map(
            (root2) => plugin22.Once(root2, this.helpers)
          );
          if (isPromise(roots[0])) {
            return Promise.all(roots);
          }
          return roots;
        }
        return plugin22.Once(this.result.root, this.helpers);
      } else if (typeof plugin22 === "function") {
        return plugin22(this.result.root, this.result);
      }
    } catch (error) {
      throw this.handleError(error);
    }
  }
  stringify() {
    if (this.error) throw this.error;
    if (this.stringified) return this.result;
    this.stringified = true;
    this.sync();
    let opts = this.result.opts;
    let str = stringify$2;
    if (opts.syntax) str = opts.syntax.stringify;
    if (opts.stringifier) str = opts.stringifier;
    if (str.stringify) str = str.stringify;
    let map = new MapGenerator$1(str, this.result.root, this.result.opts);
    let data = map.generate();
    this.result.css = data[0];
    this.result.map = data[1];
    return this.result;
  }
  sync() {
    if (this.error) throw this.error;
    if (this.processed) return this.result;
    this.processed = true;
    if (this.processing) {
      throw this.getAsyncError();
    }
    for (let plugin22 of this.plugins) {
      let promise = this.runOnRoot(plugin22);
      if (isPromise(promise)) {
        throw this.getAsyncError();
      }
    }
    this.prepareVisitors();
    if (this.hasListener) {
      let root2 = this.result.root;
      while (!root2[isClean]) {
        root2[isClean] = true;
        this.walkSync(root2);
      }
      if (this.listeners.OnceExit) {
        if (root2.type === "document") {
          for (let subRoot of root2.nodes) {
            this.visitSync(this.listeners.OnceExit, subRoot);
          }
        } else {
          this.visitSync(this.listeners.OnceExit, root2);
        }
      }
    }
    return this.result;
  }
  then(onFulfilled, onRejected) {
    if (process.env.NODE_ENV !== "production") {
      if (!("from" in this.opts)) {
        warnOnce$1(
          "Without `from` option PostCSS could generate wrong source map and will not find Browserslist config. Set it to CSS file path or to `undefined` to prevent this warning."
        );
      }
    }
    return this.async().then(onFulfilled, onRejected);
  }
  toString() {
    return this.css;
  }
  visitSync(visitors, node2) {
    for (let [plugin22, visitor] of visitors) {
      this.result.lastPlugin = plugin22;
      let promise;
      try {
        promise = visitor(node2, this.helpers);
      } catch (e2) {
        throw this.handleError(e2, node2.proxyOf);
      }
      if (node2.type !== "root" && node2.type !== "document" && !node2.parent) {
        return true;
      }
      if (isPromise(promise)) {
        throw this.getAsyncError();
      }
    }
  }
  visitTick(stack) {
    let visit2 = stack[stack.length - 1];
    let { node: node2, visitors } = visit2;
    if (node2.type !== "root" && node2.type !== "document" && !node2.parent) {
      stack.pop();
      return;
    }
    if (visitors.length > 0 && visit2.visitorIndex < visitors.length) {
      let [plugin22, visitor] = visitors[visit2.visitorIndex];
      visit2.visitorIndex += 1;
      if (visit2.visitorIndex === visitors.length) {
        visit2.visitors = [];
        visit2.visitorIndex = 0;
      }
      this.result.lastPlugin = plugin22;
      try {
        return visitor(node2.toProxy(), this.helpers);
      } catch (e2) {
        throw this.handleError(e2, node2);
      }
    }
    if (visit2.iterator !== 0) {
      let iterator = visit2.iterator;
      let child;
      while (child = node2.nodes[node2.indexes[iterator]]) {
        node2.indexes[iterator] += 1;
        if (!child[isClean]) {
          child[isClean] = true;
          stack.push(toStack(child));
          return;
        }
      }
      visit2.iterator = 0;
      delete node2.indexes[iterator];
    }
    let events = visit2.events;
    while (visit2.eventIndex < events.length) {
      let event = events[visit2.eventIndex];
      visit2.eventIndex += 1;
      if (event === CHILDREN) {
        if (node2.nodes && node2.nodes.length) {
          node2[isClean] = true;
          visit2.iterator = node2.getIterator();
        }
        return;
      } else if (this.listeners[event]) {
        visit2.visitors = this.listeners[event];
        return;
      }
    }
    stack.pop();
  }
  walkSync(node2) {
    node2[isClean] = true;
    let events = getEvents(node2);
    for (let event of events) {
      if (event === CHILDREN) {
        if (node2.nodes) {
          node2.each((child) => {
            if (!child[isClean]) this.walkSync(child);
          });
        }
      } else {
        let visitors = this.listeners[event];
        if (visitors) {
          if (this.visitSync(visitors, node2.toProxy())) return;
        }
      }
    }
  }
  warnings() {
    return this.sync().warnings();
  }
  get content() {
    return this.stringify().content;
  }
  get css() {
    return this.stringify().css;
  }
  get map() {
    return this.stringify().map;
  }
  get messages() {
    return this.sync().messages;
  }
  get opts() {
    return this.result.opts;
  }
  get processor() {
    return this.result.processor;
  }
  get root() {
    return this.sync().root;
  }
  get [Symbol.toStringTag]() {
    return "LazyResult";
  }
};
LazyResult$2.registerPostcss = (dependant) => {
  postcss$2 = dependant;
};
var lazyResult = LazyResult$2;
LazyResult$2.default = LazyResult$2;
Root$3.registerLazyResult(LazyResult$2);
Document$2.registerLazyResult(LazyResult$2);
let MapGenerator22 = mapGenerator;
let stringify$1 = stringify_1;
let warnOnce22 = warnOnce$2;
let parse$1 = parse_1;
const Result$1 = result;
let NoWorkResult$1 = class NoWorkResult2 {
  constructor(processor2, css, opts) {
    css = css.toString();
    this.stringified = false;
    this._processor = processor2;
    this._css = css;
    this._opts = opts;
    this._map = void 0;
    let root2;
    let str = stringify$1;
    this.result = new Result$1(this._processor, root2, this._opts);
    this.result.css = css;
    let self = this;
    Object.defineProperty(this.result, "root", {
      get() {
        return self.root;
      }
    });
    let map = new MapGenerator22(str, root2, this._opts, css);
    if (map.isMap()) {
      let [generatedCSS, generatedMap] = map.generate();
      if (generatedCSS) {
        this.result.css = generatedCSS;
      }
      if (generatedMap) {
        this.result.map = generatedMap;
      }
    } else {
      map.clearAnnotation();
      this.result.css = map.css;
    }
  }
  async() {
    if (this.error) return Promise.reject(this.error);
    return Promise.resolve(this.result);
  }
  catch(onRejected) {
    return this.async().catch(onRejected);
  }
  finally(onFinally) {
    return this.async().then(onFinally, onFinally);
  }
  sync() {
    if (this.error) throw this.error;
    return this.result;
  }
  then(onFulfilled, onRejected) {
    if (process.env.NODE_ENV !== "production") {
      if (!("from" in this._opts)) {
        warnOnce22(
          "Without `from` option PostCSS could generate wrong source map and will not find Browserslist config. Set it to CSS file path or to `undefined` to prevent this warning."
        );
      }
    }
    return this.async().then(onFulfilled, onRejected);
  }
  toString() {
    return this._css;
  }
  warnings() {
    return [];
  }
  get content() {
    return this.result.css;
  }
  get css() {
    return this.result.css;
  }
  get map() {
    return this.result.map;
  }
  get messages() {
    return [];
  }
  get opts() {
    return this.result.opts;
  }
  get processor() {
    return this.result.processor;
  }
  get root() {
    if (this._root) {
      return this._root;
    }
    let root2;
    let parser2 = parse$1;
    try {
      root2 = parser2(this._css, this._opts);
    } catch (error) {
      this.error = error;
    }
    if (this.error) {
      throw this.error;
    } else {
      this._root = root2;
      return root2;
    }
  }
  get [Symbol.toStringTag]() {
    return "NoWorkResult";
  }
};
var noWorkResult = NoWorkResult$1;
NoWorkResult$1.default = NoWorkResult$1;
let NoWorkResult22 = noWorkResult;
let LazyResult$1 = lazyResult;
let Document$1 = document$1;
let Root$2 = root;
let Processor$1 = class Processor2 {
  constructor(plugins = []) {
    this.version = "8.4.38";
    this.plugins = this.normalize(plugins);
  }
  normalize(plugins) {
    let normalized = [];
    for (let i2 of plugins) {
      if (i2.postcss === true) {
        i2 = i2();
      } else if (i2.postcss) {
        i2 = i2.postcss;
      }
      if (typeof i2 === "object" && Array.isArray(i2.plugins)) {
        normalized = normalized.concat(i2.plugins);
      } else if (typeof i2 === "object" && i2.postcssPlugin) {
        normalized.push(i2);
      } else if (typeof i2 === "function") {
        normalized.push(i2);
      } else if (typeof i2 === "object" && (i2.parse || i2.stringify)) {
        if (process.env.NODE_ENV !== "production") {
          throw new Error(
            "PostCSS syntaxes cannot be used as plugins. Instead, please use one of the syntax/parser/stringifier options as outlined in your PostCSS runner documentation."
          );
        }
      } else {
        throw new Error(i2 + " is not a PostCSS plugin");
      }
    }
    return normalized;
  }
  process(css, opts = {}) {
    if (!this.plugins.length && !opts.parser && !opts.stringifier && !opts.syntax) {
      return new NoWorkResult22(this, css, opts);
    } else {
      return new LazyResult$1(this, css, opts);
    }
  }
  use(plugin22) {
    this.plugins = this.plugins.concat(this.normalize([plugin22]));
    return this;
  }
};
var processor = Processor$1;
Processor$1.default = Processor$1;
Root$2.registerProcessor(Processor$1);
Document$1.registerProcessor(Processor$1);
let Declaration$1 = declaration;
let PreviousMap22 = previousMap;
let Comment$1 = comment;
let AtRule$1 = atRule;
let Input$1 = input;
let Root$1 = root;
let Rule$1 = rule;
function fromJSON$1(json, inputs) {
  if (Array.isArray(json)) return json.map((n2) => fromJSON$1(n2));
  let { inputs: ownInputs, ...defaults } = json;
  if (ownInputs) {
    inputs = [];
    for (let input2 of ownInputs) {
      let inputHydrated = { ...input2, __proto__: Input$1.prototype };
      if (inputHydrated.map) {
        inputHydrated.map = {
          ...inputHydrated.map,
          __proto__: PreviousMap22.prototype
        };
      }
      inputs.push(inputHydrated);
    }
  }
  if (defaults.nodes) {
    defaults.nodes = json.nodes.map((n2) => fromJSON$1(n2, inputs));
  }
  if (defaults.source) {
    let { inputId, ...source } = defaults.source;
    defaults.source = source;
    if (inputId != null) {
      defaults.source.input = inputs[inputId];
    }
  }
  if (defaults.type === "root") {
    return new Root$1(defaults);
  } else if (defaults.type === "decl") {
    return new Declaration$1(defaults);
  } else if (defaults.type === "rule") {
    return new Rule$1(defaults);
  } else if (defaults.type === "comment") {
    return new Comment$1(defaults);
  } else if (defaults.type === "atrule") {
    return new AtRule$1(defaults);
  } else {
    throw new Error("Unknown node type: " + json.type);
  }
}
var fromJSON_1 = fromJSON$1;
fromJSON$1.default = fromJSON$1;
let CssSyntaxError22 = cssSyntaxError;
let Declaration22 = declaration;
let LazyResult22 = lazyResult;
let Container22 = container;
let Processor22 = processor;
let stringify = stringify_1;
let fromJSON = fromJSON_1;
let Document222 = document$1;
let Warning22 = warning;
let Comment22 = comment;
let AtRule22 = atRule;
let Result22 = result;
let Input22 = input;
let parse = parse_1;
let list = list_1;
let Rule22 = rule;
let Root22 = root;
let Node22 = node;
function postcss(...plugins) {
  if (plugins.length === 1 && Array.isArray(plugins[0])) {
    plugins = plugins[0];
  }
  return new Processor22(plugins);
}
postcss.plugin = function plugin2(name, initializer) {
  let warningPrinted = false;
  function creator(...args) {
    if (console && console.warn && !warningPrinted) {
      warningPrinted = true;
      console.warn(
        name + ": postcss.plugin was deprecated. Migration guide:\nhttps://evilmartians.com/chronicles/postcss-8-plugin-migration"
      );
      if (process.env.LANG && process.env.LANG.startsWith("cn")) {
        console.warn(
          name + ": 里面 postcss.plugin 被弃用. 迁移指南:\nhttps://www.w3ctech.com/topic/2226"
        );
      }
    }
    let transformer = initializer(...args);
    transformer.postcssPlugin = name;
    transformer.postcssVersion = new Processor22().version;
    return transformer;
  }
  let cache;
  Object.defineProperty(creator, "postcss", {
    get() {
      if (!cache) cache = creator();
      return cache;
    }
  });
  creator.process = function(css, processOpts, pluginOpts) {
    return postcss([creator(pluginOpts)]).process(css, processOpts);
  };
  return creator;
};
postcss.stringify = stringify;
postcss.parse = parse;
postcss.fromJSON = fromJSON;
postcss.list = list;
postcss.comment = (defaults) => new Comment22(defaults);
postcss.atRule = (defaults) => new AtRule22(defaults);
postcss.decl = (defaults) => new Declaration22(defaults);
postcss.rule = (defaults) => new Rule22(defaults);
postcss.root = (defaults) => new Root22(defaults);
postcss.document = (defaults) => new Document222(defaults);
postcss.CssSyntaxError = CssSyntaxError22;
postcss.Declaration = Declaration22;
postcss.Container = Container22;
postcss.Processor = Processor22;
postcss.Document = Document222;
postcss.Comment = Comment22;
postcss.Warning = Warning22;
postcss.AtRule = AtRule22;
postcss.Result = Result22;
postcss.Input = Input22;
postcss.Rule = Rule22;
postcss.Root = Root22;
postcss.Node = Node22;
LazyResult22.registerPostcss(postcss);
var postcss_1 = postcss;
postcss.default = postcss;
const postcss$1 = /* @__PURE__ */ getDefaultExportFromCjs(postcss_1);
postcss$1.stringify;
postcss$1.fromJSON;
postcss$1.plugin;
postcss$1.parse;
postcss$1.list;
postcss$1.document;
postcss$1.comment;
postcss$1.atRule;
postcss$1.rule;
postcss$1.decl;
postcss$1.root;
postcss$1.CssSyntaxError;
postcss$1.Declaration;
postcss$1.Container;
postcss$1.Processor;
postcss$1.Document;
postcss$1.Comment;
postcss$1.Warning;
postcss$1.AtRule;
postcss$1.Result;
postcss$1.Input;
postcss$1.Rule;
postcss$1.Root;
postcss$1.Node;
class BaseRRNode {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  constructor(..._args) {
    __publicField2(this, "parentElement", null);
    __publicField2(this, "parentNode", null);
    __publicField2(this, "ownerDocument");
    __publicField2(this, "firstChild", null);
    __publicField2(this, "lastChild", null);
    __publicField2(this, "previousSibling", null);
    __publicField2(this, "nextSibling", null);
    __publicField2(this, "ELEMENT_NODE", 1);
    __publicField2(this, "TEXT_NODE", 3);
    __publicField2(this, "nodeType");
    __publicField2(this, "nodeName");
    __publicField2(this, "RRNodeType");
  }
  get childNodes() {
    const childNodes2 = [];
    let childIterator = this.firstChild;
    while (childIterator) {
      childNodes2.push(childIterator);
      childIterator = childIterator.nextSibling;
    }
    return childNodes2;
  }
  contains(node2) {
    if (!(node2 instanceof BaseRRNode)) return false;
    else if (node2.ownerDocument !== this.ownerDocument) return false;
    else if (node2 === this) return true;
    while (node2.parentNode) {
      if (node2.parentNode === this) return true;
      node2 = node2.parentNode;
    }
    return false;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  appendChild(_newChild) {
    throw new Error(
      `RRDomException: Failed to execute 'appendChild' on 'RRNode': This RRNode type does not support this method.`
    );
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  insertBefore(_newChild, _refChild) {
    throw new Error(
      `RRDomException: Failed to execute 'insertBefore' on 'RRNode': This RRNode type does not support this method.`
    );
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  removeChild(_node) {
    throw new Error(
      `RRDomException: Failed to execute 'removeChild' on 'RRNode': This RRNode type does not support this method.`
    );
  }
  toString() {
    return "RRNode";
  }
}
const testableAccessors = {
  Node: ["childNodes", "parentNode", "parentElement", "textContent"],
  ShadowRoot: ["host", "styleSheets"],
  Element: ["shadowRoot", "querySelector", "querySelectorAll"],
  MutationObserver: []
};
const testableMethods = {
  Node: ["contains", "getRootNode"],
  ShadowRoot: ["getSelection"],
  Element: [],
  MutationObserver: ["constructor"]
};
const untaintedBasePrototype = {};
const isAngularZonePresent = () => {
  return !!globalThis.Zone;
};
function getUntaintedPrototype(key) {
  if (untaintedBasePrototype[key])
    return untaintedBasePrototype[key];
  const defaultObj = globalThis[key];
  const defaultPrototype = defaultObj.prototype;
  const accessorNames = key in testableAccessors ? testableAccessors[key] : void 0;
  const isUntaintedAccessors = Boolean(
    accessorNames && // @ts-expect-error 2345
    accessorNames.every(
      (accessor) => {
        var _a2, _b;
        return Boolean(
          (_b = (_a2 = Object.getOwnPropertyDescriptor(defaultPrototype, accessor)) == null ? void 0 : _a2.get) == null ? void 0 : _b.toString().includes("[native code]")
        );
      }
    )
  );
  const methodNames = key in testableMethods ? testableMethods[key] : void 0;
  const isUntaintedMethods = Boolean(
    methodNames && methodNames.every(
      // @ts-expect-error 2345
      (method) => {
        var _a2;
        return typeof defaultPrototype[method] === "function" && ((_a2 = defaultPrototype[method]) == null ? void 0 : _a2.toString().includes("[native code]"));
      }
    )
  );
  if (isUntaintedAccessors && isUntaintedMethods && !isAngularZonePresent()) {
    untaintedBasePrototype[key] = defaultObj.prototype;
    return defaultObj.prototype;
  }
  try {
    const iframeEl = document.createElement("iframe");
    document.body.appendChild(iframeEl);
    const win = iframeEl.contentWindow;
    if (!win) return defaultObj.prototype;
    const untaintedObject = win[key].prototype;
    document.body.removeChild(iframeEl);
    if (!untaintedObject) return defaultPrototype;
    return untaintedBasePrototype[key] = untaintedObject;
  } catch {
    return defaultPrototype;
  }
}
const untaintedAccessorCache = {};
function getUntaintedAccessor(key, instance, accessor) {
  var _a2;
  const cacheKey = `${key}.${String(accessor)}`;
  if (untaintedAccessorCache[cacheKey])
    return untaintedAccessorCache[cacheKey].call(
      instance
    );
  const untaintedPrototype = getUntaintedPrototype(key);
  const untaintedAccessor = (_a2 = Object.getOwnPropertyDescriptor(
    untaintedPrototype,
    accessor
  )) == null ? void 0 : _a2.get;
  if (!untaintedAccessor) return instance[accessor];
  untaintedAccessorCache[cacheKey] = untaintedAccessor;
  return untaintedAccessor.call(instance);
}
const untaintedMethodCache = {};
function getUntaintedMethod(key, instance, method) {
  const cacheKey = `${key}.${String(method)}`;
  if (untaintedMethodCache[cacheKey])
    return untaintedMethodCache[cacheKey].bind(
      instance
    );
  const untaintedPrototype = getUntaintedPrototype(key);
  const untaintedMethod = untaintedPrototype[method];
  if (typeof untaintedMethod !== "function") return instance[method];
  untaintedMethodCache[cacheKey] = untaintedMethod;
  return untaintedMethod.bind(instance);
}
function childNodes(n2) {
  return getUntaintedAccessor("Node", n2, "childNodes");
}
function parentNode(n2) {
  return getUntaintedAccessor("Node", n2, "parentNode");
}
function parentElement(n2) {
  return getUntaintedAccessor("Node", n2, "parentElement");
}
function textContent(n2) {
  return getUntaintedAccessor("Node", n2, "textContent");
}
function contains(n2, other) {
  return getUntaintedMethod("Node", n2, "contains")(other);
}
function getRootNode(n2) {
  return getUntaintedMethod("Node", n2, "getRootNode")();
}
function host(n2) {
  if (!n2 || !("host" in n2)) return null;
  return getUntaintedAccessor("ShadowRoot", n2, "host");
}
function styleSheets(n2) {
  return n2.styleSheets;
}
function shadowRoot(n2) {
  if (!n2 || !("shadowRoot" in n2)) return null;
  return getUntaintedAccessor("Element", n2, "shadowRoot");
}
function querySelector(n2, selectors) {
  return getUntaintedAccessor("Element", n2, "querySelector")(selectors);
}
function querySelectorAll(n2, selectors) {
  return getUntaintedAccessor("Element", n2, "querySelectorAll")(selectors);
}
function mutationObserverCtor() {
  return getUntaintedPrototype("MutationObserver").constructor;
}
const index = {
  childNodes,
  parentNode,
  parentElement,
  textContent,
  contains,
  getRootNode,
  host,
  styleSheets,
  shadowRoot,
  querySelector,
  querySelectorAll,
  mutationObserver: mutationObserverCtor
};
function on(type, fn, target = document) {
  const options = { capture: true, passive: true };
  target.addEventListener(type, fn, options);
  return () => target.removeEventListener(type, fn, options);
}
const DEPARTED_MIRROR_ACCESS_WARNING = "Please stop import mirror directly. Instead of that,\r\nnow you can use replayer.getMirror() to access the mirror instance of a replayer,\r\nor you can use record.mirror to access the mirror instance during recording.";
let _mirror = {
  map: {},
  getId() {
    console.error(DEPARTED_MIRROR_ACCESS_WARNING);
    return -1;
  },
  getNode() {
    console.error(DEPARTED_MIRROR_ACCESS_WARNING);
    return null;
  },
  removeNodeFromMap() {
    console.error(DEPARTED_MIRROR_ACCESS_WARNING);
  },
  has() {
    console.error(DEPARTED_MIRROR_ACCESS_WARNING);
    return false;
  },
  reset() {
    console.error(DEPARTED_MIRROR_ACCESS_WARNING);
  }
};
if (typeof window !== "undefined" && window.Proxy && window.Reflect) {
  _mirror = new Proxy(_mirror, {
    get(target, prop, receiver) {
      if (prop === "map") {
        console.error(DEPARTED_MIRROR_ACCESS_WARNING);
      }
      return Reflect.get(target, prop, receiver);
    }
  });
}
function throttle(func, wait, options = {}) {
  let timeout = null;
  let previous = 0;
  return function(...args) {
    const now = Date.now();
    if (!previous && options.leading === false) {
      previous = now;
    }
    const remaining = wait - (now - previous);
    const context = this;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      func.apply(context, args);
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(() => {
        previous = options.leading === false ? 0 : Date.now();
        timeout = null;
        func.apply(context, args);
      }, remaining);
    }
  };
}
function hookSetter(target, key, d, isRevoked, win = window) {
  const original = win.Object.getOwnPropertyDescriptor(target, key);
  win.Object.defineProperty(
    target,
    key,
    isRevoked ? d : {
      set(value) {
        setTimeout(() => {
          d.set.call(this, value);
        }, 0);
        if (original && original.set) {
          original.set.call(this, value);
        }
      }
    }
  );
  return () => hookSetter(target, key, original || {}, true);
}
function patch(source, name, replacement) {
  try {
    if (!(name in source)) {
      return () => {
      };
    }
    const original = source[name];
    const wrapped = replacement(original);
    if (typeof wrapped === "function") {
      wrapped.prototype = wrapped.prototype || {};
      Object.defineProperties(wrapped, {
        __rrweb_original__: {
          enumerable: false,
          value: original
        }
      });
    }
    source[name] = wrapped;
    return () => {
      source[name] = original;
    };
  } catch {
    return () => {
    };
  }
}
let nowTimestamp = Date.now;
if (!/* @__PURE__ */ /[1-9][0-9]{12}/.test(Date.now().toString())) {
  nowTimestamp = () => (/* @__PURE__ */ new Date()).getTime();
}
function getWindowScroll(win) {
  var _a2, _b, _c, _d;
  const doc = win.document;
  return {
    left: doc.scrollingElement ? doc.scrollingElement.scrollLeft : win.pageXOffset !== void 0 ? win.pageXOffset : doc.documentElement.scrollLeft || (doc == null ? void 0 : doc.body) && ((_a2 = index.parentElement(doc.body)) == null ? void 0 : _a2.scrollLeft) || ((_b = doc == null ? void 0 : doc.body) == null ? void 0 : _b.scrollLeft) || 0,
    top: doc.scrollingElement ? doc.scrollingElement.scrollTop : win.pageYOffset !== void 0 ? win.pageYOffset : (doc == null ? void 0 : doc.documentElement.scrollTop) || (doc == null ? void 0 : doc.body) && ((_c = index.parentElement(doc.body)) == null ? void 0 : _c.scrollTop) || ((_d = doc == null ? void 0 : doc.body) == null ? void 0 : _d.scrollTop) || 0
  };
}
function getWindowHeight() {
  return window.innerHeight || document.documentElement && document.documentElement.clientHeight || document.body && document.body.clientHeight;
}
function getWindowWidth() {
  return window.innerWidth || document.documentElement && document.documentElement.clientWidth || document.body && document.body.clientWidth;
}
function closestElementOfNode(node2) {
  if (!node2) {
    return null;
  }
  const el = node2.nodeType === node2.ELEMENT_NODE ? node2 : index.parentElement(node2);
  return el;
}
function isBlocked(node2, blockClass, blockSelector, checkAncestors) {
  if (!node2) {
    return false;
  }
  const el = closestElementOfNode(node2);
  if (!el) {
    return false;
  }
  try {
    if (typeof blockClass === "string") {
      if (el.classList.contains(blockClass)) return true;
      if (checkAncestors && el.closest("." + blockClass) !== null) return true;
    } else {
      if (classMatchesRegex(el, blockClass, checkAncestors)) return true;
    }
  } catch (e2) {
  }
  if (blockSelector) {
    if (el.matches(blockSelector)) return true;
    if (checkAncestors && el.closest(blockSelector) !== null) return true;
  }
  return false;
}
function isSerialized(n2, mirror2) {
  return mirror2.getId(n2) !== -1;
}
function isIgnored(n2, mirror2, slimDOMOptions) {
  if (n2.tagName === "TITLE" && slimDOMOptions.headTitleMutations) {
    return true;
  }
  return mirror2.getId(n2) === IGNORED_NODE;
}
function isAncestorRemoved(target, mirror2) {
  if (isShadowRoot(target)) {
    return false;
  }
  const id = mirror2.getId(target);
  if (!mirror2.has(id)) {
    return true;
  }
  const parent = index.parentNode(target);
  if (parent && parent.nodeType === target.DOCUMENT_NODE) {
    return false;
  }
  if (!parent) {
    return true;
  }
  return isAncestorRemoved(parent, mirror2);
}
function legacy_isTouchEvent(event) {
  return Boolean(event.changedTouches);
}
function polyfill$1(win = window) {
  if ("NodeList" in win && !win.NodeList.prototype.forEach) {
    win.NodeList.prototype.forEach = Array.prototype.forEach;
  }
  if ("DOMTokenList" in win && !win.DOMTokenList.prototype.forEach) {
    win.DOMTokenList.prototype.forEach = Array.prototype.forEach;
  }
}
function isSerializedIframe(n2, mirror2) {
  return Boolean(n2.nodeName === "IFRAME" && mirror2.getMeta(n2));
}
function isSerializedStylesheet(n2, mirror2) {
  return Boolean(
    n2.nodeName === "LINK" && n2.nodeType === n2.ELEMENT_NODE && n2.getAttribute && n2.getAttribute("rel") === "stylesheet" && mirror2.getMeta(n2)
  );
}
function hasShadowRoot(n2) {
  if (!n2) return false;
  if (n2 instanceof BaseRRNode && "shadowRoot" in n2) {
    return Boolean(n2.shadowRoot);
  }
  return Boolean(index.shadowRoot(n2));
}
class StyleSheetMirror {
  constructor() {
    __publicField(this, "id", 1);
    __publicField(this, "styleIDMap", /* @__PURE__ */ new WeakMap());
    __publicField(this, "idStyleMap", /* @__PURE__ */ new Map());
  }
  getId(stylesheet) {
    return this.styleIDMap.get(stylesheet) ?? -1;
  }
  has(stylesheet) {
    return this.styleIDMap.has(stylesheet);
  }
  /**
   * @returns If the stylesheet is in the mirror, returns the id of the stylesheet. If not, return the new assigned id.
   */
  add(stylesheet, id) {
    if (this.has(stylesheet)) return this.getId(stylesheet);
    let newId;
    if (id === void 0) {
      newId = this.id++;
    } else newId = id;
    this.styleIDMap.set(stylesheet, newId);
    this.idStyleMap.set(newId, stylesheet);
    return newId;
  }
  getStyle(id) {
    return this.idStyleMap.get(id) || null;
  }
  reset() {
    this.styleIDMap = /* @__PURE__ */ new WeakMap();
    this.idStyleMap = /* @__PURE__ */ new Map();
    this.id = 1;
  }
  generateId() {
    return this.id++;
  }
}
function getShadowHost(n2) {
  var _a2;
  let shadowHost = null;
  if ("getRootNode" in n2 && ((_a2 = index.getRootNode(n2)) == null ? void 0 : _a2.nodeType) === Node.DOCUMENT_FRAGMENT_NODE && index.host(index.getRootNode(n2)))
    shadowHost = index.host(index.getRootNode(n2));
  return shadowHost;
}
function getRootShadowHost(n2) {
  let rootShadowHost = n2;
  let shadowHost;
  while (shadowHost = getShadowHost(rootShadowHost))
    rootShadowHost = shadowHost;
  return rootShadowHost;
}
function shadowHostInDom(n2) {
  const doc = n2.ownerDocument;
  if (!doc) return false;
  const shadowHost = getRootShadowHost(n2);
  return index.contains(doc, shadowHost);
}
function inDom(n2) {
  const doc = n2.ownerDocument;
  if (!doc) return false;
  return index.contains(doc, n2) || shadowHostInDom(n2);
}
var EventType = /* @__PURE__ */ ((EventType2) => {
  EventType2[EventType2["DomContentLoaded"] = 0] = "DomContentLoaded";
  EventType2[EventType2["Load"] = 1] = "Load";
  EventType2[EventType2["FullSnapshot"] = 2] = "FullSnapshot";
  EventType2[EventType2["IncrementalSnapshot"] = 3] = "IncrementalSnapshot";
  EventType2[EventType2["Meta"] = 4] = "Meta";
  EventType2[EventType2["Custom"] = 5] = "Custom";
  EventType2[EventType2["Plugin"] = 6] = "Plugin";
  return EventType2;
})(EventType || {});
var IncrementalSource = /* @__PURE__ */ ((IncrementalSource2) => {
  IncrementalSource2[IncrementalSource2["Mutation"] = 0] = "Mutation";
  IncrementalSource2[IncrementalSource2["MouseMove"] = 1] = "MouseMove";
  IncrementalSource2[IncrementalSource2["MouseInteraction"] = 2] = "MouseInteraction";
  IncrementalSource2[IncrementalSource2["Scroll"] = 3] = "Scroll";
  IncrementalSource2[IncrementalSource2["ViewportResize"] = 4] = "ViewportResize";
  IncrementalSource2[IncrementalSource2["Input"] = 5] = "Input";
  IncrementalSource2[IncrementalSource2["TouchMove"] = 6] = "TouchMove";
  IncrementalSource2[IncrementalSource2["MediaInteraction"] = 7] = "MediaInteraction";
  IncrementalSource2[IncrementalSource2["StyleSheetRule"] = 8] = "StyleSheetRule";
  IncrementalSource2[IncrementalSource2["CanvasMutation"] = 9] = "CanvasMutation";
  IncrementalSource2[IncrementalSource2["Font"] = 10] = "Font";
  IncrementalSource2[IncrementalSource2["Log"] = 11] = "Log";
  IncrementalSource2[IncrementalSource2["Drag"] = 12] = "Drag";
  IncrementalSource2[IncrementalSource2["StyleDeclaration"] = 13] = "StyleDeclaration";
  IncrementalSource2[IncrementalSource2["Selection"] = 14] = "Selection";
  IncrementalSource2[IncrementalSource2["AdoptedStyleSheet"] = 15] = "AdoptedStyleSheet";
  IncrementalSource2[IncrementalSource2["CustomElement"] = 16] = "CustomElement";
  return IncrementalSource2;
})(IncrementalSource || {});
var MouseInteractions = /* @__PURE__ */ ((MouseInteractions2) => {
  MouseInteractions2[MouseInteractions2["MouseUp"] = 0] = "MouseUp";
  MouseInteractions2[MouseInteractions2["MouseDown"] = 1] = "MouseDown";
  MouseInteractions2[MouseInteractions2["Click"] = 2] = "Click";
  MouseInteractions2[MouseInteractions2["ContextMenu"] = 3] = "ContextMenu";
  MouseInteractions2[MouseInteractions2["DblClick"] = 4] = "DblClick";
  MouseInteractions2[MouseInteractions2["Focus"] = 5] = "Focus";
  MouseInteractions2[MouseInteractions2["Blur"] = 6] = "Blur";
  MouseInteractions2[MouseInteractions2["TouchStart"] = 7] = "TouchStart";
  MouseInteractions2[MouseInteractions2["TouchMove_Departed"] = 8] = "TouchMove_Departed";
  MouseInteractions2[MouseInteractions2["TouchEnd"] = 9] = "TouchEnd";
  MouseInteractions2[MouseInteractions2["TouchCancel"] = 10] = "TouchCancel";
  return MouseInteractions2;
})(MouseInteractions || {});
var PointerTypes = /* @__PURE__ */ ((PointerTypes2) => {
  PointerTypes2[PointerTypes2["Mouse"] = 0] = "Mouse";
  PointerTypes2[PointerTypes2["Pen"] = 1] = "Pen";
  PointerTypes2[PointerTypes2["Touch"] = 2] = "Touch";
  return PointerTypes2;
})(PointerTypes || {});
var CanvasContext = /* @__PURE__ */ ((CanvasContext2) => {
  CanvasContext2[CanvasContext2["2D"] = 0] = "2D";
  CanvasContext2[CanvasContext2["WebGL"] = 1] = "WebGL";
  CanvasContext2[CanvasContext2["WebGL2"] = 2] = "WebGL2";
  return CanvasContext2;
})(CanvasContext || {});
var MediaInteractions = /* @__PURE__ */ ((MediaInteractions2) => {
  MediaInteractions2[MediaInteractions2["Play"] = 0] = "Play";
  MediaInteractions2[MediaInteractions2["Pause"] = 1] = "Pause";
  MediaInteractions2[MediaInteractions2["Seeked"] = 2] = "Seeked";
  MediaInteractions2[MediaInteractions2["VolumeChange"] = 3] = "VolumeChange";
  MediaInteractions2[MediaInteractions2["RateChange"] = 4] = "RateChange";
  return MediaInteractions2;
})(MediaInteractions || {});
var NodeType = /* @__PURE__ */ ((NodeType2) => {
  NodeType2[NodeType2["Document"] = 0] = "Document";
  NodeType2[NodeType2["DocumentType"] = 1] = "DocumentType";
  NodeType2[NodeType2["Element"] = 2] = "Element";
  NodeType2[NodeType2["Text"] = 3] = "Text";
  NodeType2[NodeType2["CDATA"] = 4] = "CDATA";
  NodeType2[NodeType2["Comment"] = 5] = "Comment";
  return NodeType2;
})(NodeType || {});
function isNodeInLinkedList(n2) {
  return "__ln" in n2;
}
class DoubleLinkedList {
  constructor() {
    __publicField(this, "length", 0);
    __publicField(this, "head", null);
    __publicField(this, "tail", null);
  }
  get(position) {
    if (position >= this.length) {
      throw new Error("Position outside of list range");
    }
    let current = this.head;
    for (let index2 = 0; index2 < position; index2++) {
      current = (current == null ? void 0 : current.next) || null;
    }
    return current;
  }
  addNode(n2) {
    const node2 = {
      value: n2,
      previous: null,
      next: null
    };
    n2.__ln = node2;
    if (n2.previousSibling && isNodeInLinkedList(n2.previousSibling)) {
      const current = n2.previousSibling.__ln.next;
      node2.next = current;
      node2.previous = n2.previousSibling.__ln;
      n2.previousSibling.__ln.next = node2;
      if (current) {
        current.previous = node2;
      }
    } else if (n2.nextSibling && isNodeInLinkedList(n2.nextSibling) && n2.nextSibling.__ln.previous) {
      const current = n2.nextSibling.__ln.previous;
      node2.previous = current;
      node2.next = n2.nextSibling.__ln;
      n2.nextSibling.__ln.previous = node2;
      if (current) {
        current.next = node2;
      }
    } else {
      if (this.head) {
        this.head.previous = node2;
      }
      node2.next = this.head;
      this.head = node2;
    }
    if (node2.next === null) {
      this.tail = node2;
    }
    this.length++;
  }
  removeNode(n2) {
    const current = n2.__ln;
    if (!this.head) {
      return;
    }
    if (!current.previous) {
      this.head = current.next;
      if (this.head) {
        this.head.previous = null;
      } else {
        this.tail = null;
      }
    } else {
      current.previous.next = current.next;
      if (current.next) {
        current.next.previous = current.previous;
      } else {
        this.tail = current.previous;
      }
    }
    if (n2.__ln) {
      delete n2.__ln;
    }
    this.length--;
  }
}
const moveKey = (id, parentId) => `${id}@${parentId}`;
class MutationBuffer {
  constructor() {
    __publicField(this, "frozen", false);
    __publicField(this, "locked", false);
    __publicField(this, "texts", []);
    __publicField(this, "attributes", []);
    __publicField(this, "attributeMap", /* @__PURE__ */ new WeakMap());
    __publicField(this, "removes", []);
    __publicField(this, "mapRemoves", []);
    __publicField(this, "movedMap", {});
    __publicField(this, "addedSet", /* @__PURE__ */ new Set());
    __publicField(this, "movedSet", /* @__PURE__ */ new Set());
    __publicField(this, "droppedSet", /* @__PURE__ */ new Set());
    __publicField(this, "removesSubTreeCache", /* @__PURE__ */ new Set());
    __publicField(this, "mutationCb");
    __publicField(this, "blockClass");
    __publicField(this, "blockSelector");
    __publicField(this, "maskTextClass");
    __publicField(this, "maskTextSelector");
    __publicField(this, "inlineStylesheet");
    __publicField(this, "maskInputOptions");
    __publicField(this, "maskTextFn");
    __publicField(this, "maskInputFn");
    __publicField(this, "keepIframeSrcFn");
    __publicField(this, "recordCanvas");
    __publicField(this, "inlineImages");
    __publicField(this, "slimDOMOptions");
    __publicField(this, "dataURLOptions");
    __publicField(this, "doc");
    __publicField(this, "mirror");
    __publicField(this, "iframeManager");
    __publicField(this, "stylesheetManager");
    __publicField(this, "shadowDomManager");
    __publicField(this, "canvasManager");
    __publicField(this, "processedNodeManager");
    __publicField(this, "unattachedDoc");
    __publicField(this, "processMutations", (mutations) => {
      mutations.forEach(this.processMutation);
      this.emit();
    });
    __publicField(this, "emit", () => {
      if (this.frozen || this.locked) {
        return;
      }
      const adds = [];
      const addedIds = /* @__PURE__ */ new Set();
      const addList = new DoubleLinkedList();
      const getNextId = (n2) => {
        let ns = n2;
        let nextId = IGNORED_NODE;
        while (nextId === IGNORED_NODE) {
          ns = ns && ns.nextSibling;
          nextId = ns && this.mirror.getId(ns);
        }
        return nextId;
      };
      const pushAdd = (n2) => {
        const parent = index.parentNode(n2);
        if (!parent || !inDom(n2)) {
          return;
        }
        let cssCaptured = false;
        if (n2.nodeType === Node.TEXT_NODE) {
          const parentTag = parent.tagName;
          if (parentTag === "TEXTAREA") {
            return;
          } else if (parentTag === "STYLE" && this.addedSet.has(parent)) {
            cssCaptured = true;
          }
        }
        const parentId = isShadowRoot(parent) ? this.mirror.getId(getShadowHost(n2)) : this.mirror.getId(parent);
        const nextId = getNextId(n2);
        if (parentId === -1 || nextId === -1) {
          return addList.addNode(n2);
        }
        const sn = serializeNodeWithId(n2, {
          doc: this.doc,
          mirror: this.mirror,
          blockClass: this.blockClass,
          blockSelector: this.blockSelector,
          maskTextClass: this.maskTextClass,
          maskTextSelector: this.maskTextSelector,
          skipChild: true,
          newlyAddedElement: true,
          inlineStylesheet: this.inlineStylesheet,
          maskInputOptions: this.maskInputOptions,
          maskTextFn: this.maskTextFn,
          maskInputFn: this.maskInputFn,
          slimDOMOptions: this.slimDOMOptions,
          dataURLOptions: this.dataURLOptions,
          recordCanvas: this.recordCanvas,
          inlineImages: this.inlineImages,
          onSerialize: (currentN) => {
            if (isSerializedIframe(currentN, this.mirror)) {
              this.iframeManager.addIframe(currentN);
            }
            if (isSerializedStylesheet(currentN, this.mirror)) {
              this.stylesheetManager.trackLinkElement(
                currentN
              );
            }
            if (hasShadowRoot(n2)) {
              this.shadowDomManager.addShadowRoot(index.shadowRoot(n2), this.doc);
            }
          },
          onIframeLoad: (iframe, childSn) => {
            this.iframeManager.attachIframe(iframe, childSn);
            this.shadowDomManager.observeAttachShadow(iframe);
          },
          onStylesheetLoad: (link, childSn) => {
            this.stylesheetManager.attachLinkElement(link, childSn);
          },
          cssCaptured
        });
        if (sn) {
          adds.push({
            parentId,
            nextId,
            node: sn
          });
          addedIds.add(sn.id);
        }
      };
      while (this.mapRemoves.length) {
        this.mirror.removeNodeFromMap(this.mapRemoves.shift());
      }
      for (const n2 of this.movedSet) {
        if (isParentRemoved(this.removesSubTreeCache, n2, this.mirror) && !this.movedSet.has(index.parentNode(n2))) {
          continue;
        }
        pushAdd(n2);
      }
      for (const n2 of this.addedSet) {
        if (!isAncestorInSet(this.droppedSet, n2) && !isParentRemoved(this.removesSubTreeCache, n2, this.mirror)) {
          pushAdd(n2);
        } else if (isAncestorInSet(this.movedSet, n2)) {
          pushAdd(n2);
        } else {
          this.droppedSet.add(n2);
        }
      }
      let candidate = null;
      while (addList.length) {
        let node2 = null;
        if (candidate) {
          const parentId = this.mirror.getId(index.parentNode(candidate.value));
          const nextId = getNextId(candidate.value);
          if (parentId !== -1 && nextId !== -1) {
            node2 = candidate;
          }
        }
        if (!node2) {
          let tailNode = addList.tail;
          while (tailNode) {
            const _node = tailNode;
            tailNode = tailNode.previous;
            if (_node) {
              const parentId = this.mirror.getId(index.parentNode(_node.value));
              const nextId = getNextId(_node.value);
              if (nextId === -1) continue;
              else if (parentId !== -1) {
                node2 = _node;
                break;
              } else {
                const unhandledNode = _node.value;
                const parent = index.parentNode(unhandledNode);
                if (parent && parent.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
                  const shadowHost = index.host(parent);
                  const parentId2 = this.mirror.getId(shadowHost);
                  if (parentId2 !== -1) {
                    node2 = _node;
                    break;
                  }
                }
              }
            }
          }
        }
        if (!node2) {
          while (addList.head) {
            addList.removeNode(addList.head.value);
          }
          break;
        }
        candidate = node2.previous;
        addList.removeNode(node2.value);
        pushAdd(node2.value);
      }
      const payload = {
        texts: this.texts.map((text) => {
          const n2 = text.node;
          const parent = index.parentNode(n2);
          if (parent && parent.tagName === "TEXTAREA") {
            this.genTextAreaValueMutation(parent);
          }
          return {
            id: this.mirror.getId(n2),
            value: text.value
          };
        }).filter((text) => !addedIds.has(text.id)).filter((text) => this.mirror.has(text.id)),
        attributes: this.attributes.map((attribute) => {
          const { attributes } = attribute;
          if (typeof attributes.style === "string") {
            const diffAsStr = JSON.stringify(attribute.styleDiff);
            const unchangedAsStr = JSON.stringify(attribute._unchangedStyles);
            if (diffAsStr.length < attributes.style.length) {
              if ((diffAsStr + unchangedAsStr).split("var(").length === attributes.style.split("var(").length) {
                attributes.style = attribute.styleDiff;
              }
            }
          }
          return {
            id: this.mirror.getId(attribute.node),
            attributes
          };
        }).filter((attribute) => !addedIds.has(attribute.id)).filter((attribute) => this.mirror.has(attribute.id)),
        removes: this.removes,
        adds
      };
      if (!payload.texts.length && !payload.attributes.length && !payload.removes.length && !payload.adds.length) {
        return;
      }
      this.texts = [];
      this.attributes = [];
      this.attributeMap = /* @__PURE__ */ new WeakMap();
      this.removes = [];
      this.addedSet = /* @__PURE__ */ new Set();
      this.movedSet = /* @__PURE__ */ new Set();
      this.droppedSet = /* @__PURE__ */ new Set();
      this.removesSubTreeCache = /* @__PURE__ */ new Set();
      this.movedMap = {};
      this.mutationCb(payload);
    });
    __publicField(this, "genTextAreaValueMutation", (textarea) => {
      let item = this.attributeMap.get(textarea);
      if (!item) {
        item = {
          node: textarea,
          attributes: {},
          styleDiff: {},
          _unchangedStyles: {}
        };
        this.attributes.push(item);
        this.attributeMap.set(textarea, item);
      }
      item.attributes.value = Array.from(
        index.childNodes(textarea),
        (cn) => index.textContent(cn) || ""
      ).join("");
    });
    __publicField(this, "processMutation", (m) => {
      if (isIgnored(m.target, this.mirror, this.slimDOMOptions)) {
        return;
      }
      switch (m.type) {
        case "characterData": {
          const value = index.textContent(m.target);
          if (!isBlocked(m.target, this.blockClass, this.blockSelector, false) && value !== m.oldValue) {
            this.texts.push({
              value: needMaskingText(
                m.target,
                this.maskTextClass,
                this.maskTextSelector,
                true
                // checkAncestors
              ) && value ? this.maskTextFn ? this.maskTextFn(value, closestElementOfNode(m.target)) : value.replace(/[\S]/g, "*") : value,
              node: m.target
            });
          }
          break;
        }
        case "attributes": {
          const target = m.target;
          let attributeName = m.attributeName;
          let value = m.target.getAttribute(attributeName);
          if (attributeName === "value") {
            const type = getInputType(target);
            value = maskInputValue({
              element: target,
              maskInputOptions: this.maskInputOptions,
              tagName: target.tagName,
              type,
              value,
              maskInputFn: this.maskInputFn
            });
          }
          if (isBlocked(m.target, this.blockClass, this.blockSelector, false) || value === m.oldValue) {
            return;
          }
          let item = this.attributeMap.get(m.target);
          if (target.tagName === "IFRAME" && attributeName === "src" && !this.keepIframeSrcFn(value)) {
            if (!target.contentDocument) {
              attributeName = "rr_src";
            } else {
              return;
            }
          }
          if (!item) {
            item = {
              node: m.target,
              attributes: {},
              styleDiff: {},
              _unchangedStyles: {}
            };
            this.attributes.push(item);
            this.attributeMap.set(m.target, item);
          }
          if (attributeName === "type" && target.tagName === "INPUT" && (m.oldValue || "").toLowerCase() === "password") {
            target.setAttribute("data-rr-is-password", "true");
          }
          if (!ignoreAttribute(target.tagName, attributeName)) {
            item.attributes[attributeName] = transformAttribute(
              this.doc,
              toLowerCase(target.tagName),
              toLowerCase(attributeName),
              value
            );
            if (attributeName === "style") {
              if (!this.unattachedDoc) {
                try {
                  this.unattachedDoc = document.implementation.createHTMLDocument();
                } catch (e2) {
                  this.unattachedDoc = this.doc;
                }
              }
              const old = this.unattachedDoc.createElement("span");
              if (m.oldValue) {
                old.setAttribute("style", m.oldValue);
              }
              for (const pname of Array.from(target.style)) {
                const newValue = target.style.getPropertyValue(pname);
                const newPriority = target.style.getPropertyPriority(pname);
                if (newValue !== old.style.getPropertyValue(pname) || newPriority !== old.style.getPropertyPriority(pname)) {
                  if (newPriority === "") {
                    item.styleDiff[pname] = newValue;
                  } else {
                    item.styleDiff[pname] = [newValue, newPriority];
                  }
                } else {
                  item._unchangedStyles[pname] = [newValue, newPriority];
                }
              }
              for (const pname of Array.from(old.style)) {
                if (target.style.getPropertyValue(pname) === "") {
                  item.styleDiff[pname] = false;
                }
              }
            } else if (attributeName === "open" && target.tagName === "DIALOG") {
              if (target.matches("dialog:modal")) {
                item.attributes["rr_open_mode"] = "modal";
              } else {
                item.attributes["rr_open_mode"] = "non-modal";
              }
            }
          }
          break;
        }
        case "childList": {
          if (isBlocked(m.target, this.blockClass, this.blockSelector, true))
            return;
          if (m.target.tagName === "TEXTAREA") {
            this.genTextAreaValueMutation(m.target);
            return;
          }
          m.addedNodes.forEach((n2) => this.genAdds(n2, m.target));
          m.removedNodes.forEach((n2) => {
            const nodeId = this.mirror.getId(n2);
            const parentId = isShadowRoot(m.target) ? this.mirror.getId(index.host(m.target)) : this.mirror.getId(m.target);
            if (isBlocked(m.target, this.blockClass, this.blockSelector, false) || isIgnored(n2, this.mirror, this.slimDOMOptions) || !isSerialized(n2, this.mirror)) {
              return;
            }
            if (this.addedSet.has(n2)) {
              deepDelete(this.addedSet, n2);
              this.droppedSet.add(n2);
            } else if (this.addedSet.has(m.target) && nodeId === -1) ;
            else if (isAncestorRemoved(m.target, this.mirror)) ;
            else if (this.movedSet.has(n2) && this.movedMap[moveKey(nodeId, parentId)]) {
              deepDelete(this.movedSet, n2);
            } else {
              this.removes.push({
                parentId,
                id: nodeId,
                isShadow: isShadowRoot(m.target) && isNativeShadowDom(m.target) ? true : void 0
              });
              processRemoves(n2, this.removesSubTreeCache);
            }
            this.mapRemoves.push(n2);
          });
          break;
        }
      }
    });
    __publicField(this, "genAdds", (n2, target) => {
      if (this.processedNodeManager.inOtherBuffer(n2, this)) return;
      if (this.addedSet.has(n2) || this.movedSet.has(n2)) return;
      if (this.mirror.hasNode(n2)) {
        if (isIgnored(n2, this.mirror, this.slimDOMOptions)) {
          return;
        }
        this.movedSet.add(n2);
        let targetId = null;
        if (target && this.mirror.hasNode(target)) {
          targetId = this.mirror.getId(target);
        }
        if (targetId && targetId !== -1) {
          this.movedMap[moveKey(this.mirror.getId(n2), targetId)] = true;
        }
      } else {
        this.addedSet.add(n2);
        this.droppedSet.delete(n2);
      }
      if (!isBlocked(n2, this.blockClass, this.blockSelector, false)) {
        index.childNodes(n2).forEach((childN) => this.genAdds(childN));
        if (hasShadowRoot(n2)) {
          index.childNodes(index.shadowRoot(n2)).forEach((childN) => {
            this.processedNodeManager.add(childN, this);
            this.genAdds(childN, n2);
          });
        }
      }
    });
  }
  init(options) {
    [
      "mutationCb",
      "blockClass",
      "blockSelector",
      "maskTextClass",
      "maskTextSelector",
      "inlineStylesheet",
      "maskInputOptions",
      "maskTextFn",
      "maskInputFn",
      "keepIframeSrcFn",
      "recordCanvas",
      "inlineImages",
      "slimDOMOptions",
      "dataURLOptions",
      "doc",
      "mirror",
      "iframeManager",
      "stylesheetManager",
      "shadowDomManager",
      "canvasManager",
      "processedNodeManager"
    ].forEach((key) => {
      this[key] = options[key];
    });
  }
  freeze() {
    this.frozen = true;
    this.canvasManager.freeze();
  }
  unfreeze() {
    this.frozen = false;
    this.canvasManager.unfreeze();
    this.emit();
  }
  isFrozen() {
    return this.frozen;
  }
  lock() {
    this.locked = true;
    this.canvasManager.lock();
  }
  unlock() {
    this.locked = false;
    this.canvasManager.unlock();
    this.emit();
  }
  reset() {
    this.shadowDomManager.reset();
    this.canvasManager.reset();
  }
}
function deepDelete(addsSet, n2) {
  addsSet.delete(n2);
  index.childNodes(n2).forEach((childN) => deepDelete(addsSet, childN));
}
function processRemoves(n2, cache) {
  const queue = [n2];
  while (queue.length) {
    const next = queue.pop();
    if (cache.has(next)) continue;
    cache.add(next);
    index.childNodes(next).forEach((n22) => queue.push(n22));
  }
  return;
}
function isParentRemoved(removes, n2, mirror2) {
  if (removes.size === 0) return false;
  return _isParentRemoved(removes, n2);
}
function _isParentRemoved(removes, n2, _mirror2) {
  const node2 = index.parentNode(n2);
  if (!node2) return false;
  return removes.has(node2);
}
function isAncestorInSet(set, n2) {
  if (set.size === 0) return false;
  return _isAncestorInSet(set, n2);
}
function _isAncestorInSet(set, n2) {
  const parent = index.parentNode(n2);
  if (!parent) {
    return false;
  }
  if (set.has(parent)) {
    return true;
  }
  return _isAncestorInSet(set, parent);
}
let errorHandler;
function registerErrorHandler(handler) {
  errorHandler = handler;
}
function unregisterErrorHandler() {
  errorHandler = void 0;
}
const callbackWrapper = (cb) => {
  if (!errorHandler) {
    return cb;
  }
  const rrwebWrapped = (...rest) => {
    try {
      return cb(...rest);
    } catch (error) {
      if (errorHandler && errorHandler(error) === true) {
        return;
      }
      throw error;
    }
  };
  return rrwebWrapped;
};
const mutationBuffers = [];
function getEventTarget(event) {
  try {
    if ("composedPath" in event) {
      const path = event.composedPath();
      if (path.length) {
        return path[0];
      }
    } else if ("path" in event && event.path.length) {
      return event.path[0];
    }
  } catch {
  }
  return event && event.target;
}
function initMutationObserver(options, rootEl) {
  const mutationBuffer = new MutationBuffer();
  mutationBuffers.push(mutationBuffer);
  mutationBuffer.init(options);
  const observer = new (mutationObserverCtor())(
    callbackWrapper(mutationBuffer.processMutations.bind(mutationBuffer))
  );
  observer.observe(rootEl, {
    attributes: true,
    attributeOldValue: true,
    characterData: true,
    characterDataOldValue: true,
    childList: true,
    subtree: true
  });
  return observer;
}
function initMoveObserver({
  mousemoveCb,
  sampling,
  doc,
  mirror: mirror2
}) {
  if (sampling.mousemove === false) {
    return () => {
    };
  }
  const threshold = typeof sampling.mousemove === "number" ? sampling.mousemove : 50;
  const callbackThreshold = typeof sampling.mousemoveCallback === "number" ? sampling.mousemoveCallback : 500;
  let positions = [];
  let timeBaseline;
  const wrappedCb = throttle(
    callbackWrapper(
      (source) => {
        const totalOffset = Date.now() - timeBaseline;
        mousemoveCb(
          positions.map((p) => {
            p.timeOffset -= totalOffset;
            return p;
          }),
          source
        );
        positions = [];
        timeBaseline = null;
      }
    ),
    callbackThreshold
  );
  const updatePosition = callbackWrapper(
    throttle(
      callbackWrapper((evt) => {
        const target = getEventTarget(evt);
        const { clientX, clientY } = legacy_isTouchEvent(evt) ? evt.changedTouches[0] : evt;
        if (!timeBaseline) {
          timeBaseline = nowTimestamp();
        }
        positions.push({
          x: clientX,
          y: clientY,
          id: mirror2.getId(target),
          timeOffset: nowTimestamp() - timeBaseline
        });
        wrappedCb(
          typeof DragEvent !== "undefined" && evt instanceof DragEvent ? IncrementalSource.Drag : evt instanceof MouseEvent ? IncrementalSource.MouseMove : IncrementalSource.TouchMove
        );
      }),
      threshold,
      {
        trailing: false
      }
    )
  );
  const handlers = [
    on("mousemove", updatePosition, doc),
    on("touchmove", updatePosition, doc),
    on("drag", updatePosition, doc)
  ];
  return callbackWrapper(() => {
    handlers.forEach((h) => h());
  });
}
function initMouseInteractionObserver({
  mouseInteractionCb,
  doc,
  mirror: mirror2,
  blockClass,
  blockSelector,
  sampling
}) {
  if (sampling.mouseInteraction === false) {
    return () => {
    };
  }
  const disableMap = sampling.mouseInteraction === true || sampling.mouseInteraction === void 0 ? {} : sampling.mouseInteraction;
  const handlers = [];
  let currentPointerType = null;
  const getHandler = (eventKey) => {
    return (event) => {
      const target = getEventTarget(event);
      if (isBlocked(target, blockClass, blockSelector, true)) {
        return;
      }
      let pointerType = null;
      let thisEventKey = eventKey;
      if ("pointerType" in event) {
        switch (event.pointerType) {
          case "mouse":
            pointerType = PointerTypes.Mouse;
            break;
          case "touch":
            pointerType = PointerTypes.Touch;
            break;
          case "pen":
            pointerType = PointerTypes.Pen;
            break;
        }
        if (pointerType === PointerTypes.Touch) {
          if (MouseInteractions[eventKey] === MouseInteractions.MouseDown) {
            thisEventKey = "TouchStart";
          } else if (MouseInteractions[eventKey] === MouseInteractions.MouseUp) {
            thisEventKey = "TouchEnd";
          }
        } else if (pointerType === PointerTypes.Pen) ;
      } else if (legacy_isTouchEvent(event)) {
        pointerType = PointerTypes.Touch;
      }
      if (pointerType !== null) {
        currentPointerType = pointerType;
        if (thisEventKey.startsWith("Touch") && pointerType === PointerTypes.Touch || thisEventKey.startsWith("Mouse") && pointerType === PointerTypes.Mouse) {
          pointerType = null;
        }
      } else if (MouseInteractions[eventKey] === MouseInteractions.Click) {
        pointerType = currentPointerType;
        currentPointerType = null;
      }
      const e2 = legacy_isTouchEvent(event) ? event.changedTouches[0] : event;
      if (!e2) {
        return;
      }
      const id = mirror2.getId(target);
      const { clientX, clientY } = e2;
      callbackWrapper(mouseInteractionCb)({
        type: MouseInteractions[thisEventKey],
        id,
        x: clientX,
        y: clientY,
        ...pointerType !== null && { pointerType }
      });
    };
  };
  Object.keys(MouseInteractions).filter(
    (key) => Number.isNaN(Number(key)) && !key.endsWith("_Departed") && disableMap[key] !== false
  ).forEach((eventKey) => {
    let eventName = toLowerCase(eventKey);
    const handler = getHandler(eventKey);
    if (window.PointerEvent) {
      switch (MouseInteractions[eventKey]) {
        case MouseInteractions.MouseDown:
        case MouseInteractions.MouseUp:
          eventName = eventName.replace(
            "mouse",
            "pointer"
          );
          break;
        case MouseInteractions.TouchStart:
        case MouseInteractions.TouchEnd:
          return;
      }
    }
    handlers.push(on(eventName, handler, doc));
  });
  return callbackWrapper(() => {
    handlers.forEach((h) => h());
  });
}
function initScrollObserver({
  scrollCb,
  doc,
  mirror: mirror2,
  blockClass,
  blockSelector,
  sampling
}) {
  const updatePosition = callbackWrapper(
    throttle(
      callbackWrapper((evt) => {
        const target = getEventTarget(evt);
        if (!target || isBlocked(target, blockClass, blockSelector, true)) {
          return;
        }
        const id = mirror2.getId(target);
        if (target === doc && doc.defaultView) {
          const scrollLeftTop = getWindowScroll(doc.defaultView);
          scrollCb({
            id,
            x: scrollLeftTop.left,
            y: scrollLeftTop.top
          });
        } else {
          scrollCb({
            id,
            x: target.scrollLeft,
            y: target.scrollTop
          });
        }
      }),
      sampling.scroll || 100
    )
  );
  return on("scroll", updatePosition, doc);
}
function initViewportResizeObserver({ viewportResizeCb }, { win }) {
  let lastH = -1;
  let lastW = -1;
  const updateDimension = callbackWrapper(
    throttle(
      callbackWrapper(() => {
        const height = getWindowHeight();
        const width = getWindowWidth();
        if (lastH !== height || lastW !== width) {
          viewportResizeCb({
            width: Number(width),
            height: Number(height)
          });
          lastH = height;
          lastW = width;
        }
      }),
      200
    )
  );
  return on("resize", updateDimension, win);
}
const INPUT_TAGS = ["INPUT", "TEXTAREA", "SELECT"];
const lastInputValueMap = /* @__PURE__ */ new WeakMap();
function initInputObserver({
  inputCb,
  doc,
  mirror: mirror2,
  blockClass,
  blockSelector,
  ignoreClass,
  ignoreSelector,
  maskInputOptions,
  maskInputFn,
  sampling,
  userTriggeredOnInput
}) {
  function eventHandler(event) {
    let target = getEventTarget(event);
    const userTriggered = event.isTrusted;
    const tagName = target && target.tagName;
    if (target && tagName === "OPTION") {
      target = index.parentElement(target);
    }
    if (!target || !tagName || INPUT_TAGS.indexOf(tagName) < 0 || isBlocked(target, blockClass, blockSelector, true)) {
      return;
    }
    if (target.classList.contains(ignoreClass) || ignoreSelector && target.matches(ignoreSelector)) {
      return;
    }
    let text = target.value;
    let isChecked = false;
    const type = getInputType(target) || "";
    if (type === "radio" || type === "checkbox") {
      isChecked = target.checked;
    } else if (maskInputOptions[tagName.toLowerCase()] || maskInputOptions[type]) {
      text = maskInputValue({
        element: target,
        maskInputOptions,
        tagName,
        type,
        value: text,
        maskInputFn
      });
    }
    cbWithDedup(
      target,
      userTriggeredOnInput ? { text, isChecked, userTriggered } : { text, isChecked }
    );
    const name = target.name;
    if (type === "radio" && name && isChecked) {
      doc.querySelectorAll(`input[type="radio"][name="${name}"]`).forEach((el) => {
        if (el !== target) {
          const text2 = el.value;
          cbWithDedup(
            el,
            userTriggeredOnInput ? { text: text2, isChecked: !isChecked, userTriggered: false } : { text: text2, isChecked: !isChecked }
          );
        }
      });
    }
  }
  function cbWithDedup(target, v2) {
    const lastInputValue = lastInputValueMap.get(target);
    if (!lastInputValue || lastInputValue.text !== v2.text || lastInputValue.isChecked !== v2.isChecked) {
      lastInputValueMap.set(target, v2);
      const id = mirror2.getId(target);
      callbackWrapper(inputCb)({
        ...v2,
        id
      });
    }
  }
  const events = sampling.input === "last" ? ["change"] : ["input", "change"];
  const handlers = events.map(
    (eventName) => on(eventName, callbackWrapper(eventHandler), doc)
  );
  const currentWindow = doc.defaultView;
  if (!currentWindow) {
    return () => {
      handlers.forEach((h) => h());
    };
  }
  const propertyDescriptor = currentWindow.Object.getOwnPropertyDescriptor(
    currentWindow.HTMLInputElement.prototype,
    "value"
  );
  const hookProperties = [
    [currentWindow.HTMLInputElement.prototype, "value"],
    [currentWindow.HTMLInputElement.prototype, "checked"],
    [currentWindow.HTMLSelectElement.prototype, "value"],
    [currentWindow.HTMLTextAreaElement.prototype, "value"],
    // Some UI library use selectedIndex to set select value
    [currentWindow.HTMLSelectElement.prototype, "selectedIndex"],
    [currentWindow.HTMLOptionElement.prototype, "selected"]
  ];
  if (propertyDescriptor && propertyDescriptor.set) {
    handlers.push(
      ...hookProperties.map(
        (p) => hookSetter(
          p[0],
          p[1],
          {
            set() {
              callbackWrapper(eventHandler)({
                target: this,
                isTrusted: false
                // userTriggered to false as this could well be programmatic
              });
            }
          },
          false,
          currentWindow
        )
      )
    );
  }
  return callbackWrapper(() => {
    handlers.forEach((h) => h());
  });
}
function getNestedCSSRulePositions(rule2) {
  const positions = [];
  function recurse(childRule, pos) {
    if (hasNestedCSSRule("CSSGroupingRule") && childRule.parentRule instanceof CSSGroupingRule || hasNestedCSSRule("CSSMediaRule") && childRule.parentRule instanceof CSSMediaRule || hasNestedCSSRule("CSSSupportsRule") && childRule.parentRule instanceof CSSSupportsRule || hasNestedCSSRule("CSSConditionRule") && childRule.parentRule instanceof CSSConditionRule) {
      const rules2 = Array.from(
        childRule.parentRule.cssRules
      );
      const index2 = rules2.indexOf(childRule);
      pos.unshift(index2);
    } else if (childRule.parentStyleSheet) {
      const rules2 = Array.from(childRule.parentStyleSheet.cssRules);
      const index2 = rules2.indexOf(childRule);
      pos.unshift(index2);
    }
    return pos;
  }
  return recurse(rule2, positions);
}
function getIdAndStyleId(sheet, mirror2, styleMirror) {
  let id, styleId;
  if (!sheet) return {};
  if (sheet.ownerNode) id = mirror2.getId(sheet.ownerNode);
  else styleId = styleMirror.getId(sheet);
  return {
    styleId,
    id
  };
}
function initStyleSheetObserver({ styleSheetRuleCb, mirror: mirror2, stylesheetManager }, { win }) {
  if (!win.CSSStyleSheet || !win.CSSStyleSheet.prototype) {
    return () => {
    };
  }
  const insertRule = win.CSSStyleSheet.prototype.insertRule;
  win.CSSStyleSheet.prototype.insertRule = new Proxy(insertRule, {
    apply: callbackWrapper(
      (target, thisArg, argumentsList) => {
        const [rule2, index2] = argumentsList;
        const { id, styleId } = getIdAndStyleId(
          thisArg,
          mirror2,
          stylesheetManager.styleMirror
        );
        if (id && id !== -1 || styleId && styleId !== -1) {
          styleSheetRuleCb({
            id,
            styleId,
            adds: [{ rule: rule2, index: index2 }]
          });
        }
        return target.apply(thisArg, argumentsList);
      }
    )
  });
  win.CSSStyleSheet.prototype.addRule = function(selector, styleBlock, index2 = this.cssRules.length) {
    const rule2 = `${selector} { ${styleBlock} }`;
    return win.CSSStyleSheet.prototype.insertRule.apply(this, [rule2, index2]);
  };
  const deleteRule = win.CSSStyleSheet.prototype.deleteRule;
  win.CSSStyleSheet.prototype.deleteRule = new Proxy(deleteRule, {
    apply: callbackWrapper(
      (target, thisArg, argumentsList) => {
        const [index2] = argumentsList;
        const { id, styleId } = getIdAndStyleId(
          thisArg,
          mirror2,
          stylesheetManager.styleMirror
        );
        if (id && id !== -1 || styleId && styleId !== -1) {
          styleSheetRuleCb({
            id,
            styleId,
            removes: [{ index: index2 }]
          });
        }
        return target.apply(thisArg, argumentsList);
      }
    )
  });
  win.CSSStyleSheet.prototype.removeRule = function(index2) {
    return win.CSSStyleSheet.prototype.deleteRule.apply(this, [index2]);
  };
  let replace;
  if (win.CSSStyleSheet.prototype.replace) {
    replace = win.CSSStyleSheet.prototype.replace;
    win.CSSStyleSheet.prototype.replace = new Proxy(replace, {
      apply: callbackWrapper(
        (target, thisArg, argumentsList) => {
          const [text] = argumentsList;
          const { id, styleId } = getIdAndStyleId(
            thisArg,
            mirror2,
            stylesheetManager.styleMirror
          );
          if (id && id !== -1 || styleId && styleId !== -1) {
            styleSheetRuleCb({
              id,
              styleId,
              replace: text
            });
          }
          return target.apply(thisArg, argumentsList);
        }
      )
    });
  }
  let replaceSync;
  if (win.CSSStyleSheet.prototype.replaceSync) {
    replaceSync = win.CSSStyleSheet.prototype.replaceSync;
    win.CSSStyleSheet.prototype.replaceSync = new Proxy(replaceSync, {
      apply: callbackWrapper(
        (target, thisArg, argumentsList) => {
          const [text] = argumentsList;
          const { id, styleId } = getIdAndStyleId(
            thisArg,
            mirror2,
            stylesheetManager.styleMirror
          );
          if (id && id !== -1 || styleId && styleId !== -1) {
            styleSheetRuleCb({
              id,
              styleId,
              replaceSync: text
            });
          }
          return target.apply(thisArg, argumentsList);
        }
      )
    });
  }
  const supportedNestedCSSRuleTypes = {};
  if (canMonkeyPatchNestedCSSRule("CSSGroupingRule")) {
    supportedNestedCSSRuleTypes.CSSGroupingRule = win.CSSGroupingRule;
  } else {
    if (canMonkeyPatchNestedCSSRule("CSSMediaRule")) {
      supportedNestedCSSRuleTypes.CSSMediaRule = win.CSSMediaRule;
    }
    if (canMonkeyPatchNestedCSSRule("CSSConditionRule")) {
      supportedNestedCSSRuleTypes.CSSConditionRule = win.CSSConditionRule;
    }
    if (canMonkeyPatchNestedCSSRule("CSSSupportsRule")) {
      supportedNestedCSSRuleTypes.CSSSupportsRule = win.CSSSupportsRule;
    }
  }
  const unmodifiedFunctions = {};
  Object.entries(supportedNestedCSSRuleTypes).forEach(([typeKey, type]) => {
    unmodifiedFunctions[typeKey] = {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      insertRule: type.prototype.insertRule,
      // eslint-disable-next-line @typescript-eslint/unbound-method
      deleteRule: type.prototype.deleteRule
    };
    type.prototype.insertRule = new Proxy(
      unmodifiedFunctions[typeKey].insertRule,
      {
        apply: callbackWrapper(
          (target, thisArg, argumentsList) => {
            const [rule2, index2] = argumentsList;
            const { id, styleId } = getIdAndStyleId(
              thisArg.parentStyleSheet,
              mirror2,
              stylesheetManager.styleMirror
            );
            if (id && id !== -1 || styleId && styleId !== -1) {
              styleSheetRuleCb({
                id,
                styleId,
                adds: [
                  {
                    rule: rule2,
                    index: [
                      ...getNestedCSSRulePositions(thisArg),
                      index2 || 0
                      // defaults to 0
                    ]
                  }
                ]
              });
            }
            return target.apply(thisArg, argumentsList);
          }
        )
      }
    );
    type.prototype.deleteRule = new Proxy(
      unmodifiedFunctions[typeKey].deleteRule,
      {
        apply: callbackWrapper(
          (target, thisArg, argumentsList) => {
            const [index2] = argumentsList;
            const { id, styleId } = getIdAndStyleId(
              thisArg.parentStyleSheet,
              mirror2,
              stylesheetManager.styleMirror
            );
            if (id && id !== -1 || styleId && styleId !== -1) {
              styleSheetRuleCb({
                id,
                styleId,
                removes: [
                  { index: [...getNestedCSSRulePositions(thisArg), index2] }
                ]
              });
            }
            return target.apply(thisArg, argumentsList);
          }
        )
      }
    );
  });
  return callbackWrapper(() => {
    win.CSSStyleSheet.prototype.insertRule = insertRule;
    win.CSSStyleSheet.prototype.deleteRule = deleteRule;
    replace && (win.CSSStyleSheet.prototype.replace = replace);
    replaceSync && (win.CSSStyleSheet.prototype.replaceSync = replaceSync);
    Object.entries(supportedNestedCSSRuleTypes).forEach(([typeKey, type]) => {
      type.prototype.insertRule = unmodifiedFunctions[typeKey].insertRule;
      type.prototype.deleteRule = unmodifiedFunctions[typeKey].deleteRule;
    });
  });
}
function initAdoptedStyleSheetObserver({
  mirror: mirror2,
  stylesheetManager
}, host2) {
  var _a2, _b, _c;
  let hostId = null;
  if (host2.nodeName === "#document") hostId = mirror2.getId(host2);
  else hostId = mirror2.getId(index.host(host2));
  const patchTarget = host2.nodeName === "#document" ? (_a2 = host2.defaultView) == null ? void 0 : _a2.Document : (_c = (_b = host2.ownerDocument) == null ? void 0 : _b.defaultView) == null ? void 0 : _c.ShadowRoot;
  const originalPropertyDescriptor = (patchTarget == null ? void 0 : patchTarget.prototype) ? Object.getOwnPropertyDescriptor(
    patchTarget == null ? void 0 : patchTarget.prototype,
    "adoptedStyleSheets"
  ) : void 0;
  if (hostId === null || hostId === -1 || !patchTarget || !originalPropertyDescriptor)
    return () => {
    };
  Object.defineProperty(host2, "adoptedStyleSheets", {
    configurable: originalPropertyDescriptor.configurable,
    enumerable: originalPropertyDescriptor.enumerable,
    get() {
      var _a3;
      return (_a3 = originalPropertyDescriptor.get) == null ? void 0 : _a3.call(this);
    },
    set(sheets) {
      var _a3;
      const result2 = (_a3 = originalPropertyDescriptor.set) == null ? void 0 : _a3.call(this, sheets);
      if (hostId !== null && hostId !== -1) {
        try {
          stylesheetManager.adoptStyleSheets(sheets, hostId);
        } catch (e2) {
        }
      }
      return result2;
    }
  });
  return callbackWrapper(() => {
    Object.defineProperty(host2, "adoptedStyleSheets", {
      configurable: originalPropertyDescriptor.configurable,
      enumerable: originalPropertyDescriptor.enumerable,
      // eslint-disable-next-line @typescript-eslint/unbound-method
      get: originalPropertyDescriptor.get,
      // eslint-disable-next-line @typescript-eslint/unbound-method
      set: originalPropertyDescriptor.set
    });
  });
}
function initStyleDeclarationObserver({
  styleDeclarationCb,
  mirror: mirror2,
  ignoreCSSAttributes,
  stylesheetManager
}, { win }) {
  const setProperty = win.CSSStyleDeclaration.prototype.setProperty;
  win.CSSStyleDeclaration.prototype.setProperty = new Proxy(setProperty, {
    apply: callbackWrapper(
      (target, thisArg, argumentsList) => {
        var _a2;
        const [property, value, priority] = argumentsList;
        if (ignoreCSSAttributes.has(property)) {
          return setProperty.apply(thisArg, [property, value, priority]);
        }
        const { id, styleId } = getIdAndStyleId(
          (_a2 = thisArg.parentRule) == null ? void 0 : _a2.parentStyleSheet,
          mirror2,
          stylesheetManager.styleMirror
        );
        if (id && id !== -1 || styleId && styleId !== -1) {
          styleDeclarationCb({
            id,
            styleId,
            set: {
              property,
              value,
              priority
            },
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            index: getNestedCSSRulePositions(thisArg.parentRule)
          });
        }
        return target.apply(thisArg, argumentsList);
      }
    )
  });
  const removeProperty = win.CSSStyleDeclaration.prototype.removeProperty;
  win.CSSStyleDeclaration.prototype.removeProperty = new Proxy(removeProperty, {
    apply: callbackWrapper(
      (target, thisArg, argumentsList) => {
        var _a2;
        const [property] = argumentsList;
        if (ignoreCSSAttributes.has(property)) {
          return removeProperty.apply(thisArg, [property]);
        }
        const { id, styleId } = getIdAndStyleId(
          (_a2 = thisArg.parentRule) == null ? void 0 : _a2.parentStyleSheet,
          mirror2,
          stylesheetManager.styleMirror
        );
        if (id && id !== -1 || styleId && styleId !== -1) {
          styleDeclarationCb({
            id,
            styleId,
            remove: {
              property
            },
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            index: getNestedCSSRulePositions(thisArg.parentRule)
          });
        }
        return target.apply(thisArg, argumentsList);
      }
    )
  });
  return callbackWrapper(() => {
    win.CSSStyleDeclaration.prototype.setProperty = setProperty;
    win.CSSStyleDeclaration.prototype.removeProperty = removeProperty;
  });
}
function initMediaInteractionObserver({
  mediaInteractionCb,
  blockClass,
  blockSelector,
  mirror: mirror2,
  sampling,
  doc
}) {
  const handler = callbackWrapper(
    (type) => throttle(
      callbackWrapper((event) => {
        const target = getEventTarget(event);
        if (!target || isBlocked(target, blockClass, blockSelector, true)) {
          return;
        }
        const { currentTime, volume, muted, playbackRate, loop } = target;
        mediaInteractionCb({
          type,
          id: mirror2.getId(target),
          currentTime,
          volume,
          muted,
          playbackRate,
          loop
        });
      }),
      sampling.media || 500
    )
  );
  const handlers = [
    on("play", handler(MediaInteractions.Play), doc),
    on("pause", handler(MediaInteractions.Pause), doc),
    on("seeked", handler(MediaInteractions.Seeked), doc),
    on("volumechange", handler(MediaInteractions.VolumeChange), doc),
    on("ratechange", handler(MediaInteractions.RateChange), doc)
  ];
  return callbackWrapper(() => {
    handlers.forEach((h) => h());
  });
}
function initFontObserver({ fontCb, doc }) {
  const win = doc.defaultView;
  if (!win) {
    return () => {
    };
  }
  const handlers = [];
  const fontMap = /* @__PURE__ */ new WeakMap();
  const originalFontFace = win.FontFace;
  win.FontFace = function FontFace2(family, source, descriptors) {
    const fontFace = new originalFontFace(family, source, descriptors);
    fontMap.set(fontFace, {
      family,
      buffer: typeof source !== "string",
      descriptors,
      fontSource: typeof source === "string" ? source : JSON.stringify(Array.from(new Uint8Array(source)))
    });
    return fontFace;
  };
  const restoreHandler = patch(
    doc.fonts,
    "add",
    function(original) {
      return function(fontFace) {
        setTimeout(
          callbackWrapper(() => {
            const p = fontMap.get(fontFace);
            if (p) {
              fontCb(p);
              fontMap.delete(fontFace);
            }
          }),
          0
        );
        return original.apply(this, [fontFace]);
      };
    }
  );
  handlers.push(() => {
    win.FontFace = originalFontFace;
  });
  handlers.push(restoreHandler);
  return callbackWrapper(() => {
    handlers.forEach((h) => h());
  });
}
function initSelectionObserver(param) {
  const { doc, mirror: mirror2, blockClass, blockSelector, selectionCb } = param;
  let collapsed = true;
  const updateSelection = callbackWrapper(() => {
    const selection = doc.getSelection();
    if (!selection || collapsed && (selection == null ? void 0 : selection.isCollapsed)) return;
    collapsed = selection.isCollapsed || false;
    const ranges = [];
    const count = selection.rangeCount || 0;
    for (let i2 = 0; i2 < count; i2++) {
      const range = selection.getRangeAt(i2);
      const { startContainer, startOffset, endContainer, endOffset } = range;
      const blocked = isBlocked(startContainer, blockClass, blockSelector, true) || isBlocked(endContainer, blockClass, blockSelector, true);
      if (blocked) continue;
      ranges.push({
        start: mirror2.getId(startContainer),
        startOffset,
        end: mirror2.getId(endContainer),
        endOffset
      });
    }
    selectionCb({ ranges });
  });
  updateSelection();
  return on("selectionchange", updateSelection);
}
function initCustomElementObserver({
  doc,
  customElementCb
}) {
  const win = doc.defaultView;
  if (!win || !win.customElements) return () => {
  };
  const restoreHandler = patch(
    win.customElements,
    "define",
    function(original) {
      return function(name, constructor, options) {
        try {
          customElementCb({
            define: {
              name
            }
          });
        } catch (e2) {
          console.warn(`Custom element callback failed for ${name}`);
        }
        return original.apply(this, [name, constructor, options]);
      };
    }
  );
  return restoreHandler;
}
function mergeHooks(o2, hooks) {
  const {
    mutationCb,
    mousemoveCb,
    mouseInteractionCb,
    scrollCb,
    viewportResizeCb,
    inputCb,
    mediaInteractionCb,
    styleSheetRuleCb,
    styleDeclarationCb,
    canvasMutationCb,
    fontCb,
    selectionCb,
    customElementCb
  } = o2;
  o2.mutationCb = (...p) => {
    if (hooks.mutation) {
      hooks.mutation(...p);
    }
    mutationCb(...p);
  };
  o2.mousemoveCb = (...p) => {
    if (hooks.mousemove) {
      hooks.mousemove(...p);
    }
    mousemoveCb(...p);
  };
  o2.mouseInteractionCb = (...p) => {
    if (hooks.mouseInteraction) {
      hooks.mouseInteraction(...p);
    }
    mouseInteractionCb(...p);
  };
  o2.scrollCb = (...p) => {
    if (hooks.scroll) {
      hooks.scroll(...p);
    }
    scrollCb(...p);
  };
  o2.viewportResizeCb = (...p) => {
    if (hooks.viewportResize) {
      hooks.viewportResize(...p);
    }
    viewportResizeCb(...p);
  };
  o2.inputCb = (...p) => {
    if (hooks.input) {
      hooks.input(...p);
    }
    inputCb(...p);
  };
  o2.mediaInteractionCb = (...p) => {
    if (hooks.mediaInteaction) {
      hooks.mediaInteaction(...p);
    }
    mediaInteractionCb(...p);
  };
  o2.styleSheetRuleCb = (...p) => {
    if (hooks.styleSheetRule) {
      hooks.styleSheetRule(...p);
    }
    styleSheetRuleCb(...p);
  };
  o2.styleDeclarationCb = (...p) => {
    if (hooks.styleDeclaration) {
      hooks.styleDeclaration(...p);
    }
    styleDeclarationCb(...p);
  };
  o2.canvasMutationCb = (...p) => {
    if (hooks.canvasMutation) {
      hooks.canvasMutation(...p);
    }
    canvasMutationCb(...p);
  };
  o2.fontCb = (...p) => {
    if (hooks.font) {
      hooks.font(...p);
    }
    fontCb(...p);
  };
  o2.selectionCb = (...p) => {
    if (hooks.selection) {
      hooks.selection(...p);
    }
    selectionCb(...p);
  };
  o2.customElementCb = (...c2) => {
    if (hooks.customElement) {
      hooks.customElement(...c2);
    }
    customElementCb(...c2);
  };
}
function initObservers(o2, hooks = {}) {
  const currentWindow = o2.doc.defaultView;
  if (!currentWindow) {
    return () => {
    };
  }
  mergeHooks(o2, hooks);
  let mutationObserver;
  if (o2.recordDOM) {
    mutationObserver = initMutationObserver(o2, o2.doc);
  }
  const mousemoveHandler = initMoveObserver(o2);
  const mouseInteractionHandler = initMouseInteractionObserver(o2);
  const scrollHandler = initScrollObserver(o2);
  const viewportResizeHandler = initViewportResizeObserver(o2, {
    win: currentWindow
  });
  const inputHandler = initInputObserver(o2);
  const mediaInteractionHandler = initMediaInteractionObserver(o2);
  let styleSheetObserver = () => {
  };
  let adoptedStyleSheetObserver = () => {
  };
  let styleDeclarationObserver = () => {
  };
  let fontObserver = () => {
  };
  if (o2.recordDOM) {
    styleSheetObserver = initStyleSheetObserver(o2, { win: currentWindow });
    adoptedStyleSheetObserver = initAdoptedStyleSheetObserver(o2, o2.doc);
    styleDeclarationObserver = initStyleDeclarationObserver(o2, {
      win: currentWindow
    });
    if (o2.collectFonts) {
      fontObserver = initFontObserver(o2);
    }
  }
  const selectionObserver = initSelectionObserver(o2);
  const customElementObserver = initCustomElementObserver(o2);
  const pluginHandlers = [];
  for (const plugin3 of o2.plugins) {
    pluginHandlers.push(
      plugin3.observer(plugin3.callback, currentWindow, plugin3.options)
    );
  }
  return callbackWrapper(() => {
    mutationBuffers.forEach((b) => b.reset());
    mutationObserver == null ? void 0 : mutationObserver.disconnect();
    mousemoveHandler();
    mouseInteractionHandler();
    scrollHandler();
    viewportResizeHandler();
    inputHandler();
    mediaInteractionHandler();
    styleSheetObserver();
    adoptedStyleSheetObserver();
    styleDeclarationObserver();
    fontObserver();
    selectionObserver();
    customElementObserver();
    pluginHandlers.forEach((h) => h());
  });
}
function hasNestedCSSRule(prop) {
  return typeof window[prop] !== "undefined";
}
function canMonkeyPatchNestedCSSRule(prop) {
  return Boolean(
    typeof window[prop] !== "undefined" && // Note: Generally, this check _shouldn't_ be necessary
    // However, in some scenarios (e.g. jsdom) this can sometimes fail, so we check for it here
    window[prop].prototype && "insertRule" in window[prop].prototype && "deleteRule" in window[prop].prototype
  );
}
class CrossOriginIframeMirror {
  constructor(generateIdFn) {
    __publicField(this, "iframeIdToRemoteIdMap", /* @__PURE__ */ new WeakMap());
    __publicField(this, "iframeRemoteIdToIdMap", /* @__PURE__ */ new WeakMap());
    this.generateIdFn = generateIdFn;
  }
  getId(iframe, remoteId, idToRemoteMap, remoteToIdMap) {
    const idToRemoteIdMap = idToRemoteMap || this.getIdToRemoteIdMap(iframe);
    const remoteIdToIdMap = remoteToIdMap || this.getRemoteIdToIdMap(iframe);
    let id = idToRemoteIdMap.get(remoteId);
    if (!id) {
      id = this.generateIdFn();
      idToRemoteIdMap.set(remoteId, id);
      remoteIdToIdMap.set(id, remoteId);
    }
    return id;
  }
  getIds(iframe, remoteId) {
    const idToRemoteIdMap = this.getIdToRemoteIdMap(iframe);
    const remoteIdToIdMap = this.getRemoteIdToIdMap(iframe);
    return remoteId.map(
      (id) => this.getId(iframe, id, idToRemoteIdMap, remoteIdToIdMap)
    );
  }
  getRemoteId(iframe, id, map) {
    const remoteIdToIdMap = map || this.getRemoteIdToIdMap(iframe);
    if (typeof id !== "number") return id;
    const remoteId = remoteIdToIdMap.get(id);
    if (!remoteId) return -1;
    return remoteId;
  }
  getRemoteIds(iframe, ids) {
    const remoteIdToIdMap = this.getRemoteIdToIdMap(iframe);
    return ids.map((id) => this.getRemoteId(iframe, id, remoteIdToIdMap));
  }
  reset(iframe) {
    if (!iframe) {
      this.iframeIdToRemoteIdMap = /* @__PURE__ */ new WeakMap();
      this.iframeRemoteIdToIdMap = /* @__PURE__ */ new WeakMap();
      return;
    }
    this.iframeIdToRemoteIdMap.delete(iframe);
    this.iframeRemoteIdToIdMap.delete(iframe);
  }
  getIdToRemoteIdMap(iframe) {
    let idToRemoteIdMap = this.iframeIdToRemoteIdMap.get(iframe);
    if (!idToRemoteIdMap) {
      idToRemoteIdMap = /* @__PURE__ */ new Map();
      this.iframeIdToRemoteIdMap.set(iframe, idToRemoteIdMap);
    }
    return idToRemoteIdMap;
  }
  getRemoteIdToIdMap(iframe) {
    let remoteIdToIdMap = this.iframeRemoteIdToIdMap.get(iframe);
    if (!remoteIdToIdMap) {
      remoteIdToIdMap = /* @__PURE__ */ new Map();
      this.iframeRemoteIdToIdMap.set(iframe, remoteIdToIdMap);
    }
    return remoteIdToIdMap;
  }
}
class IframeManager {
  constructor(options) {
    __publicField(this, "iframes", /* @__PURE__ */ new WeakMap());
    __publicField(this, "crossOriginIframeMap", /* @__PURE__ */ new WeakMap());
    __publicField(this, "crossOriginIframeMirror", new CrossOriginIframeMirror(genId));
    __publicField(this, "crossOriginIframeStyleMirror");
    __publicField(this, "crossOriginIframeRootIdMap", /* @__PURE__ */ new WeakMap());
    __publicField(this, "mirror");
    __publicField(this, "mutationCb");
    __publicField(this, "wrappedEmit");
    __publicField(this, "loadListener");
    __publicField(this, "stylesheetManager");
    __publicField(this, "recordCrossOriginIframes");
    this.mutationCb = options.mutationCb;
    this.wrappedEmit = options.wrappedEmit;
    this.stylesheetManager = options.stylesheetManager;
    this.recordCrossOriginIframes = options.recordCrossOriginIframes;
    this.crossOriginIframeStyleMirror = new CrossOriginIframeMirror(
      this.stylesheetManager.styleMirror.generateId.bind(
        this.stylesheetManager.styleMirror
      )
    );
    this.mirror = options.mirror;
    if (this.recordCrossOriginIframes) {
      window.addEventListener("message", this.handleMessage.bind(this));
    }
  }
  addIframe(iframeEl) {
    this.iframes.set(iframeEl, true);
    if (iframeEl.contentWindow)
      this.crossOriginIframeMap.set(iframeEl.contentWindow, iframeEl);
  }
  addLoadListener(cb) {
    this.loadListener = cb;
  }
  attachIframe(iframeEl, childSn) {
    var _a2, _b;
    this.mutationCb({
      adds: [
        {
          parentId: this.mirror.getId(iframeEl),
          nextId: null,
          node: childSn
        }
      ],
      removes: [],
      texts: [],
      attributes: [],
      isAttachIframe: true
    });
    if (this.recordCrossOriginIframes)
      (_a2 = iframeEl.contentWindow) == null ? void 0 : _a2.addEventListener(
        "message",
        this.handleMessage.bind(this)
      );
    (_b = this.loadListener) == null ? void 0 : _b.call(this, iframeEl);
    if (iframeEl.contentDocument && iframeEl.contentDocument.adoptedStyleSheets && iframeEl.contentDocument.adoptedStyleSheets.length > 0)
      this.stylesheetManager.adoptStyleSheets(
        iframeEl.contentDocument.adoptedStyleSheets,
        this.mirror.getId(iframeEl.contentDocument)
      );
  }
  handleMessage(message) {
    const crossOriginMessageEvent = message;
    if (crossOriginMessageEvent.data.type !== "rrweb" || // To filter out the rrweb messages which are forwarded by some sites.
    crossOriginMessageEvent.origin !== crossOriginMessageEvent.data.origin)
      return;
    const iframeSourceWindow = message.source;
    if (!iframeSourceWindow) return;
    const iframeEl = this.crossOriginIframeMap.get(message.source);
    if (!iframeEl) return;
    const transformedEvent = this.transformCrossOriginEvent(
      iframeEl,
      crossOriginMessageEvent.data.event
    );
    if (transformedEvent)
      this.wrappedEmit(
        transformedEvent,
        crossOriginMessageEvent.data.isCheckout
      );
  }
  transformCrossOriginEvent(iframeEl, e2) {
    var _a2;
    switch (e2.type) {
      case EventType.FullSnapshot: {
        this.crossOriginIframeMirror.reset(iframeEl);
        this.crossOriginIframeStyleMirror.reset(iframeEl);
        this.replaceIdOnNode(e2.data.node, iframeEl);
        const rootId = e2.data.node.id;
        this.crossOriginIframeRootIdMap.set(iframeEl, rootId);
        this.patchRootIdOnNode(e2.data.node, rootId);
        return {
          timestamp: e2.timestamp,
          type: EventType.IncrementalSnapshot,
          data: {
            source: IncrementalSource.Mutation,
            adds: [
              {
                parentId: this.mirror.getId(iframeEl),
                nextId: null,
                node: e2.data.node
              }
            ],
            removes: [],
            texts: [],
            attributes: [],
            isAttachIframe: true
          }
        };
      }
      case EventType.Meta:
      case EventType.Load:
      case EventType.DomContentLoaded: {
        return false;
      }
      case EventType.Plugin: {
        return e2;
      }
      case EventType.Custom: {
        this.replaceIds(
          e2.data.payload,
          iframeEl,
          ["id", "parentId", "previousId", "nextId"]
        );
        return e2;
      }
      case EventType.IncrementalSnapshot: {
        switch (e2.data.source) {
          case IncrementalSource.Mutation: {
            e2.data.adds.forEach((n2) => {
              this.replaceIds(n2, iframeEl, [
                "parentId",
                "nextId",
                "previousId"
              ]);
              this.replaceIdOnNode(n2.node, iframeEl);
              const rootId = this.crossOriginIframeRootIdMap.get(iframeEl);
              rootId && this.patchRootIdOnNode(n2.node, rootId);
            });
            e2.data.removes.forEach((n2) => {
              this.replaceIds(n2, iframeEl, ["parentId", "id"]);
            });
            e2.data.attributes.forEach((n2) => {
              this.replaceIds(n2, iframeEl, ["id"]);
            });
            e2.data.texts.forEach((n2) => {
              this.replaceIds(n2, iframeEl, ["id"]);
            });
            return e2;
          }
          case IncrementalSource.Drag:
          case IncrementalSource.TouchMove:
          case IncrementalSource.MouseMove: {
            e2.data.positions.forEach((p) => {
              this.replaceIds(p, iframeEl, ["id"]);
            });
            return e2;
          }
          case IncrementalSource.ViewportResize: {
            return false;
          }
          case IncrementalSource.MediaInteraction:
          case IncrementalSource.MouseInteraction:
          case IncrementalSource.Scroll:
          case IncrementalSource.CanvasMutation:
          case IncrementalSource.Input: {
            this.replaceIds(e2.data, iframeEl, ["id"]);
            return e2;
          }
          case IncrementalSource.StyleSheetRule:
          case IncrementalSource.StyleDeclaration: {
            this.replaceIds(e2.data, iframeEl, ["id"]);
            this.replaceStyleIds(e2.data, iframeEl, ["styleId"]);
            return e2;
          }
          case IncrementalSource.Font: {
            return e2;
          }
          case IncrementalSource.Selection: {
            e2.data.ranges.forEach((range) => {
              this.replaceIds(range, iframeEl, ["start", "end"]);
            });
            return e2;
          }
          case IncrementalSource.AdoptedStyleSheet: {
            this.replaceIds(e2.data, iframeEl, ["id"]);
            this.replaceStyleIds(e2.data, iframeEl, ["styleIds"]);
            (_a2 = e2.data.styles) == null ? void 0 : _a2.forEach((style) => {
              this.replaceStyleIds(style, iframeEl, ["styleId"]);
            });
            return e2;
          }
        }
      }
    }
    return false;
  }
  replace(iframeMirror, obj, iframeEl, keys) {
    for (const key of keys) {
      if (!Array.isArray(obj[key]) && typeof obj[key] !== "number") continue;
      if (Array.isArray(obj[key])) {
        obj[key] = iframeMirror.getIds(
          iframeEl,
          obj[key]
        );
      } else {
        obj[key] = iframeMirror.getId(iframeEl, obj[key]);
      }
    }
    return obj;
  }
  replaceIds(obj, iframeEl, keys) {
    return this.replace(this.crossOriginIframeMirror, obj, iframeEl, keys);
  }
  replaceStyleIds(obj, iframeEl, keys) {
    return this.replace(this.crossOriginIframeStyleMirror, obj, iframeEl, keys);
  }
  replaceIdOnNode(node2, iframeEl) {
    this.replaceIds(node2, iframeEl, ["id", "rootId"]);
    if ("childNodes" in node2) {
      node2.childNodes.forEach((child) => {
        this.replaceIdOnNode(child, iframeEl);
      });
    }
  }
  patchRootIdOnNode(node2, rootId) {
    if (node2.type !== NodeType.Document && !node2.rootId) node2.rootId = rootId;
    if ("childNodes" in node2) {
      node2.childNodes.forEach((child) => {
        this.patchRootIdOnNode(child, rootId);
      });
    }
  }
}
class ShadowDomManager {
  constructor(options) {
    __publicField(this, "shadowDoms", /* @__PURE__ */ new WeakSet());
    __publicField(this, "mutationCb");
    __publicField(this, "scrollCb");
    __publicField(this, "bypassOptions");
    __publicField(this, "mirror");
    __publicField(this, "restoreHandlers", []);
    this.mutationCb = options.mutationCb;
    this.scrollCb = options.scrollCb;
    this.bypassOptions = options.bypassOptions;
    this.mirror = options.mirror;
    this.init();
  }
  init() {
    this.reset();
    this.patchAttachShadow(Element, document);
  }
  addShadowRoot(shadowRoot2, doc) {
    if (!isNativeShadowDom(shadowRoot2)) return;
    if (this.shadowDoms.has(shadowRoot2)) return;
    this.shadowDoms.add(shadowRoot2);
    const observer = initMutationObserver(
      {
        ...this.bypassOptions,
        doc,
        mutationCb: this.mutationCb,
        mirror: this.mirror,
        shadowDomManager: this
      },
      shadowRoot2
    );
    this.restoreHandlers.push(() => observer.disconnect());
    this.restoreHandlers.push(
      initScrollObserver({
        ...this.bypassOptions,
        scrollCb: this.scrollCb,
        // https://gist.github.com/praveenpuglia/0832da687ed5a5d7a0907046c9ef1813
        // scroll is not allowed to pass the boundary, so we need to listen the shadow document
        doc: shadowRoot2,
        mirror: this.mirror
      })
    );
    setTimeout(() => {
      if (shadowRoot2.adoptedStyleSheets && shadowRoot2.adoptedStyleSheets.length > 0)
        this.bypassOptions.stylesheetManager.adoptStyleSheets(
          shadowRoot2.adoptedStyleSheets,
          this.mirror.getId(index.host(shadowRoot2))
        );
      this.restoreHandlers.push(
        initAdoptedStyleSheetObserver(
          {
            mirror: this.mirror,
            stylesheetManager: this.bypassOptions.stylesheetManager
          },
          shadowRoot2
        )
      );
    }, 0);
  }
  /**
   * Monkey patch 'attachShadow' of an IFrameElement to observe newly added shadow doms.
   */
  observeAttachShadow(iframeElement) {
    if (!iframeElement.contentWindow || !iframeElement.contentDocument) return;
    this.patchAttachShadow(
      iframeElement.contentWindow.Element,
      iframeElement.contentDocument
    );
  }
  /**
   * Patch 'attachShadow' to observe newly added shadow doms.
   */
  patchAttachShadow(element, doc) {
    const manager = this;
    this.restoreHandlers.push(
      patch(
        element.prototype,
        "attachShadow",
        function(original) {
          return function(option) {
            const sRoot = original.call(this, option);
            const shadowRootEl = index.shadowRoot(this);
            if (shadowRootEl && inDom(this))
              manager.addShadowRoot(shadowRootEl, doc);
            return sRoot;
          };
        }
      )
    );
  }
  reset() {
    this.restoreHandlers.forEach((handler) => {
      try {
        handler();
      } catch (e2) {
      }
    });
    this.restoreHandlers = [];
    this.shadowDoms = /* @__PURE__ */ new WeakSet();
  }
}
var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var lookup = typeof Uint8Array === "undefined" ? [] : new Uint8Array(256);
for (var i$1 = 0; i$1 < chars.length; i$1++) {
  lookup[chars.charCodeAt(i$1)] = i$1;
}
var encode = function(arraybuffer) {
  var bytes = new Uint8Array(arraybuffer), i2, len = bytes.length, base64 = "";
  for (i2 = 0; i2 < len; i2 += 3) {
    base64 += chars[bytes[i2] >> 2];
    base64 += chars[(bytes[i2] & 3) << 4 | bytes[i2 + 1] >> 4];
    base64 += chars[(bytes[i2 + 1] & 15) << 2 | bytes[i2 + 2] >> 6];
    base64 += chars[bytes[i2 + 2] & 63];
  }
  if (len % 3 === 2) {
    base64 = base64.substring(0, base64.length - 1) + "=";
  } else if (len % 3 === 1) {
    base64 = base64.substring(0, base64.length - 2) + "==";
  }
  return base64;
};
const canvasVarMap = /* @__PURE__ */ new Map();
function variableListFor$1(ctx, ctor) {
  let contextMap = canvasVarMap.get(ctx);
  if (!contextMap) {
    contextMap = /* @__PURE__ */ new Map();
    canvasVarMap.set(ctx, contextMap);
  }
  if (!contextMap.has(ctor)) {
    contextMap.set(ctor, []);
  }
  return contextMap.get(ctor);
}
const saveWebGLVar = (value, win, ctx) => {
  if (!value || !(isInstanceOfWebGLObject(value, win) || typeof value === "object"))
    return;
  const name = value.constructor.name;
  const list2 = variableListFor$1(ctx, name);
  let index2 = list2.indexOf(value);
  if (index2 === -1) {
    index2 = list2.length;
    list2.push(value);
  }
  return index2;
};
function serializeArg(value, win, ctx) {
  if (value instanceof Array) {
    return value.map((arg) => serializeArg(arg, win, ctx));
  } else if (value === null) {
    return value;
  } else if (value instanceof Float32Array || value instanceof Float64Array || value instanceof Int32Array || value instanceof Uint32Array || value instanceof Uint8Array || value instanceof Uint16Array || value instanceof Int16Array || value instanceof Int8Array || value instanceof Uint8ClampedArray) {
    const name = value.constructor.name;
    return {
      rr_type: name,
      args: [Object.values(value)]
    };
  } else if (
    // SharedArrayBuffer disabled on most browsers due to spectre.
    // More info: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer/SharedArrayBuffer
    // value instanceof SharedArrayBuffer ||
    value instanceof ArrayBuffer
  ) {
    const name = value.constructor.name;
    const base64 = encode(value);
    return {
      rr_type: name,
      base64
    };
  } else if (value instanceof DataView) {
    const name = value.constructor.name;
    return {
      rr_type: name,
      args: [
        serializeArg(value.buffer, win, ctx),
        value.byteOffset,
        value.byteLength
      ]
    };
  } else if (value instanceof HTMLImageElement) {
    const name = value.constructor.name;
    const { src } = value;
    return {
      rr_type: name,
      src
    };
  } else if (value instanceof HTMLCanvasElement) {
    const name = "HTMLImageElement";
    const src = value.toDataURL();
    return {
      rr_type: name,
      src
    };
  } else if (value instanceof ImageData) {
    const name = value.constructor.name;
    return {
      rr_type: name,
      args: [serializeArg(value.data, win, ctx), value.width, value.height]
    };
  } else if (isInstanceOfWebGLObject(value, win) || typeof value === "object") {
    const name = value.constructor.name;
    const index2 = saveWebGLVar(value, win, ctx);
    return {
      rr_type: name,
      index: index2
    };
  }
  return value;
}
const serializeArgs = (args, win, ctx) => {
  return args.map((arg) => serializeArg(arg, win, ctx));
};
const isInstanceOfWebGLObject = (value, win) => {
  const webGLConstructorNames = [
    "WebGLActiveInfo",
    "WebGLBuffer",
    "WebGLFramebuffer",
    "WebGLProgram",
    "WebGLRenderbuffer",
    "WebGLShader",
    "WebGLShaderPrecisionFormat",
    "WebGLTexture",
    "WebGLUniformLocation",
    "WebGLVertexArrayObject",
    // In old Chrome versions, value won't be an instanceof WebGLVertexArrayObject.
    "WebGLVertexArrayObjectOES"
  ];
  const supportedWebGLConstructorNames = webGLConstructorNames.filter(
    (name) => typeof win[name] === "function"
  );
  return Boolean(
    supportedWebGLConstructorNames.find(
      (name) => value instanceof win[name]
    )
  );
};
function initCanvas2DMutationObserver(cb, win, blockClass, blockSelector) {
  const handlers = [];
  const props2D = Object.getOwnPropertyNames(
    win.CanvasRenderingContext2D.prototype
  );
  for (const prop of props2D) {
    try {
      if (typeof win.CanvasRenderingContext2D.prototype[prop] !== "function") {
        continue;
      }
      const restoreHandler = patch(
        win.CanvasRenderingContext2D.prototype,
        prop,
        function(original) {
          return function(...args) {
            if (!isBlocked(this.canvas, blockClass, blockSelector, true)) {
              setTimeout(() => {
                const recordArgs = serializeArgs(args, win, this);
                cb(this.canvas, {
                  type: CanvasContext["2D"],
                  property: prop,
                  args: recordArgs
                });
              }, 0);
            }
            return original.apply(this, args);
          };
        }
      );
      handlers.push(restoreHandler);
    } catch {
      const hookHandler = hookSetter(
        win.CanvasRenderingContext2D.prototype,
        prop,
        {
          set(v2) {
            cb(this.canvas, {
              type: CanvasContext["2D"],
              property: prop,
              args: [v2],
              setter: true
            });
          }
        }
      );
      handlers.push(hookHandler);
    }
  }
  return () => {
    handlers.forEach((h) => h());
  };
}
function getNormalizedContextName(contextType) {
  return contextType === "experimental-webgl" ? "webgl" : contextType;
}
function initCanvasContextObserver(win, blockClass, blockSelector, setPreserveDrawingBufferToTrue) {
  const handlers = [];
  try {
    const restoreHandler = patch(
      win.HTMLCanvasElement.prototype,
      "getContext",
      function(original) {
        return function(contextType, ...args) {
          if (!isBlocked(this, blockClass, blockSelector, true)) {
            const ctxName = getNormalizedContextName(contextType);
            if (!("__context" in this)) this.__context = ctxName;
            if (setPreserveDrawingBufferToTrue && ["webgl", "webgl2"].includes(ctxName)) {
              if (args[0] && typeof args[0] === "object") {
                const contextAttributes = args[0];
                if (!contextAttributes.preserveDrawingBuffer) {
                  contextAttributes.preserveDrawingBuffer = true;
                }
              } else {
                args.splice(0, 1, {
                  preserveDrawingBuffer: true
                });
              }
            }
          }
          return original.apply(this, [contextType, ...args]);
        };
      }
    );
    handlers.push(restoreHandler);
  } catch {
    console.error("failed to patch HTMLCanvasElement.prototype.getContext");
  }
  return () => {
    handlers.forEach((h) => h());
  };
}
function patchGLPrototype(prototype, type, cb, blockClass, blockSelector, win) {
  const handlers = [];
  const props = Object.getOwnPropertyNames(prototype);
  for (const prop of props) {
    if (
      //prop.startsWith('get') ||  // e.g. getProgramParameter, but too risky
      [
        "isContextLost",
        "canvas",
        "drawingBufferWidth",
        "drawingBufferHeight"
      ].includes(prop)
    ) {
      continue;
    }
    try {
      if (typeof prototype[prop] !== "function") {
        continue;
      }
      const restoreHandler = patch(
        prototype,
        prop,
        function(original) {
          return function(...args) {
            const result2 = original.apply(this, args);
            saveWebGLVar(result2, win, this);
            if ("tagName" in this.canvas && !isBlocked(this.canvas, blockClass, blockSelector, true)) {
              const recordArgs = serializeArgs(args, win, this);
              const mutation = {
                type,
                property: prop,
                args: recordArgs
              };
              cb(this.canvas, mutation);
            }
            return result2;
          };
        }
      );
      handlers.push(restoreHandler);
    } catch {
      const hookHandler = hookSetter(prototype, prop, {
        set(v2) {
          cb(this.canvas, {
            type,
            property: prop,
            args: [v2],
            setter: true
          });
        }
      });
      handlers.push(hookHandler);
    }
  }
  return handlers;
}
function initCanvasWebGLMutationObserver(cb, win, blockClass, blockSelector) {
  const handlers = [];
  handlers.push(
    ...patchGLPrototype(
      win.WebGLRenderingContext.prototype,
      CanvasContext.WebGL,
      cb,
      blockClass,
      blockSelector,
      win
    )
  );
  if (typeof win.WebGL2RenderingContext !== "undefined") {
    handlers.push(
      ...patchGLPrototype(
        win.WebGL2RenderingContext.prototype,
        CanvasContext.WebGL2,
        cb,
        blockClass,
        blockSelector,
        win
      )
    );
  }
  return () => {
    handlers.forEach((h) => h());
  };
}
const encodedJs = "KGZ1bmN0aW9uKCkgewogICJ1c2Ugc3RyaWN0IjsKICB2YXIgY2hhcnMgPSAiQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLyI7CiAgdmFyIGxvb2t1cCA9IHR5cGVvZiBVaW50OEFycmF5ID09PSAidW5kZWZpbmVkIiA/IFtdIDogbmV3IFVpbnQ4QXJyYXkoMjU2KTsKICBmb3IgKHZhciBpID0gMDsgaSA8IGNoYXJzLmxlbmd0aDsgaSsrKSB7CiAgICBsb29rdXBbY2hhcnMuY2hhckNvZGVBdChpKV0gPSBpOwogIH0KICB2YXIgZW5jb2RlID0gZnVuY3Rpb24oYXJyYXlidWZmZXIpIHsKICAgIHZhciBieXRlcyA9IG5ldyBVaW50OEFycmF5KGFycmF5YnVmZmVyKSwgaTIsIGxlbiA9IGJ5dGVzLmxlbmd0aCwgYmFzZTY0ID0gIiI7CiAgICBmb3IgKGkyID0gMDsgaTIgPCBsZW47IGkyICs9IDMpIHsKICAgICAgYmFzZTY0ICs9IGNoYXJzW2J5dGVzW2kyXSA+PiAyXTsKICAgICAgYmFzZTY0ICs9IGNoYXJzWyhieXRlc1tpMl0gJiAzKSA8PCA0IHwgYnl0ZXNbaTIgKyAxXSA+PiA0XTsKICAgICAgYmFzZTY0ICs9IGNoYXJzWyhieXRlc1tpMiArIDFdICYgMTUpIDw8IDIgfCBieXRlc1tpMiArIDJdID4+IDZdOwogICAgICBiYXNlNjQgKz0gY2hhcnNbYnl0ZXNbaTIgKyAyXSAmIDYzXTsKICAgIH0KICAgIGlmIChsZW4gJSAzID09PSAyKSB7CiAgICAgIGJhc2U2NCA9IGJhc2U2NC5zdWJzdHJpbmcoMCwgYmFzZTY0Lmxlbmd0aCAtIDEpICsgIj0iOwogICAgfSBlbHNlIGlmIChsZW4gJSAzID09PSAxKSB7CiAgICAgIGJhc2U2NCA9IGJhc2U2NC5zdWJzdHJpbmcoMCwgYmFzZTY0Lmxlbmd0aCAtIDIpICsgIj09IjsKICAgIH0KICAgIHJldHVybiBiYXNlNjQ7CiAgfTsKICBjb25zdCBsYXN0QmxvYk1hcCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgTWFwKCk7CiAgY29uc3QgdHJhbnNwYXJlbnRCbG9iTWFwID0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKTsKICBhc3luYyBmdW5jdGlvbiBnZXRUcmFuc3BhcmVudEJsb2JGb3Iod2lkdGgsIGhlaWdodCwgZGF0YVVSTE9wdGlvbnMpIHsKICAgIGNvbnN0IGlkID0gYCR7d2lkdGh9LSR7aGVpZ2h0fWA7CiAgICBpZiAoIk9mZnNjcmVlbkNhbnZhcyIgaW4gZ2xvYmFsVGhpcykgewogICAgICBpZiAodHJhbnNwYXJlbnRCbG9iTWFwLmhhcyhpZCkpIHJldHVybiB0cmFuc3BhcmVudEJsb2JNYXAuZ2V0KGlkKTsKICAgICAgY29uc3Qgb2Zmc2NyZWVuID0gbmV3IE9mZnNjcmVlbkNhbnZhcyh3aWR0aCwgaGVpZ2h0KTsKICAgICAgb2Zmc2NyZWVuLmdldENvbnRleHQoIjJkIik7CiAgICAgIGNvbnN0IGJsb2IgPSBhd2FpdCBvZmZzY3JlZW4uY29udmVydFRvQmxvYihkYXRhVVJMT3B0aW9ucyk7CiAgICAgIGNvbnN0IGFycmF5QnVmZmVyID0gYXdhaXQgYmxvYi5hcnJheUJ1ZmZlcigpOwogICAgICBjb25zdCBiYXNlNjQgPSBlbmNvZGUoYXJyYXlCdWZmZXIpOwogICAgICB0cmFuc3BhcmVudEJsb2JNYXAuc2V0KGlkLCBiYXNlNjQpOwogICAgICByZXR1cm4gYmFzZTY0OwogICAgfSBlbHNlIHsKICAgICAgcmV0dXJuICIiOwogICAgfQogIH0KICBjb25zdCB3b3JrZXIgPSBzZWxmOwogIHdvcmtlci5vbm1lc3NhZ2UgPSBhc3luYyBmdW5jdGlvbihlKSB7CiAgICBpZiAoIk9mZnNjcmVlbkNhbnZhcyIgaW4gZ2xvYmFsVGhpcykgewogICAgICBjb25zdCB7IGlkLCBiaXRtYXAsIHdpZHRoLCBoZWlnaHQsIGRhdGFVUkxPcHRpb25zIH0gPSBlLmRhdGE7CiAgICAgIGNvbnN0IHRyYW5zcGFyZW50QmFzZTY0ID0gZ2V0VHJhbnNwYXJlbnRCbG9iRm9yKAogICAgICAgIHdpZHRoLAogICAgICAgIGhlaWdodCwKICAgICAgICBkYXRhVVJMT3B0aW9ucwogICAgICApOwogICAgICBjb25zdCBvZmZzY3JlZW4gPSBuZXcgT2Zmc2NyZWVuQ2FudmFzKHdpZHRoLCBoZWlnaHQpOwogICAgICBjb25zdCBjdHggPSBvZmZzY3JlZW4uZ2V0Q29udGV4dCgiMmQiKTsKICAgICAgY3R4LmRyYXdJbWFnZShiaXRtYXAsIDAsIDApOwogICAgICBiaXRtYXAuY2xvc2UoKTsKICAgICAgY29uc3QgYmxvYiA9IGF3YWl0IG9mZnNjcmVlbi5jb252ZXJ0VG9CbG9iKGRhdGFVUkxPcHRpb25zKTsKICAgICAgY29uc3QgdHlwZSA9IGJsb2IudHlwZTsKICAgICAgY29uc3QgYXJyYXlCdWZmZXIgPSBhd2FpdCBibG9iLmFycmF5QnVmZmVyKCk7CiAgICAgIGNvbnN0IGJhc2U2NCA9IGVuY29kZShhcnJheUJ1ZmZlcik7CiAgICAgIGlmICghbGFzdEJsb2JNYXAuaGFzKGlkKSAmJiBhd2FpdCB0cmFuc3BhcmVudEJhc2U2NCA9PT0gYmFzZTY0KSB7CiAgICAgICAgbGFzdEJsb2JNYXAuc2V0KGlkLCBiYXNlNjQpOwogICAgICAgIHJldHVybiB3b3JrZXIucG9zdE1lc3NhZ2UoeyBpZCB9KTsKICAgICAgfQogICAgICBpZiAobGFzdEJsb2JNYXAuZ2V0KGlkKSA9PT0gYmFzZTY0KSByZXR1cm4gd29ya2VyLnBvc3RNZXNzYWdlKHsgaWQgfSk7CiAgICAgIHdvcmtlci5wb3N0TWVzc2FnZSh7CiAgICAgICAgaWQsCiAgICAgICAgdHlwZSwKICAgICAgICBiYXNlNjQsCiAgICAgICAgd2lkdGgsCiAgICAgICAgaGVpZ2h0CiAgICAgIH0pOwogICAgICBsYXN0QmxvYk1hcC5zZXQoaWQsIGJhc2U2NCk7CiAgICB9IGVsc2UgewogICAgICByZXR1cm4gd29ya2VyLnBvc3RNZXNzYWdlKHsgaWQ6IGUuZGF0YS5pZCB9KTsKICAgIH0KICB9Owp9KSgpOwovLyMgc291cmNlTWFwcGluZ1VSTD1pbWFnZS1iaXRtYXAtZGF0YS11cmwtd29ya2VyLUlKcEM3Z19iLmpzLm1hcAo=";
const decodeBase64 = (base64) => Uint8Array.from(atob(base64), (c2) => c2.charCodeAt(0));
const blob = typeof window !== "undefined" && window.Blob && new Blob([decodeBase64(encodedJs)], { type: "text/javascript;charset=utf-8" });
function WorkerWrapper(options) {
  let objURL;
  try {
    objURL = blob && (window.URL || window.webkitURL).createObjectURL(blob);
    if (!objURL) throw "";
    const worker = new Worker(objURL, {
      name: options == null ? void 0 : options.name
    });
    worker.addEventListener("error", () => {
      (window.URL || window.webkitURL).revokeObjectURL(objURL);
    });
    return worker;
  } catch (e2) {
    return new Worker(
      "data:text/javascript;base64," + encodedJs,
      {
        name: options == null ? void 0 : options.name
      }
    );
  } finally {
    objURL && (window.URL || window.webkitURL).revokeObjectURL(objURL);
  }
}
class CanvasManager {
  constructor(options) {
    __publicField(this, "pendingCanvasMutations", /* @__PURE__ */ new Map());
    __publicField(this, "rafStamps", { latestId: 0, invokeId: null });
    __publicField(this, "mirror");
    __publicField(this, "mutationCb");
    __publicField(this, "resetObservers");
    __publicField(this, "frozen", false);
    __publicField(this, "locked", false);
    __publicField(this, "processMutation", (target, mutation) => {
      const newFrame = this.rafStamps.invokeId && this.rafStamps.latestId !== this.rafStamps.invokeId;
      if (newFrame || !this.rafStamps.invokeId)
        this.rafStamps.invokeId = this.rafStamps.latestId;
      if (!this.pendingCanvasMutations.has(target)) {
        this.pendingCanvasMutations.set(target, []);
      }
      this.pendingCanvasMutations.get(target).push(mutation);
    });
    const {
      sampling = "all",
      win,
      blockClass,
      blockSelector,
      recordCanvas,
      dataURLOptions
    } = options;
    this.mutationCb = options.mutationCb;
    this.mirror = options.mirror;
    if (recordCanvas && sampling === "all")
      this.initCanvasMutationObserver(win, blockClass, blockSelector);
    if (recordCanvas && typeof sampling === "number")
      this.initCanvasFPSObserver(sampling, win, blockClass, blockSelector, {
        dataURLOptions
      });
  }
  reset() {
    this.pendingCanvasMutations.clear();
    this.resetObservers && this.resetObservers();
  }
  freeze() {
    this.frozen = true;
  }
  unfreeze() {
    this.frozen = false;
  }
  lock() {
    this.locked = true;
  }
  unlock() {
    this.locked = false;
  }
  initCanvasFPSObserver(fps, win, blockClass, blockSelector, options) {
    const canvasContextReset = initCanvasContextObserver(
      win,
      blockClass,
      blockSelector,
      true
    );
    const snapshotInProgressMap = /* @__PURE__ */ new Map();
    const worker = new WorkerWrapper();
    worker.onmessage = (e2) => {
      const { id } = e2.data;
      snapshotInProgressMap.set(id, false);
      if (!("base64" in e2.data)) return;
      const { base64, type, width, height } = e2.data;
      this.mutationCb({
        id,
        type: CanvasContext["2D"],
        commands: [
          {
            property: "clearRect",
            // wipe canvas
            args: [0, 0, width, height]
          },
          {
            property: "drawImage",
            // draws (semi-transparent) image
            args: [
              {
                rr_type: "ImageBitmap",
                args: [
                  {
                    rr_type: "Blob",
                    data: [{ rr_type: "ArrayBuffer", base64 }],
                    type
                  }
                ]
              },
              0,
              0
            ]
          }
        ]
      });
    };
    const timeBetweenSnapshots = 1e3 / fps;
    let lastSnapshotTime = 0;
    let rafId;
    const getCanvas = () => {
      const matchedCanvas = [];
      win.document.querySelectorAll("canvas").forEach((canvas) => {
        if (!isBlocked(canvas, blockClass, blockSelector, true)) {
          matchedCanvas.push(canvas);
        }
      });
      return matchedCanvas;
    };
    const takeCanvasSnapshots = (timestamp) => {
      if (lastSnapshotTime && timestamp - lastSnapshotTime < timeBetweenSnapshots) {
        rafId = requestAnimationFrame(takeCanvasSnapshots);
        return;
      }
      lastSnapshotTime = timestamp;
      getCanvas().forEach(async (canvas) => {
        var _a2;
        const id = this.mirror.getId(canvas);
        if (snapshotInProgressMap.get(id)) return;
        if (canvas.width === 0 || canvas.height === 0) return;
        snapshotInProgressMap.set(id, true);
        if (["webgl", "webgl2"].includes(canvas.__context)) {
          const context = canvas.getContext(canvas.__context);
          if (((_a2 = context == null ? void 0 : context.getContextAttributes()) == null ? void 0 : _a2.preserveDrawingBuffer) === false) {
            context.clear(context.COLOR_BUFFER_BIT);
          }
        }
        const bitmap = await createImageBitmap(canvas);
        worker.postMessage(
          {
            id,
            bitmap,
            width: canvas.width,
            height: canvas.height,
            dataURLOptions: options.dataURLOptions
          },
          [bitmap]
        );
      });
      rafId = requestAnimationFrame(takeCanvasSnapshots);
    };
    rafId = requestAnimationFrame(takeCanvasSnapshots);
    this.resetObservers = () => {
      canvasContextReset();
      cancelAnimationFrame(rafId);
    };
  }
  initCanvasMutationObserver(win, blockClass, blockSelector) {
    this.startRAFTimestamping();
    this.startPendingCanvasMutationFlusher();
    const canvasContextReset = initCanvasContextObserver(
      win,
      blockClass,
      blockSelector,
      false
    );
    const canvas2DReset = initCanvas2DMutationObserver(
      this.processMutation.bind(this),
      win,
      blockClass,
      blockSelector
    );
    const canvasWebGL1and2Reset = initCanvasWebGLMutationObserver(
      this.processMutation.bind(this),
      win,
      blockClass,
      blockSelector
    );
    this.resetObservers = () => {
      canvasContextReset();
      canvas2DReset();
      canvasWebGL1and2Reset();
    };
  }
  startPendingCanvasMutationFlusher() {
    requestAnimationFrame(() => this.flushPendingCanvasMutations());
  }
  startRAFTimestamping() {
    const setLatestRAFTimestamp = (timestamp) => {
      this.rafStamps.latestId = timestamp;
      requestAnimationFrame(setLatestRAFTimestamp);
    };
    requestAnimationFrame(setLatestRAFTimestamp);
  }
  flushPendingCanvasMutations() {
    this.pendingCanvasMutations.forEach(
      (_values, canvas) => {
        const id = this.mirror.getId(canvas);
        this.flushPendingCanvasMutationFor(canvas, id);
      }
    );
    requestAnimationFrame(() => this.flushPendingCanvasMutations());
  }
  flushPendingCanvasMutationFor(canvas, id) {
    if (this.frozen || this.locked) {
      return;
    }
    const valuesWithType = this.pendingCanvasMutations.get(canvas);
    if (!valuesWithType || id === -1) return;
    const values = valuesWithType.map((value) => {
      const { type: type2, ...rest } = value;
      return rest;
    });
    const { type } = valuesWithType[0];
    this.mutationCb({ id, type, commands: values });
    this.pendingCanvasMutations.delete(canvas);
  }
}
class StylesheetManager {
  constructor(options) {
    __publicField(this, "trackedLinkElements", /* @__PURE__ */ new WeakSet());
    __publicField(this, "mutationCb");
    __publicField(this, "adoptedStyleSheetCb");
    __publicField(this, "styleMirror", new StyleSheetMirror());
    this.mutationCb = options.mutationCb;
    this.adoptedStyleSheetCb = options.adoptedStyleSheetCb;
  }
  attachLinkElement(linkEl, childSn) {
    if ("_cssText" in childSn.attributes)
      this.mutationCb({
        adds: [],
        removes: [],
        texts: [],
        attributes: [
          {
            id: childSn.id,
            attributes: childSn.attributes
          }
        ]
      });
    this.trackLinkElement(linkEl);
  }
  trackLinkElement(linkEl) {
    if (this.trackedLinkElements.has(linkEl)) return;
    this.trackedLinkElements.add(linkEl);
    this.trackStylesheetInLinkElement(linkEl);
  }
  adoptStyleSheets(sheets, hostId) {
    if (sheets.length === 0) return;
    const adoptedStyleSheetData = {
      id: hostId,
      styleIds: []
    };
    const styles = [];
    for (const sheet of sheets) {
      let styleId;
      if (!this.styleMirror.has(sheet)) {
        styleId = this.styleMirror.add(sheet);
        styles.push({
          styleId,
          rules: Array.from(sheet.rules || CSSRule, (r2, index2) => ({
            rule: stringifyRule(r2, sheet.href),
            index: index2
          }))
        });
      } else styleId = this.styleMirror.getId(sheet);
      adoptedStyleSheetData.styleIds.push(styleId);
    }
    if (styles.length > 0) adoptedStyleSheetData.styles = styles;
    this.adoptedStyleSheetCb(adoptedStyleSheetData);
  }
  reset() {
    this.styleMirror.reset();
    this.trackedLinkElements = /* @__PURE__ */ new WeakSet();
  }
  // TODO: take snapshot on stylesheet reload by applying event listener
  trackStylesheetInLinkElement(_linkEl) {
  }
}
class ProcessedNodeManager {
  constructor() {
    __publicField(this, "nodeMap", /* @__PURE__ */ new WeakMap());
    __publicField(this, "active", false);
  }
  inOtherBuffer(node2, thisBuffer) {
    const buffers = this.nodeMap.get(node2);
    return buffers && Array.from(buffers).some((buffer) => buffer !== thisBuffer);
  }
  add(node2, buffer) {
    if (!this.active) {
      this.active = true;
      requestAnimationFrame(() => {
        this.nodeMap = /* @__PURE__ */ new WeakMap();
        this.active = false;
      });
    }
    this.nodeMap.set(node2, (this.nodeMap.get(node2) || /* @__PURE__ */ new Set()).add(buffer));
  }
  destroy() {
  }
}
let wrappedEmit;
let takeFullSnapshot$1;
let canvasManager;
let recording = false;
try {
  if (Array.from([1], (x2) => x2 * 2)[0] !== 2) {
    const cleanFrame = document.createElement("iframe");
    document.body.appendChild(cleanFrame);
    Array.from = ((_a = cleanFrame.contentWindow) == null ? void 0 : _a.Array.from) || Array.from;
    document.body.removeChild(cleanFrame);
  }
} catch (err) {
  console.debug("Unable to override Array.from", err);
}
const mirror = createMirror$2();
function record(options = {}) {
  const {
    emit,
    checkoutEveryNms,
    checkoutEveryNth,
    blockClass = "rr-block",
    blockSelector = null,
    ignoreClass = "rr-ignore",
    ignoreSelector = null,
    maskTextClass = "rr-mask",
    maskTextSelector = null,
    inlineStylesheet = true,
    maskAllInputs,
    maskInputOptions: _maskInputOptions,
    slimDOMOptions: _slimDOMOptions,
    maskInputFn,
    maskTextFn,
    hooks,
    packFn,
    sampling = {},
    dataURLOptions = {},
    mousemoveWait,
    recordDOM = true,
    recordCanvas = false,
    recordCrossOriginIframes = false,
    recordAfter = options.recordAfter === "DOMContentLoaded" ? options.recordAfter : "load",
    userTriggeredOnInput = false,
    collectFonts = false,
    inlineImages = false,
    plugins,
    keepIframeSrcFn = () => false,
    ignoreCSSAttributes = /* @__PURE__ */ new Set([]),
    errorHandler: errorHandler2
  } = options;
  registerErrorHandler(errorHandler2);
  const inEmittingFrame = recordCrossOriginIframes ? window.parent === window : true;
  let passEmitsToParent = false;
  if (!inEmittingFrame) {
    try {
      if (window.parent.document) {
        passEmitsToParent = false;
      }
    } catch (e2) {
      passEmitsToParent = true;
    }
  }
  if (inEmittingFrame && !emit) {
    throw new Error("emit function is required");
  }
  if (!inEmittingFrame && !passEmitsToParent) {
    return () => {
    };
  }
  if (mousemoveWait !== void 0 && sampling.mousemove === void 0) {
    sampling.mousemove = mousemoveWait;
  }
  mirror.reset();
  const maskInputOptions = maskAllInputs === true ? {
    color: true,
    date: true,
    "datetime-local": true,
    email: true,
    month: true,
    number: true,
    range: true,
    search: true,
    tel: true,
    text: true,
    time: true,
    url: true,
    week: true,
    textarea: true,
    select: true,
    password: true
  } : _maskInputOptions !== void 0 ? _maskInputOptions : { password: true };
  const slimDOMOptions = _slimDOMOptions === true || _slimDOMOptions === "all" ? {
    script: true,
    comment: true,
    headFavicon: true,
    headWhitespace: true,
    headMetaSocial: true,
    headMetaRobots: true,
    headMetaHttpEquiv: true,
    headMetaVerification: true,
    // the following are off for slimDOMOptions === true,
    // as they destroy some (hidden) info:
    headMetaAuthorship: _slimDOMOptions === "all",
    headMetaDescKeywords: _slimDOMOptions === "all",
    headTitleMutations: _slimDOMOptions === "all"
  } : _slimDOMOptions ? _slimDOMOptions : {};
  polyfill$1();
  let lastFullSnapshotEvent;
  let incrementalSnapshotCount = 0;
  const eventProcessor = (e2) => {
    for (const plugin3 of plugins || []) {
      if (plugin3.eventProcessor) {
        e2 = plugin3.eventProcessor(e2);
      }
    }
    if (packFn && // Disable packing events which will be emitted to parent frames.
    !passEmitsToParent) {
      e2 = packFn(e2);
    }
    return e2;
  };
  wrappedEmit = (r2, isCheckout) => {
    var _a2;
    const e2 = r2;
    e2.timestamp = nowTimestamp();
    if (((_a2 = mutationBuffers[0]) == null ? void 0 : _a2.isFrozen()) && e2.type !== EventType.FullSnapshot && !(e2.type === EventType.IncrementalSnapshot && e2.data.source === IncrementalSource.Mutation)) {
      mutationBuffers.forEach((buf) => buf.unfreeze());
    }
    if (inEmittingFrame) {
      emit == null ? void 0 : emit(eventProcessor(e2), isCheckout);
    } else if (passEmitsToParent) {
      const message = {
        type: "rrweb",
        event: eventProcessor(e2),
        origin: window.location.origin,
        isCheckout
      };
      window.parent.postMessage(message, "*");
    }
    if (e2.type === EventType.FullSnapshot) {
      lastFullSnapshotEvent = e2;
      incrementalSnapshotCount = 0;
    } else if (e2.type === EventType.IncrementalSnapshot) {
      if (e2.data.source === IncrementalSource.Mutation && e2.data.isAttachIframe) {
        return;
      }
      incrementalSnapshotCount++;
      const exceedCount = checkoutEveryNth && incrementalSnapshotCount >= checkoutEveryNth;
      const exceedTime = checkoutEveryNms && e2.timestamp - lastFullSnapshotEvent.timestamp > checkoutEveryNms;
      if (exceedCount || exceedTime) {
        takeFullSnapshot$1(true);
      }
    }
  };
  const wrappedMutationEmit = (m) => {
    wrappedEmit({
      type: EventType.IncrementalSnapshot,
      data: {
        source: IncrementalSource.Mutation,
        ...m
      }
    });
  };
  const wrappedScrollEmit = (p) => wrappedEmit({
    type: EventType.IncrementalSnapshot,
    data: {
      source: IncrementalSource.Scroll,
      ...p
    }
  });
  const wrappedCanvasMutationEmit = (p) => wrappedEmit({
    type: EventType.IncrementalSnapshot,
    data: {
      source: IncrementalSource.CanvasMutation,
      ...p
    }
  });
  const wrappedAdoptedStyleSheetEmit = (a2) => wrappedEmit({
    type: EventType.IncrementalSnapshot,
    data: {
      source: IncrementalSource.AdoptedStyleSheet,
      ...a2
    }
  });
  const stylesheetManager = new StylesheetManager({
    mutationCb: wrappedMutationEmit,
    adoptedStyleSheetCb: wrappedAdoptedStyleSheetEmit
  });
  const iframeManager = new IframeManager({
    mirror,
    mutationCb: wrappedMutationEmit,
    stylesheetManager,
    recordCrossOriginIframes,
    wrappedEmit
  });
  for (const plugin3 of plugins || []) {
    if (plugin3.getMirror)
      plugin3.getMirror({
        nodeMirror: mirror,
        crossOriginIframeMirror: iframeManager.crossOriginIframeMirror,
        crossOriginIframeStyleMirror: iframeManager.crossOriginIframeStyleMirror
      });
  }
  const processedNodeManager = new ProcessedNodeManager();
  canvasManager = new CanvasManager({
    recordCanvas,
    mutationCb: wrappedCanvasMutationEmit,
    win: window,
    blockClass,
    blockSelector,
    mirror,
    sampling: sampling.canvas,
    dataURLOptions
  });
  const shadowDomManager = new ShadowDomManager({
    mutationCb: wrappedMutationEmit,
    scrollCb: wrappedScrollEmit,
    bypassOptions: {
      blockClass,
      blockSelector,
      maskTextClass,
      maskTextSelector,
      inlineStylesheet,
      maskInputOptions,
      dataURLOptions,
      maskTextFn,
      maskInputFn,
      recordCanvas,
      inlineImages,
      sampling,
      slimDOMOptions,
      iframeManager,
      stylesheetManager,
      canvasManager,
      keepIframeSrcFn,
      processedNodeManager
    },
    mirror
  });
  takeFullSnapshot$1 = (isCheckout = false) => {
    if (!recordDOM) {
      return;
    }
    wrappedEmit(
      {
        type: EventType.Meta,
        data: {
          href: window.location.href,
          width: getWindowWidth(),
          height: getWindowHeight()
        }
      },
      isCheckout
    );
    stylesheetManager.reset();
    shadowDomManager.init();
    mutationBuffers.forEach((buf) => buf.lock());
    const node2 = snapshot(document, {
      mirror,
      blockClass,
      blockSelector,
      maskTextClass,
      maskTextSelector,
      inlineStylesheet,
      maskAllInputs: maskInputOptions,
      maskTextFn,
      maskInputFn,
      slimDOM: slimDOMOptions,
      dataURLOptions,
      recordCanvas,
      inlineImages,
      onSerialize: (n2) => {
        if (isSerializedIframe(n2, mirror)) {
          iframeManager.addIframe(n2);
        }
        if (isSerializedStylesheet(n2, mirror)) {
          stylesheetManager.trackLinkElement(n2);
        }
        if (hasShadowRoot(n2)) {
          shadowDomManager.addShadowRoot(index.shadowRoot(n2), document);
        }
      },
      onIframeLoad: (iframe, childSn) => {
        iframeManager.attachIframe(iframe, childSn);
        shadowDomManager.observeAttachShadow(iframe);
      },
      onStylesheetLoad: (linkEl, childSn) => {
        stylesheetManager.attachLinkElement(linkEl, childSn);
      },
      keepIframeSrcFn
    });
    if (!node2) {
      return console.warn("Failed to snapshot the document");
    }
    wrappedEmit(
      {
        type: EventType.FullSnapshot,
        data: {
          node: node2,
          initialOffset: getWindowScroll(window)
        }
      },
      isCheckout
    );
    mutationBuffers.forEach((buf) => buf.unlock());
    if (document.adoptedStyleSheets && document.adoptedStyleSheets.length > 0)
      stylesheetManager.adoptStyleSheets(
        document.adoptedStyleSheets,
        mirror.getId(document)
      );
  };
  try {
    const handlers = [];
    const observe = (doc) => {
      var _a2;
      return callbackWrapper(initObservers)(
        {
          mutationCb: wrappedMutationEmit,
          mousemoveCb: (positions, source) => wrappedEmit({
            type: EventType.IncrementalSnapshot,
            data: {
              source,
              positions
            }
          }),
          mouseInteractionCb: (d) => wrappedEmit({
            type: EventType.IncrementalSnapshot,
            data: {
              source: IncrementalSource.MouseInteraction,
              ...d
            }
          }),
          scrollCb: wrappedScrollEmit,
          viewportResizeCb: (d) => wrappedEmit({
            type: EventType.IncrementalSnapshot,
            data: {
              source: IncrementalSource.ViewportResize,
              ...d
            }
          }),
          inputCb: (v2) => wrappedEmit({
            type: EventType.IncrementalSnapshot,
            data: {
              source: IncrementalSource.Input,
              ...v2
            }
          }),
          mediaInteractionCb: (p) => wrappedEmit({
            type: EventType.IncrementalSnapshot,
            data: {
              source: IncrementalSource.MediaInteraction,
              ...p
            }
          }),
          styleSheetRuleCb: (r2) => wrappedEmit({
            type: EventType.IncrementalSnapshot,
            data: {
              source: IncrementalSource.StyleSheetRule,
              ...r2
            }
          }),
          styleDeclarationCb: (r2) => wrappedEmit({
            type: EventType.IncrementalSnapshot,
            data: {
              source: IncrementalSource.StyleDeclaration,
              ...r2
            }
          }),
          canvasMutationCb: wrappedCanvasMutationEmit,
          fontCb: (p) => wrappedEmit({
            type: EventType.IncrementalSnapshot,
            data: {
              source: IncrementalSource.Font,
              ...p
            }
          }),
          selectionCb: (p) => {
            wrappedEmit({
              type: EventType.IncrementalSnapshot,
              data: {
                source: IncrementalSource.Selection,
                ...p
              }
            });
          },
          customElementCb: (c2) => {
            wrappedEmit({
              type: EventType.IncrementalSnapshot,
              data: {
                source: IncrementalSource.CustomElement,
                ...c2
              }
            });
          },
          blockClass,
          ignoreClass,
          ignoreSelector,
          maskTextClass,
          maskTextSelector,
          maskInputOptions,
          inlineStylesheet,
          sampling,
          recordDOM,
          recordCanvas,
          inlineImages,
          userTriggeredOnInput,
          collectFonts,
          doc,
          maskInputFn,
          maskTextFn,
          keepIframeSrcFn,
          blockSelector,
          slimDOMOptions,
          dataURLOptions,
          mirror,
          iframeManager,
          stylesheetManager,
          shadowDomManager,
          processedNodeManager,
          canvasManager,
          ignoreCSSAttributes,
          plugins: ((_a2 = plugins == null ? void 0 : plugins.filter((p) => p.observer)) == null ? void 0 : _a2.map((p) => ({
            observer: p.observer,
            options: p.options,
            callback: (payload) => wrappedEmit({
              type: EventType.Plugin,
              data: {
                plugin: p.name,
                payload
              }
            })
          }))) || []
        },
        hooks
      );
    };
    iframeManager.addLoadListener((iframeEl) => {
      try {
        handlers.push(observe(iframeEl.contentDocument));
      } catch (error) {
        console.warn(error);
      }
    });
    const init = () => {
      takeFullSnapshot$1();
      handlers.push(observe(document));
      recording = true;
    };
    if (document.readyState === "interactive" || document.readyState === "complete") {
      init();
    } else {
      handlers.push(
        on("DOMContentLoaded", () => {
          wrappedEmit({
            type: EventType.DomContentLoaded,
            data: {}
          });
          if (recordAfter === "DOMContentLoaded") init();
        })
      );
      handlers.push(
        on(
          "load",
          () => {
            wrappedEmit({
              type: EventType.Load,
              data: {}
            });
            if (recordAfter === "load") init();
          },
          window
        )
      );
    }
    return () => {
      handlers.forEach((h) => h());
      processedNodeManager.destroy();
      recording = false;
      unregisterErrorHandler();
    };
  } catch (error) {
    console.warn(error);
  }
}
record.addCustomEvent = (tag, payload) => {
  if (!recording) {
    throw new Error("please add custom event after start recording");
  }
  wrappedEmit({
    type: EventType.Custom,
    data: {
      tag,
      payload
    }
  });
};
record.freezePage = () => {
  mutationBuffers.forEach((buf) => buf.freeze());
};
record.takeFullSnapshot = (isCheckout) => {
  if (!recording) {
    throw new Error("please take full snapshot after start recording");
  }
  takeFullSnapshot$1(isCheckout);
};
record.mirror = mirror;
var n;
!function(t2) {
  t2[t2.NotStarted = 0] = "NotStarted", t2[t2.Running = 1] = "Running", t2[t2.Stopped = 2] = "Stopped";
}(n || (n = {}));
exports.record = record;
//# sourceMappingURL=record.cjs.map


/***/ }),
/* 32 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

(function (global, factory) {
	 true ? module.exports = factory() :
	0;
}(this, (function () { 'use strict';

	/*! MIT License © Sindre Sorhus */

	const globals = {};

	const getGlobal = property => {
		/* istanbul ignore next */
		if (typeof self !== 'undefined' && self && property in self) {
			return self;
		}

		/* istanbul ignore next */
		if (typeof window !== 'undefined' && window && property in window) {
			return window;
		}

		if (typeof __webpack_require__.g !== 'undefined' && __webpack_require__.g && property in __webpack_require__.g) {
			return __webpack_require__.g;
		}

		/* istanbul ignore next */
		if (typeof globalThis !== 'undefined' && globalThis) {
			return globalThis;
		}
	};

	const globalProperties = [
		'Headers',
		'Request',
		'Response',
		'ReadableStream',
		'fetch',
		'AbortController',
		'FormData'
	];

	for (const property of globalProperties) {
		Object.defineProperty(globals, property, {
			get() {
				const globalObject = getGlobal(property);
				const value = globalObject && globalObject[property];
				return typeof value === 'function' ? value.bind(globalObject) : value;
			}
		});
	}

	const isObject = value => value !== null && typeof value === 'object';
	const supportsAbortController = typeof globals.AbortController === 'function';
	const supportsStreams = typeof globals.ReadableStream === 'function';
	const supportsFormData = typeof globals.FormData === 'function';

	const mergeHeaders = (source1, source2) => {
		const result = new globals.Headers(source1 || {});
		const isHeadersInstance = source2 instanceof globals.Headers;
		const source = new globals.Headers(source2 || {});

		for (const [key, value] of source) {
			if ((isHeadersInstance && value === 'undefined') || value === undefined) {
				result.delete(key);
			} else {
				result.set(key, value);
			}
		}

		return result;
	};

	const deepMerge = (...sources) => {
		let returnValue = {};
		let headers = {};

		for (const source of sources) {
			if (Array.isArray(source)) {
				if (!(Array.isArray(returnValue))) {
					returnValue = [];
				}

				returnValue = [...returnValue, ...source];
			} else if (isObject(source)) {
				for (let [key, value] of Object.entries(source)) {
					if (isObject(value) && (key in returnValue)) {
						value = deepMerge(returnValue[key], value);
					}

					returnValue = {...returnValue, [key]: value};
				}

				if (isObject(source.headers)) {
					headers = mergeHeaders(headers, source.headers);
				}
			}

			returnValue.headers = headers;
		}

		return returnValue;
	};

	const requestMethods = [
		'get',
		'post',
		'put',
		'patch',
		'head',
		'delete'
	];

	const responseTypes = {
		json: 'application/json',
		text: 'text/*',
		formData: 'multipart/form-data',
		arrayBuffer: '*/*',
		blob: '*/*'
	};

	const retryMethods = [
		'get',
		'put',
		'head',
		'delete',
		'options',
		'trace'
	];

	const retryStatusCodes = [
		408,
		413,
		429,
		500,
		502,
		503,
		504
	];

	const retryAfterStatusCodes = [
		413,
		429,
		503
	];

	const stop = Symbol('stop');

	class HTTPError extends Error {
		constructor(response) {
			// Set the message to the status text, such as Unauthorized,
			// with some fallbacks. This message should never be undefined.
			super(
				response.statusText ||
				String(
					(response.status === 0 || response.status) ?
						response.status : 'Unknown response error'
				)
			);
			this.name = 'HTTPError';
			this.response = response;
		}
	}

	class TimeoutError extends Error {
		constructor(request) {
			super('Request timed out');
			this.name = 'TimeoutError';
			this.request = request;
		}
	}

	const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

	// `Promise.race()` workaround (#91)
	const timeout = (request, abortController, options) =>
		new Promise((resolve, reject) => {
			const timeoutID = setTimeout(() => {
				if (abortController) {
					abortController.abort();
				}

				reject(new TimeoutError(request));
			}, options.timeout);

			/* eslint-disable promise/prefer-await-to-then */
			options.fetch(request)
				.then(resolve)
				.catch(reject)
				.then(() => {
					clearTimeout(timeoutID);
				});
			/* eslint-enable promise/prefer-await-to-then */
		});

	const normalizeRequestMethod = input => requestMethods.includes(input) ? input.toUpperCase() : input;

	const defaultRetryOptions = {
		limit: 2,
		methods: retryMethods,
		statusCodes: retryStatusCodes,
		afterStatusCodes: retryAfterStatusCodes
	};

	const normalizeRetryOptions = (retry = {}) => {
		if (typeof retry === 'number') {
			return {
				...defaultRetryOptions,
				limit: retry
			};
		}

		if (retry.methods && !Array.isArray(retry.methods)) {
			throw new Error('retry.methods must be an array');
		}

		if (retry.statusCodes && !Array.isArray(retry.statusCodes)) {
			throw new Error('retry.statusCodes must be an array');
		}

		return {
			...defaultRetryOptions,
			...retry,
			afterStatusCodes: retryAfterStatusCodes
		};
	};

	// The maximum value of a 32bit int (see issue #117)
	const maxSafeTimeout = 2147483647;

	class Ky {
		constructor(input, options = {}) {
			this._retryCount = 0;
			this._input = input;
			this._options = {
				// TODO: credentials can be removed when the spec change is implemented in all browsers. Context: https://www.chromestatus.com/feature/4539473312350208
				credentials: this._input.credentials || 'same-origin',
				...options,
				headers: mergeHeaders(this._input.headers, options.headers),
				hooks: deepMerge({
					beforeRequest: [],
					beforeRetry: [],
					afterResponse: []
				}, options.hooks),
				method: normalizeRequestMethod(options.method || this._input.method),
				prefixUrl: String(options.prefixUrl || ''),
				retry: normalizeRetryOptions(options.retry),
				throwHttpErrors: options.throwHttpErrors !== false,
				timeout: typeof options.timeout === 'undefined' ? 10000 : options.timeout,
				fetch: options.fetch || globals.fetch
			};

			if (typeof this._input !== 'string' && !(this._input instanceof URL || this._input instanceof globals.Request)) {
				throw new TypeError('`input` must be a string, URL, or Request');
			}

			if (this._options.prefixUrl && typeof this._input === 'string') {
				if (this._input.startsWith('/')) {
					throw new Error('`input` must not begin with a slash when using `prefixUrl`');
				}

				if (!this._options.prefixUrl.endsWith('/')) {
					this._options.prefixUrl += '/';
				}

				this._input = this._options.prefixUrl + this._input;
			}

			if (supportsAbortController) {
				this.abortController = new globals.AbortController();
				if (this._options.signal) {
					this._options.signal.addEventListener('abort', () => {
						this.abortController.abort();
					});
				}

				this._options.signal = this.abortController.signal;
			}

			this.request = new globals.Request(this._input, this._options);

			if (this._options.searchParams) {
				const searchParams = '?' + new URLSearchParams(this._options.searchParams).toString();
				const url = this.request.url.replace(/(?:\?.*?)?(?=#|$)/, searchParams);

				// To provide correct form boundary, Content-Type header should be deleted each time when new Request instantiated from another one
				if (((supportsFormData && this._options.body instanceof globals.FormData) || this._options.body instanceof URLSearchParams) && !(this._options.headers && this._options.headers['content-type'])) {
					this.request.headers.delete('content-type');
				}

				this.request = new globals.Request(new globals.Request(url, this.request), this._options);
			}

			if (this._options.json !== undefined) {
				this._options.body = JSON.stringify(this._options.json);
				this.request.headers.set('content-type', 'application/json');
				this.request = new globals.Request(this.request, {body: this._options.body});
			}

			const fn = async () => {
				if (this._options.timeout > maxSafeTimeout) {
					throw new RangeError(`The \`timeout\` option cannot be greater than ${maxSafeTimeout}`);
				}

				await delay(1);
				let response = await this._fetch();

				for (const hook of this._options.hooks.afterResponse) {
					// eslint-disable-next-line no-await-in-loop
					const modifiedResponse = await hook(
						this.request,
						this._options,
						this._decorateResponse(response.clone())
					);

					if (modifiedResponse instanceof globals.Response) {
						response = modifiedResponse;
					}
				}

				this._decorateResponse(response);

				if (!response.ok && this._options.throwHttpErrors) {
					throw new HTTPError(response);
				}

				// If `onDownloadProgress` is passed, it uses the stream API internally
				/* istanbul ignore next */
				if (this._options.onDownloadProgress) {
					if (typeof this._options.onDownloadProgress !== 'function') {
						throw new TypeError('The `onDownloadProgress` option must be a function');
					}

					if (!supportsStreams) {
						throw new Error('Streams are not supported in your environment. `ReadableStream` is missing.');
					}

					return this._stream(response.clone(), this._options.onDownloadProgress);
				}

				return response;
			};

			const isRetriableMethod = this._options.retry.methods.includes(this.request.method.toLowerCase());
			const result = isRetriableMethod ? this._retry(fn) : fn();

			for (const [type, mimeType] of Object.entries(responseTypes)) {
				result[type] = async () => {
					this.request.headers.set('accept', this.request.headers.get('accept') || mimeType);

					const response = (await result).clone();

					if (type === 'json') {
						if (response.status === 204) {
							return '';
						}

						if (options.parseJson) {
							return options.parseJson(await response.text());
						}
					}

					return response[type]();
				};
			}

			return result;
		}

		_calculateRetryDelay(error) {
			this._retryCount++;

			if (this._retryCount < this._options.retry.limit && !(error instanceof TimeoutError)) {
				if (error instanceof HTTPError) {
					if (!this._options.retry.statusCodes.includes(error.response.status)) {
						return 0;
					}

					const retryAfter = error.response.headers.get('Retry-After');
					if (retryAfter && this._options.retry.afterStatusCodes.includes(error.response.status)) {
						let after = Number(retryAfter);
						if (Number.isNaN(after)) {
							after = Date.parse(retryAfter) - Date.now();
						} else {
							after *= 1000;
						}

						if (typeof this._options.retry.maxRetryAfter !== 'undefined' && after > this._options.retry.maxRetryAfter) {
							return 0;
						}

						return after;
					}

					if (error.response.status === 413) {
						return 0;
					}
				}

				const BACKOFF_FACTOR = 0.3;
				return BACKOFF_FACTOR * (2 ** (this._retryCount - 1)) * 1000;
			}

			return 0;
		}

		_decorateResponse(response) {
			if (this._options.parseJson) {
				response.json = async () => {
					return this._options.parseJson(await response.text());
				};
			}

			return response;
		}

		async _retry(fn) {
			try {
				return await fn();
			} catch (error) {
				const ms = Math.min(this._calculateRetryDelay(error), maxSafeTimeout);
				if (ms !== 0 && this._retryCount > 0) {
					await delay(ms);

					for (const hook of this._options.hooks.beforeRetry) {
						// eslint-disable-next-line no-await-in-loop
						const hookResult = await hook({
							request: this.request,
							options: this._options,
							error,
							retryCount: this._retryCount
						});

						// If `stop` is returned from the hook, the retry process is stopped
						if (hookResult === stop) {
							return;
						}
					}

					return this._retry(fn);
				}

				if (this._options.throwHttpErrors) {
					throw error;
				}
			}
		}

		async _fetch() {
			for (const hook of this._options.hooks.beforeRequest) {
				// eslint-disable-next-line no-await-in-loop
				const result = await hook(this.request, this._options);

				if (result instanceof Request) {
					this.request = result;
					break;
				}

				if (result instanceof Response) {
					return result;
				}
			}

			if (this._options.timeout === false) {
				return this._options.fetch(this.request.clone());
			}

			return timeout(this.request.clone(), this.abortController, this._options);
		}

		/* istanbul ignore next */
		_stream(response, onDownloadProgress) {
			const totalBytes = Number(response.headers.get('content-length')) || 0;
			let transferredBytes = 0;

			return new globals.Response(
				new globals.ReadableStream({
					start(controller) {
						const reader = response.body.getReader();

						if (onDownloadProgress) {
							onDownloadProgress({percent: 0, transferredBytes: 0, totalBytes}, new Uint8Array());
						}

						async function read() {
							const {done, value} = await reader.read();
							if (done) {
								controller.close();
								return;
							}

							if (onDownloadProgress) {
								transferredBytes += value.byteLength;
								const percent = totalBytes === 0 ? 0 : transferredBytes / totalBytes;
								onDownloadProgress({percent, transferredBytes, totalBytes}, value);
							}

							controller.enqueue(value);
							read();
						}

						read();
					}
				})
			);
		}
	}

	const validateAndMerge = (...sources) => {
		for (const source of sources) {
			if ((!isObject(source) || Array.isArray(source)) && typeof source !== 'undefined') {
				throw new TypeError('The `options` argument must be an object');
			}
		}

		return deepMerge({}, ...sources);
	};

	const createInstance = defaults => {
		const ky = (input, options) => new Ky(input, validateAndMerge(defaults, options));

		for (const method of requestMethods) {
			ky[method] = (input, options) => new Ky(input, validateAndMerge(defaults, options, {method}));
		}

		ky.HTTPError = HTTPError;
		ky.TimeoutError = TimeoutError;
		ky.create = newDefaults => createInstance(validateAndMerge(newDefaults));
		ky.extend = newDefaults => createInstance(validateAndMerge(defaults, newDefaults));
		ky.stop = stop;

		return ky;
	};

	var index = createInstance();

	return index;

})));


/***/ }),
/* 33 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AbortError: () => (/* binding */ AbortError),
/* harmony export */   TimeoutError: () => (/* binding */ TimeoutError),
/* harmony export */   "default": () => (/* binding */ pTimeout)
/* harmony export */ });
class TimeoutError extends Error {
	constructor(message) {
		super(message);
		this.name = 'TimeoutError';
	}
}

/**
An error to be thrown when the request is aborted by AbortController.
DOMException is thrown instead of this Error when DOMException is available.
*/
class AbortError extends Error {
	constructor(message) {
		super();
		this.name = 'AbortError';
		this.message = message;
	}
}

/**
TODO: Remove AbortError and just throw DOMException when targeting Node 18.
*/
const getDOMException = errorMessage => globalThis.DOMException === undefined
	? new AbortError(errorMessage)
	: new DOMException(errorMessage);

/**
TODO: Remove below function and just 'reject(signal.reason)' when targeting Node 18.
*/
const getAbortedReason = signal => {
	const reason = signal.reason === undefined
		? getDOMException('This operation was aborted.')
		: signal.reason;

	return reason instanceof Error ? reason : getDOMException(reason);
};

function pTimeout(promise, options) {
	const {
		milliseconds,
		fallback,
		message,
		customTimers = {setTimeout, clearTimeout},
	} = options;

	let timer;

	const cancelablePromise = new Promise((resolve, reject) => {
		if (typeof milliseconds !== 'number' || Math.sign(milliseconds) !== 1) {
			throw new TypeError(`Expected \`milliseconds\` to be a positive number, got \`${milliseconds}\``);
		}

		if (milliseconds === Number.POSITIVE_INFINITY) {
			resolve(promise);
			return;
		}

		if (options.signal) {
			const {signal} = options;
			if (signal.aborted) {
				reject(getAbortedReason(signal));
			}

			signal.addEventListener('abort', () => {
				reject(getAbortedReason(signal));
			});
		}

		// We create the error outside of `setTimeout` to preserve the stack trace.
		const timeoutError = new TimeoutError();

		timer = customTimers.setTimeout.call(undefined, () => {
			if (fallback) {
				try {
					resolve(fallback());
				} catch (error) {
					reject(error);
				}

				return;
			}

			if (typeof promise.cancel === 'function') {
				promise.cancel();
			}

			if (message === false) {
				resolve();
			} else if (message instanceof Error) {
				reject(message);
			} else {
				timeoutError.message = message ?? `Promise timed out after ${milliseconds} milliseconds`;
				reject(timeoutError);
			}
		}, milliseconds);

		(async () => {
			try {
				resolve(await promise);
			} catch (error) {
				reject(error);
			} finally {
				customTimers.clearTimeout.call(undefined, timer);
			}
		})();
	});

	cancelablePromise.clear = () => {
		customTimers.clearTimeout.call(undefined, timer);
		timer = undefined;
	};

	return cancelablePromise;
}


/***/ }),
/* 34 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TimeoutError: () => (/* reexport safe */ p_timeout__WEBPACK_IMPORTED_MODULE_0__.TimeoutError),
/* harmony export */   "default": () => (/* binding */ pWaitFor)
/* harmony export */ });
/* harmony import */ var p_timeout__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(33);


const resolveValue = Symbol('resolveValue');

async function pWaitFor(condition, options = {}) {
	const {
		interval = 20,
		timeout = Number.POSITIVE_INFINITY,
		before = true,
	} = options;

	let retryTimeout;
	let abort = false;

	const promise = new Promise((resolve, reject) => {
		const check = async () => {
			try {
				const value = await condition();

				if (typeof value === 'object' && value[resolveValue]) {
					resolve(value[resolveValue]);
				} else if (typeof value !== 'boolean') {
					throw new TypeError('Expected condition to return a boolean');
				} else if (value === true) {
					resolve();
				} else if (!abort) {
					retryTimeout = setTimeout(check, interval);
				}
			} catch (error) {
				reject(error);
			}
		};

		if (before) {
			check();
		} else {
			retryTimeout = setTimeout(check, interval);
		}
	});

	if (timeout === Number.POSITIVE_INFINITY) {
		return promise;
	}

	try {
		return await (0,p_timeout__WEBPACK_IMPORTED_MODULE_0__["default"])(promise, typeof timeout === 'number' ? {milliseconds: timeout} : timeout);
	} finally {
		abort = true;
		clearTimeout(retryTimeout);
	}
}

pWaitFor.resolveWith = value => ({[resolveValue]: value});




/***/ }),
/* 35 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(2);
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.blobToBase64 = blobToBase64;
exports.callStringFunction = callStringFunction;
exports.deserializeStringFunction = deserializeStringFunction;
var _regenerator = _interopRequireDefault(__webpack_require__(4));
var _asyncToGenerator2 = _interopRequireDefault(__webpack_require__(16));
/**
 * Convert a blob object to a base64 uri
 *
 * @param {Blob} blob : blob object
 * @returns {Promise.<string>} : base64 form of the blob
 */
function blobToBase64(_x) {
  return _blobToBase.apply(this, arguments);
}
/**
 * Convert a string function to the corresponding function.
 *
 * @param {string} fnString - function string to convert
 * @returns {Function} - the resulting function
 */
function _blobToBase() {
  _blobToBase = (0, _asyncToGenerator2.default)(/*#__PURE__*/_regenerator.default.mark(function _callee(blob) {
    var reader;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          reader = new window.FileReader();
          _context.next = 3;
          return new Promise(function (resolve, reject) {
            reader.onload = resolve;
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
        case 3:
          return _context.abrupt("return", reader.result);
        case 4:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _blobToBase.apply(this, arguments);
}
function deserializeStringFunction(fnString) {
  return eval('(' + fnString.trim() + ')');
}

/**
 * Calls and awaits the given string function with given arguments
 *
 * @param {string} fnString - function string to convert
 * @returns {Promise<any>} - the result of the execution of the string function
 */
function callStringFunction(_x2) {
  return _callStringFunction.apply(this, arguments);
}
function _callStringFunction() {
  _callStringFunction = (0, _asyncToGenerator2.default)(/*#__PURE__*/_regenerator.default.mark(function _callee2(fnString) {
    var fn,
      _len,
      args,
      _key,
      _args2 = arguments;
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          fn = deserializeStringFunction(fnString);
          for (_len = _args2.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = _args2[_key];
          }
          _context2.next = 4;
          return fn.apply(void 0, args);
        case 4:
          return _context2.abrupt("return", _context2.sent);
        case 5:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return _callStringFunction.apply(this, arguments);
}

/***/ }),
/* 36 */
/***/ ((module) => {

"use strict";
module.exports = /*#__PURE__*/JSON.parse('{"name":"cozy-clisk","version":"0.40.0","description":"All the libs needed to run a cozy client connector","repository":{"type":"git","url":"git+https://github.com/konnectors/libs.git"},"files":["dist"],"keywords":["konnector"],"main":"dist/index.js","author":"doubleface <christophe@cozycloud.cc>","license":"MIT","bugs":{"url":"https://github.com/konnectors/libs/issues"},"homepage":"https://github.com/konnectors/libs#readme","scripts":{"lint":"eslint \'src/**/*.js\'","prepublishOnly":"yarn run build","build":"babel --root-mode upward src/ -d dist/ --copy-files --verbose --ignore \'**/*.spec.js\',\'**/*.spec.jsx\'","test":"jest src"},"devDependencies":{"@babel/core":"7.26.10","babel-jest":"29.7.0","babel-preset-cozy-app":"2.1.0","eslint-plugin-import":"^2.29.1","eslint-plugin-jest":"^27.9.0","eslint-plugin-prettier":"^5.1.3","jest":"29.7.0","jest-environment-jsdom":"29.7.0","prettier":"^3.2.5","typescript":"4.9.5"},"dependencies":{"@cozy/minilog":"^1.0.0","@rrweb/record":"^2.0.0-alpha.18","bluebird-retry":"^0.11.0","ky":"^0.25.1","lodash":"^4.17.21","microee":"^0.0.6","p-timeout":"^6.0.0","p-wait-for":"^5.0.2","post-me":"^0.4.5"},"peerDependencies":{"cozy-client":">=41.2.0"},"gitHead":"cfbf6d76782652fd73bc6d2d3198ffecec581526"}');

/***/ }),
/* 37 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(2);
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(__webpack_require__(4));
var _asyncToGenerator2 = _interopRequireDefault(__webpack_require__(16));
var _classCallCheck2 = _interopRequireDefault(__webpack_require__(17));
var _createClass2 = _interopRequireDefault(__webpack_require__(18));
var _possibleConstructorReturn2 = _interopRequireDefault(__webpack_require__(38));
var _getPrototypeOf2 = _interopRequireDefault(__webpack_require__(40));
var _inherits2 = _interopRequireDefault(__webpack_require__(41));
var _postMe = __webpack_require__(43);
var _ContentScriptMessenger = _interopRequireDefault(__webpack_require__(44));
var _bridgeInterfaces = __webpack_require__(45);
function _callSuper(t, o, e) { return o = (0, _getPrototypeOf2.default)(o), (0, _possibleConstructorReturn2.default)(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], (0, _getPrototypeOf2.default)(t).constructor) : o.apply(t, e)); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
/**
 * Bridge to the Launcher object via post-me
 */
var LauncherBridge = exports["default"] = /*#__PURE__*/function (_Bridge) {
  (0, _inherits2.default)(LauncherBridge, _Bridge);
  /**
   * Init the window which will be used to communicate with the launcher
   *
   * @param {object} options             : option object
   * @param {object} options.localWindow : The window used to communicate with the launcher
   */
  function LauncherBridge(_ref) {
    var _this;
    var localWindow = _ref.localWindow;
    (0, _classCallCheck2.default)(this, LauncherBridge);
    _this = _callSuper(this, LauncherBridge);
    _this.localWindow = localWindow;
    return _this;
  }
  (0, _createClass2.default)(LauncherBridge, [{
    key: "init",
    value: function () {
      var _init = (0, _asyncToGenerator2.default)(/*#__PURE__*/_regenerator.default.mark(function _callee() {
        var _ref2,
          _ref2$exposedMethods,
          exposedMethods,
          messenger,
          _args = arguments;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _ref2 = _args.length > 0 && _args[0] !== undefined ? _args[0] : {}, _ref2$exposedMethods = _ref2.exposedMethods, exposedMethods = _ref2$exposedMethods === void 0 ? {} : _ref2$exposedMethods;
              messenger = new _ContentScriptMessenger.default({
                localWindow: this.localWindow
              });
              _context.next = 4;
              return (0, _postMe.ChildHandshake)(messenger, exposedMethods);
            case 4:
              this.connection = _context.sent;
              this.localHandle = this.connection.localHandle();
              this.remoteHandle = this.connection.remoteHandle();
            case 7:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }));
      function init() {
        return _init.apply(this, arguments);
      }
      return init;
    }()
  }]);
  return LauncherBridge;
}(_bridgeInterfaces.Bridge);

/***/ }),
/* 38 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var _typeof = (__webpack_require__(6)["default"]);
var assertThisInitialized = __webpack_require__(39);
function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return assertThisInitialized(self);
}
module.exports = _possibleConstructorReturn, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 39 */
/***/ ((module) => {

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
module.exports = _assertThisInitialized, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 40 */
/***/ ((module) => {

function _getPrototypeOf(o) {
  module.exports = _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  }, module.exports.__esModule = true, module.exports["default"] = module.exports;
  return _getPrototypeOf(o);
}
module.exports = _getPrototypeOf, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 41 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var setPrototypeOf = __webpack_require__(42);
function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  Object.defineProperty(subClass, "prototype", {
    writable: false
  });
  if (superClass) setPrototypeOf(subClass, superClass);
}
module.exports = _inherits, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 42 */
/***/ ((module) => {

function _setPrototypeOf(o, p) {
  module.exports = _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports;
  return _setPrototypeOf(o, p);
}
module.exports = _setPrototypeOf, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 43 */
/***/ (function(module, exports) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else { var mod; }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.ChildHandshake = ChildHandshake;
  _exports.DebugMessenger = DebugMessenger;
  _exports.ParentHandshake = ParentHandshake;
  _exports.debug = debug;
  _exports.WorkerMessenger = _exports.WindowMessenger = _exports.PortMessenger = _exports.ConcreteEmitter = _exports.BareMessenger = void 0;

  function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

  function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

  function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var MARKER = '@post-me';

  function createUniqueIdFn() {
    var __id = 0;
    return function () {
      var id = __id;
      __id += 1;
      return id;
    };
  }
  /**
   * A concrete implementation of the {@link Emitter} interface
   *
   * @public
   */


  var ConcreteEmitter = /*#__PURE__*/function () {
    function ConcreteEmitter() {
      _classCallCheck(this, ConcreteEmitter);

      this._listeners = {};
    }
    /** {@inheritDoc Emitter.addEventListener} */


    _createClass(ConcreteEmitter, [{
      key: "addEventListener",
      value: function addEventListener(eventName, listener) {
        var listeners = this._listeners[eventName];

        if (!listeners) {
          listeners = new Set();
          this._listeners[eventName] = listeners;
        }

        listeners.add(listener);
      }
      /** {@inheritDoc Emitter.removeEventListener} */

    }, {
      key: "removeEventListener",
      value: function removeEventListener(eventName, listener) {
        var listeners = this._listeners[eventName];

        if (!listeners) {
          return;
        }

        listeners["delete"](listener);
      }
      /** {@inheritDoc Emitter.once} */

    }, {
      key: "once",
      value: function once(eventName) {
        var _this = this;

        return new Promise(function (resolve) {
          var listener = function listener(data) {
            _this.removeEventListener(eventName, listener);

            resolve(data);
          };

          _this.addEventListener(eventName, listener);
        });
      }
      /** @internal */

    }, {
      key: "emit",
      value: function emit(eventName, data) {
        var listeners = this._listeners[eventName];

        if (!listeners) {
          return;
        }

        listeners.forEach(function (listener) {
          listener(data);
        });
      }
      /** @internal */

    }, {
      key: "removeAllListeners",
      value: function removeAllListeners() {
        Object.values(this._listeners).forEach(function (listeners) {
          if (listeners) {
            listeners.clear();
          }
        });
      }
    }]);

    return ConcreteEmitter;
  }();

  _exports.ConcreteEmitter = ConcreteEmitter;
  var MessageType;

  (function (MessageType) {
    MessageType["HandshakeRequest"] = "handshake-request";
    MessageType["HandshakeResponse"] = "handshake-response";
    MessageType["Call"] = "call";
    MessageType["Response"] = "response";
    MessageType["Error"] = "error";
    MessageType["Event"] = "event";
    MessageType["Callback"] = "callback";
  })(MessageType || (MessageType = {})); // Message Creators


  function createHandshakeRequestMessage(sessionId) {
    return {
      type: MARKER,
      action: MessageType.HandshakeRequest,
      sessionId: sessionId
    };
  }

  function createHandshakeResponseMessage(sessionId) {
    return {
      type: MARKER,
      action: MessageType.HandshakeResponse,
      sessionId: sessionId
    };
  }

  function createCallMessage(sessionId, requestId, methodName, args) {
    return {
      type: MARKER,
      action: MessageType.Call,
      sessionId: sessionId,
      requestId: requestId,
      methodName: methodName,
      args: args
    };
  }

  function createResponsMessage(sessionId, requestId, result, error) {
    var message = {
      type: MARKER,
      action: MessageType.Response,
      sessionId: sessionId,
      requestId: requestId
    };

    if (result !== undefined) {
      message.result = result;
    }

    if (error !== undefined) {
      message.error = error;
    }

    return message;
  }

  function createCallbackMessage(sessionId, requestId, callbackId, args) {
    return {
      type: MARKER,
      action: MessageType.Callback,
      sessionId: sessionId,
      requestId: requestId,
      callbackId: callbackId,
      args: args
    };
  }

  function createEventMessage(sessionId, eventName, payload) {
    return {
      type: MARKER,
      action: MessageType.Event,
      sessionId: sessionId,
      eventName: eventName,
      payload: payload
    };
  } // Type Guards


  function isMessage(m) {
    return m && m.type === MARKER;
  }

  function isHandshakeRequestMessage(m) {
    return isMessage(m) && m.action === MessageType.HandshakeRequest;
  }

  function isHandshakeResponseMessage(m) {
    return isMessage(m) && m.action === MessageType.HandshakeResponse;
  }

  function isCallMessage(m) {
    return isMessage(m) && m.action === MessageType.Call;
  }

  function isResponseMessage(m) {
    return isMessage(m) && m.action === MessageType.Response;
  }

  function isCallbackMessage(m) {
    return isMessage(m) && m.action === MessageType.Callback;
  }

  function isEventMessage(m) {
    return isMessage(m) && m.action === MessageType.Event;
  }

  function makeCallbackEvent(requestId) {
    return "callback_".concat(requestId);
  }

  function makeResponseEvent(requestId) {
    return "response_".concat(requestId);
  }

  var Dispatcher = /*#__PURE__*/function (_ConcreteEmitter) {
    _inherits(Dispatcher, _ConcreteEmitter);

    var _super = _createSuper(Dispatcher);

    function Dispatcher(messenger, sessionId) {
      var _this2;

      _classCallCheck(this, Dispatcher);

      _this2 = _super.call(this);
      _this2.uniqueId = createUniqueIdFn();
      _this2.messenger = messenger;
      _this2.sessionId = sessionId;
      _this2.removeMessengerListener = _this2.messenger.addMessageListener(_this2.messengerListener.bind(_assertThisInitialized(_this2)));
      return _this2;
    }

    _createClass(Dispatcher, [{
      key: "messengerListener",
      value: function messengerListener(event) {
        var data = event.data;

        if (!isMessage(data)) {
          return;
        }

        if (this.sessionId !== data.sessionId) {
          return;
        }

        if (isCallMessage(data)) {
          this.emit(MessageType.Call, data);
        } else if (isResponseMessage(data)) {
          this.emit(makeResponseEvent(data.requestId), data);
        } else if (isEventMessage(data)) {
          this.emit(MessageType.Event, data);
        } else if (isCallbackMessage(data)) {
          this.emit(makeCallbackEvent(data.requestId), data);
        }
      }
    }, {
      key: "callOnRemote",
      value: function callOnRemote(methodName, args, transfer) {
        var requestId = this.uniqueId();
        var callbackEvent = makeCallbackEvent(requestId);
        var responseEvent = makeResponseEvent(requestId);
        var message = createCallMessage(this.sessionId, requestId, methodName, args);
        this.messenger.postMessage(message, transfer);
        return {
          callbackEvent: callbackEvent,
          responseEvent: responseEvent
        };
      }
    }, {
      key: "respondToRemote",
      value: function respondToRemote(requestId, value, error, transfer) {
        if (error instanceof Error) {
          error = {
            name: error.name,
            message: error.message
          };
        }

        var message = createResponsMessage(this.sessionId, requestId, value, error);
        this.messenger.postMessage(message, transfer);
      }
    }, {
      key: "callbackToRemote",
      value: function callbackToRemote(requestId, callbackId, args) {
        var message = createCallbackMessage(this.sessionId, requestId, callbackId, args);
        this.messenger.postMessage(message);
      }
    }, {
      key: "emitToRemote",
      value: function emitToRemote(eventName, payload, transfer) {
        var message = createEventMessage(this.sessionId, eventName, payload);
        this.messenger.postMessage(message, transfer);
      }
    }, {
      key: "close",
      value: function close() {
        this.removeMessengerListener();
        this.removeAllListeners();
      }
    }]);

    return Dispatcher;
  }(ConcreteEmitter);

  var ParentHandshakeDispatcher = /*#__PURE__*/function (_ConcreteEmitter2) {
    _inherits(ParentHandshakeDispatcher, _ConcreteEmitter2);

    var _super2 = _createSuper(ParentHandshakeDispatcher);

    function ParentHandshakeDispatcher(messenger, sessionId) {
      var _this3;

      _classCallCheck(this, ParentHandshakeDispatcher);

      _this3 = _super2.call(this);
      _this3.messenger = messenger;
      _this3.sessionId = sessionId;
      _this3.removeMessengerListener = _this3.messenger.addMessageListener(_this3.messengerListener.bind(_assertThisInitialized(_this3)));
      return _this3;
    }

    _createClass(ParentHandshakeDispatcher, [{
      key: "messengerListener",
      value: function messengerListener(event) {
        var data = event.data;

        if (!isMessage(data)) {
          return;
        }

        if (this.sessionId !== data.sessionId) {
          return;
        }

        if (isHandshakeResponseMessage(data)) {
          this.emit(data.sessionId, data);
        }
      }
    }, {
      key: "initiateHandshake",
      value: function initiateHandshake() {
        var message = createHandshakeRequestMessage(this.sessionId);
        this.messenger.postMessage(message);
        return this.sessionId;
      }
    }, {
      key: "close",
      value: function close() {
        this.removeMessengerListener();
        this.removeAllListeners();
      }
    }]);

    return ParentHandshakeDispatcher;
  }(ConcreteEmitter);

  var ChildHandshakeDispatcher = /*#__PURE__*/function (_ConcreteEmitter3) {
    _inherits(ChildHandshakeDispatcher, _ConcreteEmitter3);

    var _super3 = _createSuper(ChildHandshakeDispatcher);

    function ChildHandshakeDispatcher(messenger) {
      var _this4;

      _classCallCheck(this, ChildHandshakeDispatcher);

      _this4 = _super3.call(this);
      _this4.messenger = messenger;
      _this4.removeMessengerListener = _this4.messenger.addMessageListener(_this4.messengerListener.bind(_assertThisInitialized(_this4)));
      return _this4;
    }

    _createClass(ChildHandshakeDispatcher, [{
      key: "messengerListener",
      value: function messengerListener(event) {
        var data = event.data;

        if (isHandshakeRequestMessage(data)) {
          this.emit(MessageType.HandshakeRequest, data);
        }
      }
    }, {
      key: "acceptHandshake",
      value: function acceptHandshake(sessionId) {
        var message = createHandshakeResponseMessage(sessionId);
        this.messenger.postMessage(message);
      }
    }, {
      key: "close",
      value: function close() {
        this.removeMessengerListener();
        this.removeAllListeners();
      }
    }]);

    return ChildHandshakeDispatcher;
  }(ConcreteEmitter);

  var ProxyType;

  (function (ProxyType) {
    ProxyType["Callback"] = "callback";
  })(ProxyType || (ProxyType = {}));

  function createCallbackProxy(callbackId) {
    return {
      type: MARKER,
      proxy: ProxyType.Callback,
      callbackId: callbackId
    };
  }

  function isCallbackProxy(p) {
    return p && p.type === MARKER && p.proxy === ProxyType.Callback;
  }

  var ConcreteRemoteHandle = /*#__PURE__*/function (_ConcreteEmitter4) {
    _inherits(ConcreteRemoteHandle, _ConcreteEmitter4);

    var _super4 = _createSuper(ConcreteRemoteHandle);

    function ConcreteRemoteHandle(dispatcher) {
      var _this5;

      _classCallCheck(this, ConcreteRemoteHandle);

      _this5 = _super4.call(this);
      _this5._dispatcher = dispatcher;
      _this5._callTransfer = {};

      _this5._dispatcher.addEventListener(MessageType.Event, _this5._handleEvent.bind(_assertThisInitialized(_this5)));

      return _this5;
    }

    _createClass(ConcreteRemoteHandle, [{
      key: "close",
      value: function close() {
        this.removeAllListeners();
      }
    }, {
      key: "setCallTransfer",
      value: function setCallTransfer(methodName, transfer) {
        this._callTransfer[methodName] = transfer;
      }
    }, {
      key: "call",
      value: function call(methodName) {
        for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        return this.customCall(methodName, args);
      }
    }, {
      key: "customCall",
      value: function customCall(methodName, args) {
        var _this6 = this;

        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        return new Promise(function (resolve, reject) {
          var sanitizedArgs = [];
          var callbacks = [];
          var callbackId = 0;
          args.forEach(function (arg) {
            if (typeof arg === 'function') {
              callbacks.push(arg);
              sanitizedArgs.push(createCallbackProxy(callbackId));
              callbackId += 1;
            } else {
              sanitizedArgs.push(arg);
            }
          });
          var hasCallbacks = callbacks.length > 0;
          var callbackListener = undefined;

          if (hasCallbacks) {
            callbackListener = function callbackListener(data) {
              var callbackId = data.callbackId,
                  args = data.args;
              callbacks[callbackId].apply(callbacks, _toConsumableArray(args));
            };
          }

          var transfer = options.transfer;

          if (transfer === undefined && _this6._callTransfer[methodName]) {
            var _this6$_callTransfer;

            transfer = (_this6$_callTransfer = _this6._callTransfer)[methodName].apply(_this6$_callTransfer, sanitizedArgs);
          }

          var _this6$_dispatcher$ca = _this6._dispatcher.callOnRemote(methodName, sanitizedArgs, transfer),
              callbackEvent = _this6$_dispatcher$ca.callbackEvent,
              responseEvent = _this6$_dispatcher$ca.responseEvent;

          if (hasCallbacks) {
            _this6._dispatcher.addEventListener(callbackEvent, callbackListener);
          }

          _this6._dispatcher.once(responseEvent).then(function (response) {
            if (callbackListener) {
              _this6._dispatcher.removeEventListener(callbackEvent, callbackListener);
            }

            var result = response.result,
                error = response.error;

            if (error !== undefined) {
              reject(error);
            } else {
              resolve(result);
            }
          });
        });
      }
    }, {
      key: "_handleEvent",
      value: function _handleEvent(data) {
        var eventName = data.eventName,
            payload = data.payload;
        this.emit(eventName, payload);
      }
    }]);

    return ConcreteRemoteHandle;
  }(ConcreteEmitter);

  var ConcreteLocalHandle = /*#__PURE__*/function () {
    function ConcreteLocalHandle(dispatcher, localMethods) {
      _classCallCheck(this, ConcreteLocalHandle);

      this._dispatcher = dispatcher;
      this._methods = localMethods;
      this._returnTransfer = {};
      this._emitTransfer = {};

      this._dispatcher.addEventListener(MessageType.Call, this._handleCall.bind(this));
    }

    _createClass(ConcreteLocalHandle, [{
      key: "emit",
      value: function emit(eventName, payload) {
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        var transfer = options.transfer;

        if (transfer === undefined && this._emitTransfer[eventName]) {
          transfer = this._emitTransfer[eventName](payload);
        }

        this._dispatcher.emitToRemote(eventName, payload, transfer);
      }
    }, {
      key: "setMethods",
      value: function setMethods(methods) {
        this._methods = methods;
      }
    }, {
      key: "setMethod",
      value: function setMethod(methodName, method) {
        this._methods[methodName] = method;
      }
    }, {
      key: "setReturnTransfer",
      value: function setReturnTransfer(methodName, transfer) {
        this._returnTransfer[methodName] = transfer;
      }
    }, {
      key: "setEmitTransfer",
      value: function setEmitTransfer(eventName, transfer) {
        this._emitTransfer[eventName] = transfer;
      }
    }, {
      key: "_handleCall",
      value: function _handleCall(data) {
        var _this7 = this;

        var requestId = data.requestId,
            methodName = data.methodName,
            args = data.args;
        var callMethod = new Promise(function (resolve, reject) {
          var _this7$_methods;

          var method = _this7._methods[methodName];

          if (typeof method !== 'function') {
            reject(new Error("The method \"".concat(methodName, "\" has not been implemented.")));
            return;
          }

          var desanitizedArgs = args.map(function (arg) {
            if (isCallbackProxy(arg)) {
              var callbackId = arg.callbackId;
              return function () {
                for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                  args[_key2] = arguments[_key2];
                }

                _this7._dispatcher.callbackToRemote(requestId, callbackId, args);
              };
            } else {
              return arg;
            }
          });
          Promise.resolve((_this7$_methods = _this7._methods)[methodName].apply(_this7$_methods, _toConsumableArray(desanitizedArgs))).then(resolve)["catch"](reject);
        });
        callMethod.then(function (result) {
          var transfer;

          if (_this7._returnTransfer[methodName]) {
            transfer = _this7._returnTransfer[methodName](result);
          }

          _this7._dispatcher.respondToRemote(requestId, result, undefined, transfer);
        })["catch"](function (error) {
          _this7._dispatcher.respondToRemote(requestId, undefined, error);
        });
      }
    }]);

    return ConcreteLocalHandle;
  }();

  var ConcreteConnection = /*#__PURE__*/function () {
    function ConcreteConnection(dispatcher, localMethods) {
      _classCallCheck(this, ConcreteConnection);

      this._dispatcher = dispatcher;
      this._localHandle = new ConcreteLocalHandle(dispatcher, localMethods);
      this._remoteHandle = new ConcreteRemoteHandle(dispatcher);
    }

    _createClass(ConcreteConnection, [{
      key: "close",
      value: function close() {
        this._dispatcher.close();

        this.remoteHandle().close();
      }
    }, {
      key: "localHandle",
      value: function localHandle() {
        return this._localHandle;
      }
    }, {
      key: "remoteHandle",
      value: function remoteHandle() {
        return this._remoteHandle;
      }
    }]);

    return ConcreteConnection;
  }();

  var uniqueSessionId = createUniqueIdFn();

  var runUntil = function runUntil(worker, condition, unfulfilled, maxAttempts, attemptInterval) {
    var attempt = 0;

    var fn = function fn() {
      if (!condition() && (attempt < maxAttempts || maxAttempts < 1)) {
        worker();
        attempt += 1;
        setTimeout(fn, attemptInterval);
      } else if (!condition() && attempt >= maxAttempts && maxAttempts >= 1) {
        unfulfilled();
      }
    };

    fn();
  };
  /**
   * Initiate the handshake from the Parent side
   *
   * @param messenger - The Messenger used to send and receive messages from the other end
   * @param localMethods - The methods that will be exposed to the other end
   * @param maxAttempts - The maximum number of handshake attempts
   * @param attemptsInterval - The interval between handshake attempts
   * @returns A Promise to an active {@link Connection} to the other end
   *
   * @public
   */


  function ParentHandshake(messenger) {
    var localMethods = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var maxAttempts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 5;
    var attemptsInterval = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 100;
    var thisSessionId = uniqueSessionId();
    var connected = false;
    return new Promise(function (resolve, reject) {
      var handshakeDispatcher = new ParentHandshakeDispatcher(messenger, thisSessionId);
      handshakeDispatcher.once(thisSessionId).then(function (response) {
        connected = true;
        handshakeDispatcher.close();
        var sessionId = response.sessionId;
        var dispatcher = new Dispatcher(messenger, sessionId);
        var connection = new ConcreteConnection(dispatcher, localMethods);
        resolve(connection);
      });
      runUntil(function () {
        return handshakeDispatcher.initiateHandshake();
      }, function () {
        return connected;
      }, function () {
        return reject(new Error("Handshake failed, reached maximum number of attempts"));
      }, maxAttempts, attemptsInterval);
    });
  }
  /**
   * Initiate the handshake from the Child side
   *
   * @param messenger - The Messenger used to send and receive messages from the other end
   * @param localMethods - The methods that will be exposed to the other end
   * @returns A Promise to an active {@link Connection} to the other end
   *
   * @public
   */


  function ChildHandshake(messenger) {
    var localMethods = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return new Promise(function (resolve, reject) {
      var handshakeDispatcher = new ChildHandshakeDispatcher(messenger);
      handshakeDispatcher.once(MessageType.HandshakeRequest).then(function (response) {
        var sessionId = response.sessionId;
        handshakeDispatcher.acceptHandshake(sessionId);
        handshakeDispatcher.close();
        var dispatcher = new Dispatcher(messenger, sessionId);
        var connection = new ConcreteConnection(dispatcher, localMethods);
        resolve(connection);
      });
    });
  }

  var acceptableMessageEvent = function acceptableMessageEvent(event, remoteWindow, acceptedOrigin) {
    var source = event.source,
        origin = event.origin;

    if (source !== remoteWindow) {
      return false;
    }

    if (origin !== acceptedOrigin && acceptedOrigin !== '*') {
      return false;
    }

    return true;
  };
  /**
   * A concrete implementation of {@link Messenger} used to communicate with another Window.
   *
   * @public
   *
   */


  var WindowMessenger = function WindowMessenger(_ref) {
    var localWindow = _ref.localWindow,
        remoteWindow = _ref.remoteWindow,
        remoteOrigin = _ref.remoteOrigin;

    _classCallCheck(this, WindowMessenger);

    localWindow = localWindow || window;

    this.postMessage = function (message, transfer) {
      remoteWindow.postMessage(message, remoteOrigin, transfer);
    };

    this.addMessageListener = function (listener) {
      var outerListener = function outerListener(event) {
        if (acceptableMessageEvent(event, remoteWindow, remoteOrigin)) {
          listener(event);
        }
      };

      localWindow.addEventListener('message', outerListener);

      var removeListener = function removeListener() {
        localWindow.removeEventListener('message', outerListener);
      };

      return removeListener;
    };
  };
  /** @public */


  _exports.WindowMessenger = WindowMessenger;

  var BareMessenger = function BareMessenger(postable) {
    _classCallCheck(this, BareMessenger);

    this.postMessage = function (message) {
      var transfer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      postable.postMessage(message, transfer);
    };

    this.addMessageListener = function (listener) {
      var outerListener = function outerListener(event) {
        listener(event);
      };

      postable.addEventListener('message', outerListener);

      var removeListener = function removeListener() {
        postable.removeEventListener('message', outerListener);
      };

      return removeListener;
    };
  };
  /**
   * A concrete implementation of {@link Messenger} used to communicate with a Worker.
   *
   * Takes a {@link Postable} representing the `Worker` (when calling from
   * the parent context) or the `self` `DedicatedWorkerGlobalScope` object
   * (when calling from the child context).
   *
   * @public
   *
   */


  _exports.BareMessenger = BareMessenger;

  var WorkerMessenger = /*#__PURE__*/function (_BareMessenger) {
    _inherits(WorkerMessenger, _BareMessenger);

    var _super5 = _createSuper(WorkerMessenger);

    function WorkerMessenger(_ref2) {
      var worker = _ref2.worker;

      _classCallCheck(this, WorkerMessenger);

      return _super5.call(this, worker);
    }

    return WorkerMessenger;
  }(BareMessenger);
  /**
   * A concrete implementation of {@link Messenger} used to communicate with a MessagePort.
   *
   * @public
   *
   */


  _exports.WorkerMessenger = WorkerMessenger;

  var PortMessenger = /*#__PURE__*/function (_BareMessenger2) {
    _inherits(PortMessenger, _BareMessenger2);

    var _super6 = _createSuper(PortMessenger);

    function PortMessenger(_ref3) {
      var port = _ref3.port;

      _classCallCheck(this, PortMessenger);

      port.start();
      return _super6.call(this, port);
    }

    return PortMessenger;
  }(BareMessenger);
  /**
   * Create a logger function with a specific namespace
   *
   * @param namespace - The namespace will be prepended to all the arguments passed to the logger function
   * @param log - The underlying logger (`console.log` by default)
   *
   * @public
   *
   */


  _exports.PortMessenger = PortMessenger;

  function debug(namespace, log) {
    log = log || console.debug || console.log || function () {};

    return function () {
      for (var _len3 = arguments.length, data = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        data[_key3] = arguments[_key3];
      }

      log.apply(void 0, [namespace].concat(data));
    };
  }
  /**
   * Decorate a {@link Messenger} so that it will log any message exchanged
   * @param messenger - The Messenger that will be decorated
   * @param log - The logger function that will receive each message
   * @returns A decorated Messenger
   *
   * @public
   *
   */


  function DebugMessenger(messenger, log) {
    log = log || debug('post-me');

    var debugListener = function debugListener(event) {
      var data = event.data;
      log('⬅️ received message', data);
    };

    messenger.addMessageListener(debugListener);
    return {
      postMessage: function postMessage(message, transfer) {
        log('➡️ sending message', message);
        messenger.postMessage(message, transfer);
      },
      addMessageListener: function addMessageListener(listener) {
        return messenger.addMessageListener(listener);
      }
    };
  }
});


/***/ }),
/* 44 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(2);
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _classCallCheck2 = _interopRequireDefault(__webpack_require__(17));
var _createClass2 = _interopRequireDefault(__webpack_require__(18));
var _possibleConstructorReturn2 = _interopRequireDefault(__webpack_require__(38));
var _getPrototypeOf2 = _interopRequireDefault(__webpack_require__(40));
var _inherits2 = _interopRequireDefault(__webpack_require__(41));
var _bridgeInterfaces = __webpack_require__(45);
function _callSuper(t, o, e) { return o = (0, _getPrototypeOf2.default)(o), (0, _possibleConstructorReturn2.default)(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], (0, _getPrototypeOf2.default)(t).constructor) : o.apply(t, e)); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); } // @ts-check
/**
 * post-me messenger implementation for a content script implanted in a react native webview
 */
var ReactNativeWebviewMessenger = exports["default"] = /*#__PURE__*/function (_MessengerInterface) {
  (0, _inherits2.default)(ReactNativeWebviewMessenger, _MessengerInterface);
  /**
   * Init the window which will be used to post messages and listen to messages
   *
   * @param  {object} options             : options object
   * @param  {object} options.localWindow : The window object
   */
  function ReactNativeWebviewMessenger(_ref) {
    var _this;
    var localWindow = _ref.localWindow;
    (0, _classCallCheck2.default)(this, ReactNativeWebviewMessenger);
    _this = _callSuper(this, ReactNativeWebviewMessenger);
    _this.localWindow = localWindow;
    return _this;
  }
  (0, _createClass2.default)(ReactNativeWebviewMessenger, [{
    key: "postMessage",
    value: function postMessage(message) {
      this.localWindow.ReactNativeWebView.postMessage(JSON.stringify(message));
    }
  }, {
    key: "addMessageListener",
    value: function addMessageListener(listener) {
      var _this2 = this;
      var outerListener = function outerListener(event) {
        listener(event);
      };
      this.localWindow.addEventListener('message', outerListener);
      var removeMessageListener = function removeMessageListener() {
        _this2.localWindow.removeEventListener('message', outerListener);
      };
      return removeMessageListener;
    }
  }]);
  return ReactNativeWebviewMessenger;
}(_bridgeInterfaces.MessengerInterface);

/***/ }),
/* 45 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(2);
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.MessengerInterface = exports.Bridge = void 0;
var _regenerator = _interopRequireDefault(__webpack_require__(4));
var _asyncToGenerator2 = _interopRequireDefault(__webpack_require__(16));
var _classCallCheck2 = _interopRequireDefault(__webpack_require__(17));
var _createClass2 = _interopRequireDefault(__webpack_require__(18));
/* eslint-disable no-unused-vars */
/**
 * @typedef PostMeConnection
 * @property {Function} localHandle  : get handle to the local end of the connection
 * @property {Function} remoteHandle : get handle to the remote end of the connection
 * @property {Function} close        : stop listening to incoming message from the other side
 */
/**
 * All bridges are supposed to implement this interface
 */
var Bridge = exports.Bridge = /*#__PURE__*/function () {
  function Bridge() {
    (0, _classCallCheck2.default)(this, Bridge);
  }
  (0, _createClass2.default)(Bridge, [{
    key: "init",
    value: (
    /**
     * Initialize the communication between the parent and the child via post-me protocol
     * https://github.com/alesgenova/post-me
     *
     * @param  {object} options                             : Options object
     * @param  {object} options.root                        : The object which will contain the exposed method names
     * @param  {Array.<string>} options.exposedMethodNames  : The list of method names of the root object, which will be exposed via the post-me interface to the content script
     * @param  {Array.<string>} options.listenedEventsNames : The list of method names of the root object, which will be call on given event name via the post-me interface to the content script
     * @param  {object} options.webViewRef                  : Reference to the webview obect containing the content script
     * @returns {Promise.<PostMeConnection>} : the resulting post-me connection
     */
    function () {
      var _init = (0, _asyncToGenerator2.default)(/*#__PURE__*/_regenerator.default.mark(function _callee(options) {
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }));
      function init(_x) {
        return _init.apply(this, arguments);
      }
      return init;
    }()
    /**
     * Shortcut to remoteHandle.call method
     *
     * @param  {string} method : The remote method name
     * @param  {Array} args    : Any number of parameters which will be given to the remote method.
     * It is also possible to pass callback functions (which must support serialization). post-me
     * will wait the the remote method end before resolving the promise
     * @returns {Promise.<any>} remote method return value
     */
    )
  }, {
    key: "call",
    value: (function () {
      var _call = (0, _asyncToGenerator2.default)(/*#__PURE__*/_regenerator.default.mark(function _callee2(method) {
        var _this$remoteHandle;
        var _len,
          args,
          _key,
          _args2 = arguments;
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              for (_len = _args2.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                args[_key - 1] = _args2[_key];
              }
              return _context2.abrupt("return", (_this$remoteHandle = this.remoteHandle).call.apply(_this$remoteHandle, [method].concat(args)));
            case 2:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this);
      }));
      function call(_x2) {
        return _call.apply(this, arguments);
      }
      return call;
    }()
    /**
     * Shortcut to localHandle.emit method. Will emit an event which could be listened by the remote
     * object
     *
     * @param  {string} eventName : Name of the event
     * @param  {Array} args       : Any number of parameters.
     */
    )
  }, {
    key: "emit",
    value: function emit(eventName) {
      var _this$localHandle;
      for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }
      (_this$localHandle = this.localHandle).emit.apply(_this$localHandle, [eventName].concat(args));
    }

    /**
     * Shortcut to remoteHandle.addEventListener method. Will listen to the given event on the remote
     * object and call the listener function
     *
     * @param  {string} remoteEventName : Name of the remove event
     * @param  {Function} listener      : Listener function
     */
  }, {
    key: "addEventListener",
    value: function addEventListener(remoteEventName, listener) {
      this.remoteHandle.addEventListener(remoteEventName, listener);
    }

    /**
     * Shortcut to remoteHandle.removeEventListener method. Will stop listening to the given event
     * on the remote object.
     *
     * @param  {string} remoteEventName : Name of the remote event
     * @param  {Function} listener      : Previously defined listener function
     */
  }, {
    key: "removeEventListener",
    value: function removeEventListener(remoteEventName, listener) {
      this.remoteHandle.removeEventListener(remoteEventName, listener);
    }
  }]);
  return Bridge;
}();
/**
 * All messengers are supposed to implement this interface
 *
 * @interface
 */
var MessengerInterface = exports.MessengerInterface = /*#__PURE__*/function () {
  function MessengerInterface() {
    (0, _classCallCheck2.default)(this, MessengerInterface);
  }
  (0, _createClass2.default)(MessengerInterface, [{
    key: "postMessage",
    value:
    /**
     * Send a message to the other context
     *
     * @param {string} message : The payload of the message
     */
    function postMessage(message) {}

    /**
     * Add a listener to messages received by the other context
     *
     * @param {Function} listener : A listener that will receive the MessageEvent
     * @returns {Function} A function that can be invoked to remove the listener
     */
  }, {
    key: "addMessageListener",
    value: function addMessageListener(listener) {}
  }]);
  return MessengerInterface;
}();

/***/ }),
/* 46 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(2);
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.dataUriToArrayBuffer = exports.calculateFileKey = void 0;
var _slicedToArray2 = _interopRequireDefault(__webpack_require__(47));
/**
 * @typedef ArrayBufferWithContentType
 * @property {string} contentType - dataUri included content type
 * @property {ArrayBuffer} arrayBuffer - resulting decoded data
 */

/**
 * Converts a data URI string to an Array Buffer with its content Type
 *
 * @param {string} dataURI - data URI string containing content type and base64 encoded data
 * @returns {ArrayBufferWithContentType} : array buffer with content type
 */
var dataUriToArrayBuffer = exports.dataUriToArrayBuffer = function dataUriToArrayBuffer(dataURI) {
  var parsed = dataURI.match(/^data:(.*);base64,(.*)$/);
  if (parsed === null) {
    throw new Error('dataUriToArrayBuffer: dataURI is malformed. Should be in the form data:...;base64,...');
  }
  var _parsed$slice = parsed.slice(1),
    _parsed$slice2 = (0, _slicedToArray2.default)(_parsed$slice, 2),
    contentType = _parsed$slice2[0],
    base64String = _parsed$slice2[1];
  var byteString = __webpack_require__.g.atob(base64String);
  var arrayBuffer = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(arrayBuffer);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return {
    contentType: contentType,
    arrayBuffer: arrayBuffer
  };
};

/**
 * Calculate the file key from an entry given to saveFiles
 *
 * @param {import('../launcher/saveFiles').saveFilesEntry} entry - a savefiles entry
 * @param {Array<string>} fileIdAttributes - list of entry attributes which will be used to identify the entry in a unique way
 * @returns {string} - The resulting file key
 */
var calculateFileKey = exports.calculateFileKey = function calculateFileKey(entry, fileIdAttributes) {
  return fileIdAttributes.sort().map(function (key) {
    return entry === null || entry === void 0 ? void 0 : entry[key];
  }).join('####');
};

/***/ }),
/* 47 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var arrayWithHoles = __webpack_require__(48);
var iterableToArrayLimit = __webpack_require__(49);
var unsupportedIterableToArray = __webpack_require__(14);
var nonIterableRest = __webpack_require__(50);
function _slicedToArray(arr, i) {
  return arrayWithHoles(arr) || iterableToArrayLimit(arr, i) || unsupportedIterableToArray(arr, i) || nonIterableRest();
}
module.exports = _slicedToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 48 */
/***/ ((module) => {

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}
module.exports = _arrayWithHoles, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 49 */
/***/ ((module) => {

function _iterableToArrayLimit(arr, i) {
  var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"];
  if (null != _i) {
    var _s,
      _e,
      _x,
      _r,
      _arr = [],
      _n = !0,
      _d = !1;
    try {
      if (_x = (_i = _i.call(arr)).next, 0 === i) {
        if (Object(_i) !== _i) return;
        _n = !1;
      } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0);
    } catch (err) {
      _d = !0, _e = err;
    } finally {
      try {
        if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return;
      } finally {
        if (_d) throw _e;
      }
    }
    return _arr;
  }
}
module.exports = _iterableToArrayLimit, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 50 */
/***/ ((module) => {

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
module.exports = _nonIterableRest, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 51 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(2);
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.wrapTimerFactory = exports.wrapTimer = void 0;
var _regenerator = _interopRequireDefault(__webpack_require__(4));
var _asyncToGenerator2 = _interopRequireDefault(__webpack_require__(16));
var _defineProperty2 = _interopRequireDefault(__webpack_require__(7));
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2.default)(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
/**
 * Create a wrapTimer function with given defaults as options
 *
 * @param {WrapTimerOptions} defaults
 * @returns {Function} - wrapTimer function
 */
var wrapTimerFactory = exports.wrapTimerFactory = function wrapTimerFactory(defaults) {
  return function (obj, name) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    return wrapTimer(obj, name, _objectSpread(_objectSpread({}, defaults), options));
  };
};

/**
 * Wrap any async method of an object to display it's time of execution
 *
 * @param {object} obj - The object which will be considered as `this`
 * @param {string} name - The name of the method to wrap
 * @param {WrapTimerOptions} [options] - Options object
 * @returns {Function} - Wrapped async function
 */
var wrapTimer = exports.wrapTimer = function wrapTimer(obj, name) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var _options$displayName = options.displayName,
    displayName = _options$displayName === void 0 ? name : _options$displayName,
    _options$logFn = options.logFn,
    logFn = _options$logFn === void 0 ? console.log.bind(console) : _options$logFn,
    _options$suffixFn = options.suffixFn,
    suffixFn = _options$suffixFn === void 0 ? null : _options$suffixFn;
  var fn = obj[name];
  if (!fn) {
    throw new Error("".concat(name, " cannot be found on ").concat(obj.name || obj.constructor.name));
  }
  return /*#__PURE__*/(0, _asyncToGenerator2.default)(/*#__PURE__*/_regenerator.default.mark(function _callee() {
    var start,
      res,
      end,
      suffix,
      _args = arguments;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          start = Date.now();
          _context.next = 3;
          return fn.apply(this, _args);
        case 3:
          res = _context.sent;
          end = Date.now();
          suffix = suffixFn ? ' ' + suffixFn(_args) : '';
          logFn("\u231B ".concat(displayName).concat(suffix, " took ").concat(Math.round((end - start) / 10) / 100, "s"));
          return _context.abrupt("return", res);
        case 8:
        case "end":
          return _context.stop();
      }
    }, _callee, this);
  }));
};

/**
 * @typedef WrapTimerOptions
 * @property {string} [options.displayName] - Name which will be displayed in the final log
 * @property {Function} [options.logFn] - logging function. Defaults to console.log
 * @property {Function} [options.suffixFn] - function which will be called with method arguments which return a suffix to the name of the method
 */

/***/ }),
/* 52 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(2);
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(__webpack_require__(4));
var _asyncToGenerator2 = _interopRequireDefault(__webpack_require__(16));
var _slicedToArray2 = _interopRequireDefault(__webpack_require__(47));
var _classCallCheck2 = _interopRequireDefault(__webpack_require__(17));
var _createClass2 = _interopRequireDefault(__webpack_require__(18));
var _microee = _interopRequireDefault(__webpack_require__(22));
var _utils = __webpack_require__(35);
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; } /* eslint no-console: off */
/**
 * Intercept any xhr or fetch request corresponding to the given interception list
 */
var RequestInterceptor = /*#__PURE__*/function () {
  /**
   * @function Object() { [native code] }
   * @param {Array<InterceptionDocument>} interceptions - the list of url to intercept
   */
  function RequestInterceptor(interceptions) {
    (0, _classCallCheck2.default)(this, RequestInterceptor);
    this.interceptions = interceptions;
    this.savedSetRequestHeader = window.XMLHttpRequest.prototype.setRequestHeader;
    this.savedOpen = window.XMLHttpRequest.prototype.open;
    this.savedFetch = window.fetch;
  }

  /**
   * Restore original request function to default values
   */
  (0, _createClass2.default)(RequestInterceptor, [{
    key: "restore",
    value: function restore() {
      window.XMLHttpRequest.prototype.setRequestHeader = this.savedSetRequestHeader;
      window.XMLHttpRequest.prototype.open = this.savedOpen;
      window.fetch = this.savedFetch;
    }

    /**
     * Init the replacemenet of xhr and fetch function to be able to intercept requests
     */
  }, {
    key: "init",
    value: function init() {
      try {
        var self = this;
        window.XMLHttpRequest.prototype.setRequestHeader = function (key, value) {
          try {
            var newValue = this._requestHeaders[key] ? this._requestHeaders[key] += ', ' + value : value;
            this._requestHeaders[key] = newValue;
            return self.savedSetRequestHeader.apply(this, [].slice.call(arguments));
          } catch (err) {
            this.log('error', '❌❌❌ xhr setRequestHeader interception error ' + err.message);
          }
        };
        window.XMLHttpRequest.prototype.open = function (method, url) {
          try {
            var response = this;
            response._requestHeaders = {};
            response.addEventListener('readystatechange', function () {
              if (response.readyState === 4) {
                var responseHeaders = {};
                var allResponseHeaders = response.getAllResponseHeaders() ? response.getAllResponseHeaders().split('\r\n') : [];
                var _iterator = _createForOfIteratorHelper(allResponseHeaders),
                  _step;
                try {
                  for (_iterator.s(); !(_step = _iterator.n()).done;) {
                    var header = _step.value;
                    var _header$split = header.split(': '),
                      _header$split2 = (0, _slicedToArray2.default)(_header$split, 2),
                      key = _header$split2[0],
                      value = _header$split2[1];
                    responseHeaders[key] = value;
                  }
                } catch (err) {
                  _iterator.e(err);
                } finally {
                  _iterator.f();
                }
                self.serializeAndEmitResponse({
                  method: method,
                  url: url,
                  response: response,
                  responseHeaders: responseHeaders,
                  requestHeaders: response._requestHeaders
                });
              }
              return response;
            });
            return self.savedOpen.apply(response, [].slice.call(arguments));
          } catch (err) {
            this.log('error', '❌❌❌ xhr interception error ' + err.message);
          }
        };
        window.fetch = /*#__PURE__*/(0, _asyncToGenerator2.default)(/*#__PURE__*/_regenerator.default.mark(function _callee() {
          var _len,
            args,
            _key,
            response,
            input,
            options,
            url,
            method,
            responseHeaders,
            _iterator2,
            _step2,
            _step2$value,
            key,
            value,
            _args = arguments;
          return _regenerator.default.wrap(function _callee$(_context) {
            while (1) switch (_context.prev = _context.next) {
              case 0:
                for (_len = _args.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
                  args[_key] = _args[_key];
                }
                _context.next = 3;
                return self.savedFetch.apply(window, args);
              case 3:
                response = _context.sent;
                _context.prev = 4;
                input = args[0], options = args[1];
                url = typeof input === 'string' ? input : (input === null || input === void 0 ? void 0 : input.url) || (input === null || input === void 0 ? void 0 : input.toString());
                method = (options === null || options === void 0 ? void 0 : options.method) || (input === null || input === void 0 ? void 0 : input.method) || 'GET';
                responseHeaders = {};
                _iterator2 = _createForOfIteratorHelper(response.headers.entries());
                try {
                  for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                    _step2$value = (0, _slicedToArray2.default)(_step2.value, 2), key = _step2$value[0], value = _step2$value[1];
                    responseHeaders[key] = value;
                  }
                } catch (err) {
                  _iterator2.e(err);
                } finally {
                  _iterator2.f();
                }
                self.serializeAndEmitResponse({
                  method: method,
                  url: url,
                  response: response,
                  responseHeaders: responseHeaders,
                  requestHeaders: options === null || options === void 0 ? void 0 : options.headers
                });
                return _context.abrupt("return", response);
              case 15:
                _context.prev = 15;
                _context.t0 = _context["catch"](4);
                this.log('error', '❌❌❌ fetch interception error ' + _context.t0.message);
              case 18:
              case "end":
                return _context.stop();
            }
          }, _callee, this, [[4, 15]]);
        }));
      } catch (err) {
        this.log('error', '❌❌❌ interceptor init error ' + err.message);
      }
    }
    /**
     * Serialize the intercepted response according to the "serialize" attribute given in the
     * interception list and emit it as a "response" event
     *
     * @param {Response} resp - HTTP response
     */
  }, {
    key: "serializeAndEmitResponse",
    value: (function () {
      var _serializeAndEmitResponse = (0, _asyncToGenerator2.default)(/*#__PURE__*/_regenerator.default.mark(function _callee2(resp) {
        var interception;
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              interception = this.interceptions.find(function (doc) {
                return resp.method === doc.method && doc.exact ? resp.url === doc.url : resp.url.includes(doc.url);
              });
              if (interception) {
                _context2.next = 3;
                break;
              }
              return _context2.abrupt("return");
            case 3:
              if (interception.label) {
                this.log('warn', "RequestInterceptor: interception.label is deprecated, you should use interception.identifier");
              }
              resp.identifier = interception.identifier || interception.label;

              // response serialization, to be able to transfer to the pilot
              if (!(interception.serialization === 'json')) {
                _context2.next = 15;
                break;
              }
              if (!(resp.response instanceof Response)) {
                _context2.next = 12;
                break;
              }
              _context2.next = 9;
              return resp.response.clone().json();
            case 9:
              resp.response = _context2.sent;
              _context2.next = 13;
              break;
            case 12:
              resp.response = JSON.parse(resp.response.responseText);
            case 13:
              _context2.next = 38;
              break;
            case 15:
              if (!(interception.serialization === 'text')) {
                _context2.next = 25;
                break;
              }
              if (!(resp.response instanceof Response)) {
                _context2.next = 22;
                break;
              }
              _context2.next = 19;
              return resp.response.clone().text();
            case 19:
              resp.response = _context2.sent;
              _context2.next = 23;
              break;
            case 22:
              resp.response = resp.response.responseText;
            case 23:
              _context2.next = 38;
              break;
            case 25:
              if (!(interception.serialization === 'dataUri')) {
                _context2.next = 37;
                break;
              }
              if (!(resp.response instanceof Response)) {
                _context2.next = 34;
                break;
              }
              _context2.t0 = _utils.blobToBase64;
              _context2.next = 30;
              return resp.response.clone().blob();
            case 30:
              _context2.t1 = _context2.sent;
              resp.response = (0, _context2.t0)(_context2.t1);
              _context2.next = 35;
              break;
            case 34:
              resp.response = (0, _utils.blobToBase64)(resp.response.response);
            case 35:
              _context2.next = 38;
              break;
            case 37:
              this.log('error', '❌❌❌ wrong serialization method : ' + interception.serialization);
            case 38:
              this.emit('response', resp);
              this.log('debug', "RequestInterceptor: intercepted ".concat(resp.method, " ").concat(resp.url, " response"));
            case 40:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this);
      }));
      function serializeAndEmitResponse(_x) {
        return _serializeAndEmitResponse.apply(this, arguments);
      }
      return serializeAndEmitResponse;
    }())
  }, {
    key: "setLogger",
    value: function setLogger(logger) {
      this.log = logger;
    }
  }]);
  return RequestInterceptor;
}();
_microee.default.mixin(RequestInterceptor);
var _default = exports["default"] = RequestInterceptor;
/**
 * @typedef EmittedResponse
 * @property {string} [label] - a name given to the interception (deprecated in favor of identifier)
 * @property {string} identifier - an identifier given to the interception
 * @property {'GET'|'POST'|'PUT'|'DELETE'} method - the method of the intercepted request
 * @property {string} url - the url intercepted request url
 * @property {Response} response - raw response of the intercepted request
 * @property {object} responseHeaders - response headers
 * @property {object} requestHeaders - request headers
 */
/**
 * @typedef InterceptionDocument
 * @property {string} [label] - a name given to the interception, will be found in the response later (deprecated in favor of identifier)
 * @property {string} identifier - an identifier given to the interception
 * @property {string} url - the url to intercept
 * @property {'GET'|'POST'|'PUT'|'DELETE'} method - the method of the url to intercept
 * @property {boolean} exact - true if the intercepted url must exactly correspond to the given url
 */

/***/ }),
/* 53 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ XhrInterceptor)
/* harmony export */ });
class XhrInterceptor {
  constructor() {
    this.recentBills = {}
    this.userInfos = {}
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
      // Intercepting user infomations for Identity object
      if (arguments[1]?.includes('ecd_wp/portfoliomanager/portfolio?')) {
        originalResponse.addEventListener('readystatechange', function () {
          if (originalResponse.readyState === 4) {
            const jsonInfos = JSON.parse(originalResponse.responseText)
            self.userInfos.portfolio = jsonInfos
          }
        })
        return proxied.apply(this, [].slice.call(arguments))
      }

      // Intercepting more infos for Identity object
      if (arguments[1]?.includes('ecd_wp/account/identification')) {
        originalResponse.addEventListener('readystatechange', function () {
          if (originalResponse.readyState === 4) {
            const jsonInfos = JSON.parse(originalResponse.responseText)
            self.userInfos.identification = jsonInfos
          }
        })
        return proxied.apply(this, [].slice.call(arguments))
      }
      // Intercepting billingAddress infos for Identity object
      if (arguments[1]?.includes('ecd_wp/account/billingAddresses')) {
        originalResponse.addEventListener('readystatechange', function () {
          if (originalResponse.readyState === 4) {
            const jsonInfos = JSON.parse(originalResponse.responseText)
            self.userInfos.billingAddresses = jsonInfos
          }
        })
        return proxied.apply(this, [].slice.call(arguments))
      }

      return proxied.apply(this, [].slice.call(arguments))
    }
  }
}


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var cozy_clisk_dist_contentscript__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _cozy_minilog__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(19);
/* harmony import */ var _cozy_minilog__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_cozy_minilog__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var p_wait_for__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(34);
/* harmony import */ var ky_umd__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(32);
/* harmony import */ var ky_umd__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(ky_umd__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _interceptor__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(53);
/* harmony import */ var cozy_clisk_dist_contentscript_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(35);
/* eslint-disable no-console */








const log = _cozy_minilog__WEBPACK_IMPORTED_MODULE_1___default()('ContentScript')
_cozy_minilog__WEBPACK_IMPORTED_MODULE_1___default().enable('soshCCC')

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
const interceptor = new _interceptor__WEBPACK_IMPORTED_MODULE_3__["default"]()
interceptor.init()

class SoshContentScript extends cozy_clisk_dist_contentscript__WEBPACK_IMPORTED_MODULE_0__.ContentScript {
  // ///////
  // PILOT//
  // ///////
  async onWorkerEvent({ event, payload }) {
    if (event === 'loginSubmit') {
      const { login, password } = payload || {}
      // When the user has chosen mobileConnect option, there is no password request
      // So wee need to check both separatly to ensure we got at least the user login
      if (login) {
        this.store.userCredentials = { ...this.store.userCredentials, login }
      }
      if (password) {
        this.store.userCredentials = { ...this.store.userCredentials, password }
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
      (await this.checkForElement('[data-testid=selected-account-login]'))
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
    await (0,p_wait_for__WEBPACK_IMPORTED_MODULE_2__["default"])(
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
          message: new p_wait_for__WEBPACK_IMPORTED_MODULE_2__.TimeoutError(
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
    // There is now two "elcosHeaders" element, one with a define class, the other without. We want he second
    const elcosHeaders = document.querySelector(
      'elcos-header[class=""]'
    )?.shadowRoot
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
      elcosHeaders?.querySelector('a[title="Se déconnecter"]')
    )
    const isDisconnected = Boolean(
      elcosHeaders?.querySelector('a[title="Se connecter"]')
    )
    const isConsentPage = Boolean(
      document.querySelector('#didomi-notice-disagree-button')
    )
    const isMobileconnect = document.querySelector(
      'button[data-testid="submit-mc"]'
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
    else if (isMobileconnect) return 'mobileConnectPage'
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
      await this.evaluateInWorker(() => {
        document
          .querySelector('elcos-header[class=""]')
          .shadowRoot.querySelector('a[title="Se déconnecter"]')
          .click()
      })
    } else if (
      currentState === 'passwordAlonePage' ||
      currentState === 'mobileConnectPage'
    ) {
      await this.waitForElementInWorker('[data-testid=change-account]')
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
      await this.evaluateInWorker(() => {
        document
          .querySelector('elcos-header[class=""]')
          .shadowRoot.querySelector('a[title="Se connecter"]')
          .click()
      })
    } else {
      throw new Error(`Unknown page state: ${currentState}`)
    }
  }

  async waitForNextState(previousState) {
    let currentState
    await (0,p_wait_for__WEBPACK_IMPORTED_MODULE_2__["default"])(
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
          message: new p_wait_for__WEBPACK_IMPORTED_MODULE_2__.TimeoutError(
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
    const elcosHeaders = document.querySelector(
      'elcos-header[class=""]'
    )?.shadowRoot

    const isConnectedElementPresent = Boolean(
      elcosHeaders?.querySelector('a[title="Se déconnecter"]')
    )
    const isDisconnectElementPresent = Boolean(
      elcosHeaders?.querySelector('a[title="Se connecter"]')
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
    } else {
      const isBaseUrl = document.location.href.match(BASE_URL)
      if (isBaseUrl && isDisconnectElementPresent) {
        this.log(
          'info',
          'Check Authenticated succeeded, but ended on the base url'
        )
        return true
      }
      return false
    }
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
    await (0,p_wait_for__WEBPACK_IMPORTED_MODULE_2__["default"])(
      () => {
        return window.location.href === ERROR_URL
      },
      {
        interval: 1000,
        timeout: {
          milliseconds: 30 * 1000,
          message: new p_wait_for__WEBPACK_IMPORTED_MODULE_2__.TimeoutError(
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
    await this.waitForElementInWorker('ecm-section-bill')
    const contracts = await this.runInWorker('getContracts')
    if (!contracts.length) {
      this.log(
        'warn',
        'Seems like no Sosh contracts were found, check if the user is using an Orange account. Execution ended'
      )
      return true
    }
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
      if (FORCE_FETCH_ALL && oldBillsUrl) {
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
    if (this.store.skippingIdentity) {
      this.log('warn', 'Identity scraping skipped')
      return true
    }
    await this.runInWorker('getIdentity')
    await this.saveIdentity({ contact: this.store.infosIdentity })
  }

  async handleContextInfos(context) {
    this.log('info', '📍️ handleContextInfos starts')
    const { trigger } = context
    // force fetch all data (the long way) when last trigger execution is older than 90 days
    // or when the last job was an error
    const isFirstJob =
      !trigger.current_state?.last_failure &&
      !trigger.current_state?.last_success
    const isLastJobError =
      !isFirstJob &&
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
    const oldBills = await this.runInWorker(
      'getOldBillsFromWorker',
      oldBillsUrl
    )
    if (!oldBills) {
      this.log(
        'error',
        'Url seems to be valid, but something unexpected happened when fetching it'
      )
      throw new Error('UNKNOWN_ERROR.PARTIAL_SYNC')
    }
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
    await Promise.race([
      this.waitForElementInWorker('a[href*="/historique-des-factures"]'),
      this.waitForElementInWorker('span', {
        includesText: 'Pas de facture disponible'
      })
    ])
    if (
      await this.isElementInWorker('span', {
        includesText: 'Pas de facture disponible'
      })
    ) {
      this.log('warn', 'No bills to download for this contract')
      return { recentBills: [], oldBillsUrl: undefined }
    }
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

    // Keep this log around for debug, to remove next time if not needed anymore
    this.log(
      'info',
      `Object.keys(recentBills) : ${JSON.stringify(Object.keys(recentBills))}`
    )
    this.log(
      'info',
      `Object.keys(recentBills.billsHistory) : ${JSON.stringify(
        Object.keys(recentBills.billsHistory)
      )}`
    )

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
    const oldBillsUrl = recentBills.billsHistory?.oldBillsHref
    return { recentBills: saveBillsEntries, oldBillsUrl }
  }

  async checkMoreBillsButton() {
    this.log('info', '📍️ checkMoreBillsButton starts')
    await (0,p_wait_for__WEBPACK_IMPORTED_MODULE_2__["default"])(
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
    await this.PromiseRaceWithError(
      [
        this.runInWorker('checkAccessibilityUrl'),
        this.waitForElementInWorker('p', {
          includesText: 'Infos de contact'
        })
      ],
      'navigateToPersonalInfos: checking landing page'
    )
    if (
      !(await this.isElementInWorker('p', {
        includesText: 'Infos de contact'
      }))
    ) {
      this.log(
        'warn',
        'Something went wrong when accessing personal info page, skipping identity scraping'
      )
      this.store.skippingIdentity = true
    }
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
      await this.waitForElementInWorker('#soshboard')
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
    if (!oldBillsUrl) {
      this.log('warn', 'oldBillsUrl is falsy ')
      return null
    }
    const OLD_BILLS_URL_PREFIX =
      'https://espace-client.orange.fr/ecd_wp/facture/historicBills'
    let jsonResp
    try {
      jsonResp = await ky_umd__WEBPACK_IMPORTED_MODULE_5___default().get(OLD_BILLS_URL_PREFIX + oldBillsUrl, {
          headers: {
            ...ORANGE_SPECIAL_HEADERS,
            ...JSON_HEADERS
          }
        })
        .json()
    } catch (error) {
      this.log(
        'error',
        `error when requesting oldBills url :${JSON.stringify(error)}`
      )
    }
    return jsonResp?.oldBills
  }

  async getRecentBillsFromInterceptor() {
    return interceptor.recentBills
  }

  async autoFill(credentials) {
    const loginInput = document.querySelector('#login')
    let passwordInput = document.querySelector('#password')
    let mobileConnectSumbit = document.querySelector(
      'button[data-testid="submit-mc"]'
    )
    if (credentials.login && loginInput && !passwordInput) {
      // Fully simulate React event to bypass orange's verifications
      await this.dispatchReactEvent(loginInput, credentials.login)
      // Waiting for both password input or mobileConnect submit button
      await this.waitForElementNoReload(
        '#password, button[data-testid="submit-mc"]'
      )
      this.log('debug', 'Password input or MCSubmit button showed up')
    }
    // check presence again in case the login autoFill has been done
    passwordInput = document.querySelector('#password')
    mobileConnectSumbit = document.querySelector(
      'button[data-testid="submit-mc"]'
    )
    this.log('debug', `Password input : ${Boolean(passwordInput)}`)
    this.log('debug', `MCSubmit button : ${Boolean(mobileConnectSumbit)}`)
    if (credentials.password && passwordInput && !mobileConnectSumbit) {
      await this.dispatchReactEvent(passwordInput, credentials.password)
    }
  }

  async dispatchReactEvent(targetInput, credential) {
    this.log('info', '📍️ dispatchReactEvent starts')
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      'value'
    ).set
    targetInput.focus()
    targetInput.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    targetInput.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }))
    targetInput.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    // set value via native setter
    nativeInputValueSetter.call(targetInput, credential)
    // dispatch input event React-style
    const event = new Event('input', { bubbles: true })
    event.simulated = true // React checks for this
    targetInput.dispatchEvent(event)
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
    await (0,p_wait_for__WEBPACK_IMPORTED_MODULE_2__["default"])(this.checkCaptchaResolution, {
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

  async checkAccessibilityUrl() {
    this.log('info', '📍️ checkAccessibilityUrl starts')
    await (0,p_wait_for__WEBPACK_IMPORTED_MODULE_2__["default"])(
      () => {
        const currentUrl = document.location.href
        if (currentUrl.includes('/accessibilite?sosh=oui&')) {
          this.log('warn', 'Found accessibility score url')
          return true
        } else return false
      },
      {
        interval: 1000,
        timeout: 30 * 1000
      }
    )
    return true
  }

  async downloadFileInWorker(entry) {
    // overload ContentScript.downloadFileInWorker to be able to check the status of the file. Since not-so-long ago, recent bills on some account are all receiving a 403 error, issue is on their side, either on browser desktop/mobile.
    // This does not affect bills older than one year (so called oldBills) for the moment
    this.log('debug', 'downloading file in worker')
    let response
    response = await fetch(entry.fileurl, {
      headers: {
        ...ORANGE_SPECIAL_HEADERS,
        ...JSON_HEADERS
      }
    })
    const clonedResponse = await response.clone()
    const respToText = await clonedResponse.text()
    if (respToText.match('403 Forbidden')) {
      this.log('warn', 'This file received a 403, check on the website')
      return null
    }
    entry.blob = await response.blob()
    entry.dataUri = await (0,cozy_clisk_dist_contentscript_utils__WEBPACK_IMPORTED_MODULE_4__.blobToBase64)(entry.blob)
    if (entry.dataUri) {
      return entry.dataUri
    }
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
      'autoFill',
      'checkAccessibilityUrl'
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

})();

/******/ })()
;