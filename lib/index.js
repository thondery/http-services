'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var qs = require('query-string');
var _ = require('lodash');

try {
  fetch;
} catch (error) {
  require('isomorphic-fetch');
}

var httpServices = function () {
  function httpServices() {
    for (var _len = arguments.length, opts = Array(_len), _key = 0; _key < _len; _key++) {
      opts[_key] = arguments[_key];
    }

    _classCallCheck(this, httpServices);

    opts = _.zipObject(['domain', 'apiPath', 'statusMessage'], opts);
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
      var headers = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      url = this.getAPI(url);
      if (params) {
        url += '?' + qs.stringify(params);
      }
      return fetch(url, { headers: headers }).then(checkStatus).then(parseJSON);
    }
  }, {
    key: 'POST',
    value: function POST(url, body) {
      var headers = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      url = this.getAPI(url);
      return fetch(url, {
        method: 'POST',
        headers: Object.assign({
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }, headers),
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

exports.httpServices = httpServices;

exports.createAction = function (type, ret) {
  var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

  var isError = _.isError(ret);
  return Object.assign({
    type: type,
    payload: isError ? null : ret,
    error: isError ? ret : null
  }, opts);
};

exports.getStatusError = function (error) {
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

exports.statusToError = function (payload, error, message) {
  var status = payload.Status || payload.status;
  var info = {};
  info[error] = status.code > 0 ? status : null;
  if (message) {
    info[error] = status.code;
    info[message] = status.message;
  }
  return info;
};

exports.createReducer = function (state, action, handlers) {
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
