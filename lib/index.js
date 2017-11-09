'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createReducer = exports.statusToError = exports.getStatusError = exports.createAction = exports.httpServices = undefined;

var _isError2 = require('lodash/isError');

var _isError3 = _interopRequireDefault(_isError2);

var _zipObject2 = require('lodash/zipObject');

var _zipObject3 = _interopRequireDefault(_zipObject2);

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _queryString = require('query-string');

var _queryString2 = _interopRequireDefault(_queryString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

try {
  fetch;
} catch (error) {
  require('isomorphic-fetch');
}

var httpServices = exports.httpServices = function () {
  function httpServices() {
    for (var _len = arguments.length, opts = Array(_len), _key = 0; _key < _len; _key++) {
      opts[_key] = arguments[_key];
    }

    _classCallCheck(this, httpServices);

    opts = (0, _zipObject3.default)(['domain', 'apiPath', 'statusMessage'], opts);
    this.state = {
      domain: opts.domain || '',
      apiPath: opts.apiPath || '',
      statusMessage: opts.statusMessage || 'Request Success!'
    };
  }

  _createClass(httpServices, [{
    key: 'getAPI',
    value: function getAPI(url) {
      var _options = this.options,
          domain = _options.domain,
          apiPath = _options.apiPath;

      return '' + domain + apiPath + url;
    }
  }, {
    key: 'GET',
    value: function GET(url, params) {
      url = this.getAPI(url);
      if (params) {
        url += '?' + _queryString2.default.stringify(params);
      }
      return fetch(url).then(checkStatus).then(parseJSON);
    }
  }, {
    key: 'POST',
    value: function POST(url, body) {
      url = this.getAPI(url);
      return fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      }).then(checkStatus).then(parseJSON);
    }
  }, {
    key: 'options',
    get: function get() {
      return this.state;
    }
  }, {
    key: 'domain',
    set: function set(val) {
      this.state.domain = val;
    },
    get: function get() {
      return this.state.domain;
    }
  }, {
    key: 'apiPath',
    set: function set(val) {
      this.state.apiPath = val;
    },
    get: function get() {
      return this.state.apiPath;
    }
  }, {
    key: 'statusMessage',
    set: function set(val) {
      this.state.statusMessage = val;
    },
    get: function get() {
      return this.state.statusMessage;
    }
  }, {
    key: 'defaultStatus',
    get: function get() {
      return {
        code: 0,
        message: this.state.statusMessage
      };
    }
  }]);

  return httpServices;
}();

var createAction = exports.createAction = function createAction(type, ret) {
  var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

  var isError = (0, _isError3.default)(ret);
  return Object.assign({
    type: type,
    payload: isError ? null : ret,
    error: isError ? ret : null
  }, opts);
};

var getStatusError = exports.getStatusError = function getStatusError(error) {
  var code = error.code,
      message = error.message,
      response = error.response;

  if (response) {
    var status = response.status,
        statusText = response.statusText;

    return {
      code: status,
      message: statusText
    };
  }
  return {
    code: code || 1000,
    message: message || 'Abnormal error'
  };
};

var statusToError = exports.statusToError = function statusToError(payload, error, message) {
  var status = payload.status;

  var info = {};
  info[error] = status.code > 0 ? status : null;
  if (message) {
    info[error] = status.code;
    info[message] = status.message;
  }
  return info;
};

var createReducer = exports.createReducer = function createReducer(state, action, handlers) {
  var handler = handlers[action.type];
  return handler ? handler(state, action) : state;
};

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    var error = new Error(response._bodyText);
    error.response = response;
    throw error;
  }
}

function parseJSON(response) {
  return response.json();
}