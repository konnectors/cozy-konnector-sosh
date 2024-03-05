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
var _RequestInterceptor = _interopRequireDefault(__webpack_require__(51));

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
var _toConsumableArray2 = _interopRequireDefault(__webpack_require__(7));
var _asyncToGenerator2 = _interopRequireDefault(__webpack_require__(13));
var _classCallCheck2 = _interopRequireDefault(__webpack_require__(14));
var _createClass2 = _interopRequireDefault(__webpack_require__(15));
var _pWaitFor = _interopRequireWildcard(__webpack_require__(18));
var _pTimeout = _interopRequireDefault(__webpack_require__(19));
var _minilog = _interopRequireDefault(__webpack_require__(20));
var _LauncherBridge = _interopRequireDefault(__webpack_require__(32));
var _utils = __webpack_require__(41);
var _wrapTimer = __webpack_require__(42);
var _umd = _interopRequireDefault(__webpack_require__(44));
var _package = _interopRequireDefault(__webpack_require__(45));
var _utils2 = __webpack_require__(46);
var _window; // @ts-check
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
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
      var _init = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {
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
      var _setContentScriptType = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2(contentScriptType) {
        var _this3 = this;
        var _this$requestIntercep;
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              this.contentScriptType = contentScriptType;
              _log.info("I am the ".concat(contentScriptType));
              if (this.bridge) {
                _context2.next = 4;
                break;
              }
              throw new Error('No bridge is defined, you should call ContentScript.init before using this method');
            case 4:
              if (contentScriptType === WORKER_TYPE) {
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
            case 5:
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
      var _checkAuthenticated = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee3() {
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
      var _waitForAuthenticated = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee4() {
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
      var _waitForDomReady = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee5() {
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
      var _waitForNotAuthenticated = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee7() {
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
              return (0, _pWaitFor.default)( /*#__PURE__*/(0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee6() {
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
      var _runInWorker = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee8(method) {
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
     * @param {Array} [options.args] - array of args to pass to the method
     * @returns {Promise<boolean>} - true
     * @throws {TimeoutError} - if timeout expired
     */
    )
  }, {
    key: "runInWorkerUntilTrue",
    value: (function () {
      var _runInWorkerUntilTrue = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee9(_ref3) {
        var method, _ref3$timeout, timeout, _ref3$args, args, result, start, isTimeout;
        return _regenerator.default.wrap(function _callee9$(_context9) {
          while (1) switch (_context9.prev = _context9.next) {
            case 0:
              method = _ref3.method, _ref3$timeout = _ref3.timeout, timeout = _ref3$timeout === void 0 ? Infinity : _ref3$timeout, _ref3$args = _ref3.args, args = _ref3$args === void 0 ? [] : _ref3$args;
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
              throw new _pWaitFor.TimeoutError("runInWorkerUntilTrue ".concat(method, " Timeout error after ").concat(timeout));
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
      var _waitForElementInWorker = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee10(selector) {
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
      var _isElementInWorker = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee11(selector) {
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
      var _waitForElementNoReload = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee12(selector) {
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
      var _checkForElement = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee13(selector) {
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
      var _click = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee14(selector) {
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
      var _clickAndWait = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee15(elementToClick, elementToWait) {
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
      var _fillText = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee16(selector, text) {
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
      var _downloadFileInWorker = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee17(entry) {
        var errorMessage, errorToLog;
        return _regenerator.default.wrap(function _callee17$(_context17) {
          while (1) switch (_context17.prev = _context17.next) {
            case 0:
              this.onlyIn(WORKER_TYPE, 'downloadFileInWorker');
              this.log('debug', 'downloading file in worker');
              if (!entry.fileurl) {
                _context17.next = 24;
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
              _context17.next = 24;
              break;
            case 12:
              _context17.prev = 12;
              _context17.t0 = _context17["catch"](3);
              this.log('debug', "Full error : ".concat(JSON.stringify(_context17.t0)));
              errorMessage = _context17.t0.message;
              errorToLog = '';
              if (!errorMessage.includes(/404|403|500|502|503/g)) {
                _context17.next = 23;
                break;
              }
              if (errorMessage.includes('404')) errorToLog = 'Website cannot find the wanted url';else if (errorMessage.includes('403')) errorToLog = 'User is not allowed to access the wanted URL';else errorToLog = 'Website server error accessing the wanted URL';
              this.log('error', errorToLog);
              throw new Error('VENDOR_DOWN');
            case 23:
              throw new Error('UNKNOWN_ERROR');
            case 24:
              return _context17.abrupt("return", entry.dataUri);
            case 25:
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
      var _getDebugData = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee18() {
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
      var _saveFiles = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee19(entries, options) {
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
      var _queryAll = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee20(queryDefinition, options) {
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
      var _saveBills = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee21(entries, options) {
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
      var _getCredentials = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee22() {
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
      var _saveCredentials = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee23(credentials) {
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
      var _saveIdentity = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee24(identity) {
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
      var _getCookiesByDomain = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee25(domain) {
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
      var _getCookieFromKeychainByName = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee26(cookieName) {
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
      var _saveCookieToKeychain = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee27(cookieValue) {
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
      var _getCookieByDomainAndName = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee28(cookieDomain, cookieName) {
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
      var _setWorkerState = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee29() {
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
      var _goto = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee30(url) {
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
      var _blockWorkerInteractions = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee31() {
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
      var _unblockWorkerInteractions = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee32() {
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
      var _evaluateInWorker = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee33(fn) {
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
      var _evaluate = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee34(fnString) {
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
      var _ensureAuthenticated = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee35() {
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
      var _ensureNotAuthenticated = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee36() {
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
      var _getUserDataFromWebsite = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee37() {
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
      var _sendToPilot = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee38(obj) {
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
      var _storeFromWorker = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee39(obj) {
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
     * Main function, fetches all connector data and save it to the cozy
     *
     * @param {object} options : options object
     * @param {object} options.context : all the data already fetched by the connector in a previous execution. Will be usefull to optimize
     * connector execution by not fetching data we already have.
     * @returns {Promise.<object>} : Connector execution result. TBD
     */
    // eslint-disable-next-line no-unused-vars
  }, {
    key: "fetch",
    value: (function () {
      var _fetch = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee40(options) {
        return _regenerator.default.wrap(function _callee40$(_context40) {
          while (1) switch (_context40.prev = _context40.next) {
            case 0:
            case "end":
              return _context40.stop();
          }
        }, _callee40);
      }));
      function fetch(_x32) {
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
      var _getCliskVersion = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee41() {
        return _regenerator.default.wrap(function _callee41$(_context41) {
          while (1) switch (_context41.prev = _context41.next) {
            case 0:
              return _context41.abrupt("return", _package.default.version);
            case 1:
            case "end":
              return _context41.stop();
          }
        }, _callee41);
      }));
      function getCliskVersion() {
        return _getCliskVersion.apply(this, arguments);
      }
      return getCliskVersion;
    }())
  }]);
  return ContentScript;
}();
function sendPageMessage(message) {
  var _window$ReactNativeWe;
  // @ts-ignore La propriété 'ReactNativeWebView' n'existe pas sur le type 'Window & typeof globalThis'.
  if ((_window$ReactNativeWe = window.ReactNativeWebView) !== null && _window$ReactNativeWe !== void 0 && _window$ReactNativeWe.postMessage) {
    var _window$ReactNativeWe2;
    // @ts-ignore La propriété 'ReactNativeWebView' n'existe pas sur le type 'Window & typeof globalThis'.
    (_window$ReactNativeWe2 = window.ReactNativeWebView) === null || _window$ReactNativeWe2 === void 0 || _window$ReactNativeWe2.postMessage(JSON.stringify({
      message: message
    }));
  } else {
    _log.error('No window.ReactNativeWebView.postMessage available');
  }
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

var arrayWithoutHoles = __webpack_require__(8);
var iterableToArray = __webpack_require__(10);
var unsupportedIterableToArray = __webpack_require__(11);
var nonIterableSpread = __webpack_require__(12);
function _toConsumableArray(arr) {
  return arrayWithoutHoles(arr) || iterableToArray(arr) || unsupportedIterableToArray(arr) || nonIterableSpread();
}
module.exports = _toConsumableArray, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 8 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var arrayLikeToArray = __webpack_require__(9);
function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return arrayLikeToArray(arr);
}
module.exports = _arrayWithoutHoles, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 9 */
/***/ ((module) => {

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}
module.exports = _arrayLikeToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 10 */
/***/ ((module) => {

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
module.exports = _iterableToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 11 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var arrayLikeToArray = __webpack_require__(9);
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
/* 12 */
/***/ ((module) => {

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
module.exports = _nonIterableSpread, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 13 */
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
/* 14 */
/***/ ((module) => {

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
module.exports = _classCallCheck, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 15 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var toPropertyKey = __webpack_require__(16);
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
/* 16 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var _typeof = (__webpack_require__(6)["default"]);
var toPrimitive = __webpack_require__(17);
function _toPropertyKey(arg) {
  var key = toPrimitive(arg, "string");
  return _typeof(key) === "symbol" ? key : String(key);
}
module.exports = _toPropertyKey, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 17 */
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
/* 18 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TimeoutError": () => (/* reexport safe */ p_timeout__WEBPACK_IMPORTED_MODULE_0__.TimeoutError),
/* harmony export */   "default": () => (/* binding */ pWaitFor)
/* harmony export */ });
/* harmony import */ var p_timeout__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(19);


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
/* 19 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AbortError": () => (/* binding */ AbortError),
/* harmony export */   "TimeoutError": () => (/* binding */ TimeoutError),
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
/* 20 */
/***/ ((module, exports, __webpack_require__) => {

var Minilog = __webpack_require__(21);

var oldEnable = Minilog.enable,
    oldDisable = Minilog.disable,
    isChrome = (typeof navigator != 'undefined' && /chrome/i.test(navigator.userAgent)),
    console = __webpack_require__(25);

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
  array: __webpack_require__(29),
  browser: Minilog.defaultBackend,
  localStorage: __webpack_require__(30),
  jQuery: __webpack_require__(31)
};


/***/ }),
/* 21 */
/***/ ((module, exports, __webpack_require__) => {

var Transform = __webpack_require__(22),
    Filter = __webpack_require__(24);

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
/* 22 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var microee = __webpack_require__(23);

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
/* 23 */
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
/* 24 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// default filter
var Transform = __webpack_require__(22);

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
/* 25 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Transform = __webpack_require__(22);

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
logger.color = __webpack_require__(26);
logger.minilog = __webpack_require__(28);

module.exports = logger;


/***/ }),
/* 26 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Transform = __webpack_require__(22),
    color = __webpack_require__(27);

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
/* 27 */
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
/* 28 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Transform = __webpack_require__(22),
    color = __webpack_require__(27),
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
/* 29 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Transform = __webpack_require__(22),
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
/* 30 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Transform = __webpack_require__(22),
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
/* 31 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Transform = __webpack_require__(22);

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
/* 32 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(2);
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(__webpack_require__(4));
var _asyncToGenerator2 = _interopRequireDefault(__webpack_require__(13));
var _classCallCheck2 = _interopRequireDefault(__webpack_require__(14));
var _createClass2 = _interopRequireDefault(__webpack_require__(15));
var _possibleConstructorReturn2 = _interopRequireDefault(__webpack_require__(33));
var _getPrototypeOf2 = _interopRequireDefault(__webpack_require__(35));
var _inherits2 = _interopRequireDefault(__webpack_require__(36));
var _postMe = __webpack_require__(38);
var _ContentScriptMessenger = _interopRequireDefault(__webpack_require__(39));
var _bridgeInterfaces = __webpack_require__(40);
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
      var _init = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {
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
/* 33 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var _typeof = (__webpack_require__(6)["default"]);
var assertThisInitialized = __webpack_require__(34);
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
/* 34 */
/***/ ((module) => {

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
module.exports = _assertThisInitialized, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 35 */
/***/ ((module) => {

function _getPrototypeOf(o) {
  module.exports = _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  }, module.exports.__esModule = true, module.exports["default"] = module.exports;
  return _getPrototypeOf(o);
}
module.exports = _getPrototypeOf, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 36 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var setPrototypeOf = __webpack_require__(37);
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
/* 37 */
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
/* 38 */
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
/* 39 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(2);
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _classCallCheck2 = _interopRequireDefault(__webpack_require__(14));
var _createClass2 = _interopRequireDefault(__webpack_require__(15));
var _possibleConstructorReturn2 = _interopRequireDefault(__webpack_require__(33));
var _getPrototypeOf2 = _interopRequireDefault(__webpack_require__(35));
var _inherits2 = _interopRequireDefault(__webpack_require__(36));
var _bridgeInterfaces = __webpack_require__(40);
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
/* 40 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(2);
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.MessengerInterface = exports.Bridge = void 0;
var _regenerator = _interopRequireDefault(__webpack_require__(4));
var _asyncToGenerator2 = _interopRequireDefault(__webpack_require__(13));
var _classCallCheck2 = _interopRequireDefault(__webpack_require__(14));
var _createClass2 = _interopRequireDefault(__webpack_require__(15));
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
      var _init = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(options) {
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
      var _call = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2(method) {
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
/* 41 */
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
var _asyncToGenerator2 = _interopRequireDefault(__webpack_require__(13));
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
  _blobToBase = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(blob) {
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
  _callStringFunction = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2(fnString) {
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
/* 42 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var _interopRequireDefault = __webpack_require__(2);
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.wrapTimerFactory = exports.wrapTimer = void 0;
var _regenerator = _interopRequireDefault(__webpack_require__(4));
var _asyncToGenerator2 = _interopRequireDefault(__webpack_require__(13));
var _defineProperty2 = _interopRequireDefault(__webpack_require__(43));
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
  return /*#__PURE__*/(0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {
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
/* 43 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var toPropertyKey = __webpack_require__(16);
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
/* 44 */
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
/* 45 */
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"name":"cozy-clisk","version":"0.35.0","description":"All the libs needed to run a cozy client connector","repository":{"type":"git","url":"git+https://github.com/konnectors/libs.git"},"files":["dist"],"keywords":["konnector"],"main":"dist/index.js","author":"doubleface <christophe@cozycloud.cc>","license":"MIT","bugs":{"url":"https://github.com/konnectors/libs/issues"},"homepage":"https://github.com/konnectors/libs#readme","scripts":{"lint":"eslint \'src/**/*.js\'","prepublishOnly":"yarn run build","build":"babel --root-mode upward src/ -d dist/ --copy-files --verbose --ignore \'**/*.spec.js\',\'**/*.spec.jsx\'","test":"jest src"},"devDependencies":{"@babel/core":"7.20.12","babel-jest":"29.3.1","babel-preset-cozy-app":"2.0.4","jest":"29.3.1","jest-environment-jsdom":"29.3.1","typescript":"4.9.5"},"dependencies":{"@cozy/minilog":"^1.0.0","bluebird-retry":"^0.11.0","ky":"^0.25.1","lodash":"^4.17.21","p-timeout":"^6.0.0","p-wait-for":"^5.0.2","post-me":"^0.4.5"},"peerDependencies":{"cozy-client":">=41.2.0"},"gitHead":"e49e807aebae907627399a98ad1c4743fa360eea"}');

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
var unsupportedIterableToArray = __webpack_require__(11);
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
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(__webpack_require__(4));
var _asyncToGenerator2 = _interopRequireDefault(__webpack_require__(13));
var _slicedToArray2 = _interopRequireDefault(__webpack_require__(47));
var _classCallCheck2 = _interopRequireDefault(__webpack_require__(14));
var _createClass2 = _interopRequireDefault(__webpack_require__(15));
var _microee = _interopRequireDefault(__webpack_require__(23));
var _utils = __webpack_require__(41);
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; } /* eslint no-console: off */
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
        window.fetch = /*#__PURE__*/(0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {
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
      var _serializeAndEmitResponse = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2(resp) {
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
/* 52 */
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
/* harmony import */ var _cozy_minilog__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(20);
/* harmony import */ var _cozy_minilog__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_cozy_minilog__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var p_wait_for__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(18);
/* harmony import */ var ky_umd__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(44);
/* harmony import */ var ky_umd__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(ky_umd__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _interceptor__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(52);
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
    await this.waitForDomReady()
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
      if (checkBox) {
        checkBox.click()
        // Setting the visibility to hidden on the parent to make the element disapear
        // preventing users to click it
        checkBox.parentNode.parentNode.style.visibility = 'hidden'
      }
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

  /**
   * Sometimes, depending on the device, #undefined-label may not be clickable yet
   * we click on it until it disappears
   */
  async waitForUndefinedLabelReallyClicked() {
    await (0,p_wait_for__WEBPACK_IMPORTED_MODULE_2__["default"])(
      function clickOnElementUntilItDisapear() {
        const elem = document.querySelector(
          '[data-testid=choose-other-account]'
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
    const isErrorUrl = window.location.href.includes('error')
    const isLoginPage = Boolean(document.querySelector('#login'))
    const isPasswordAlone = Boolean(
      document.querySelector('#password') && !isLoginPage
    )
    const isAccountList = Boolean(
      document.querySelector('[data-testid=choose-other-account]')
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
      document.querySelector('#oecs__zone-identity-layer_client_disconnect')
    )
    const isDisconnected = Boolean(
      document.querySelector('#oecs__zone-identity-layer_prospect_connect')
    )
    const isConsentPage = Boolean(
      document.querySelector('#didomi-notice-disagree-button')
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
      await this.runInWorker(
        'click',
        '#oecs__zone-identity-layer_client_disconnect'
      )
    } else if (currentState === 'passwordAlonePage') {
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
      await this.runInWorker(
        'click',
        '#oecs__zone-identity-layer_prospect_connect'
      )
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
    const isConnectedElementPresent = Boolean(
      document.querySelector('#oecs__connecte')
    )
    const isDisconnectElementPresent = Boolean(
      document.querySelector('#oecs__zone-identity-layer_client_disconnect')
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

  async autoFill(credentials) {
    if (credentials.login) {
      const loginElement = document.querySelector('#login')
      if (loginElement) {
        loginElement.addEventListener('click', () => {
          loginElement.value = credentials.login
        })
        const submitElement = document.querySelector('#btnSubmit')
        submitElement.addEventListener('click', async () => {
          await this.waitForElementNoReload('#password')
          const passwordElement = document.querySelector('#password')
          passwordElement.focus()
          passwordElement.value = credentials.password
        })
      }
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
    return await ky_umd__WEBPACK_IMPORTED_MODULE_4___default().get(OLD_BILLS_URL_PREFIX + oldBillsUrl, {
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
        givenName:
          interceptor.identification?.contracts?.[0]?.holder?.firstName,
        lastName: interceptor.identification?.contracts?.[0]?.holder?.lastName
      },
      email: [
        {
          address:
            interceptor.identification?.contactInformation?.email?.address
        }
      ],
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
      'getContracts',
      'waitForNextState',
      'getCurrentState',
      'autoFill'
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