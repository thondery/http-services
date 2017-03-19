# http-services

### A set of tools for the http service ...

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Build Status][travis-image]][travis-url]
[![Codecov Status][codecov-image]][codecov-url]
[![dependencies Status][dependencies-image]][dependencies-url]
[![Gratipay][licensed-image]][licensed-url]


[npm-image]: https://img.shields.io/npm/v/http-services.svg
[npm-url]: https://www.npmjs.org/package/http-services
[downloads-image]: https://img.shields.io/npm/dm/http-services.svg
[downloads-url]: https://npmjs.org/package/http-services
[travis-image]: https://travis-ci.org/thondery/http-services.svg?branch=master
[travis-url]: https://travis-ci.org/thondery/http-services
[codecov-image]: https://img.shields.io/codecov/c/github/thondery/http-services/master.svg
[codecov-url]:   https://codecov.io/github/thondery/http-services?branch=master
[dependencies-image]: https://david-dm.org/thondery/http-services/status.svg
[dependencies-url]: https://david-dm.org/thondery/http-services
[licensed-image]: https://img.shields.io/badge/license-MIT-blue.svg
[licensed-url]: https://github.com/thondery/http-services/blob/master/LICENSE

## Install

```bash
npm install --save http-services
```

## Introduced

```javascript
const httpServices = require('http-services')
```

### SETTING

```javascript
const HttpServices = new httpServices()

// set domain
HttpServices.domain = 'http://localhost:4000'

// set apiPath
HttpServices.apiPath = '/api/v1'

// set statusMessage
HttpServices.statusMessage = 'Request Success!'
```


### GET / POST

```javascript
// Promise/A+

HttpServices.GET('notes/list', { tag: 'javascript' })
  .then( ret => {
    console.log(ret)
  })
  .catch( err => {
    console.log(err)
  })

HttpServices.POST('sign-in', { username: 'admin', password: 'password' })
  .then( ret => {
    console.log(ret)
  })
  .catch( err => {
    console.log(err)
  })

// Async/Await

async () => {
  try {
    let ret = await HttpServices.GET('notes/list', { tag: 'javascript' })
    console.log(ret)
  }
  catch (error) {
    console.log(error)
  }
}

async () => {
  try {
    let ret = await HttpServices.POST('sign-in', { username: 'admin', password: 'password' })
    console.log(ret)
  }
  catch (error) {
    console.log(error)
  }
}
```

### Other Method

```javascript
// createAction

const FETCH_SIGNIN_SUCCESS = 'FETCH_SIGNIN_SUCCESS'
const FETCH_SIGNIN_FAILURE = 'FETCH_SIGNIN_FAILURE'
const Response = {
  data: {
    id: 1,
    username: 'admin'
  },
  status: {
    code: 0,
    message: 'Request Success!'
  }
}
HttpServices.createAction(FETCH_SIGNIN_SUCCESS, Response)
/*
{
  type: 'FETCH_SIGNIN_SUCCESS',
  payload: {
    data: {
      id: 1,
      username: 'admin'
    },
    status: {
      code: 0,
      message: 'Request Success!'
    }
  },
  error: null
}
*/
HttpServices.createAction(FETCH_SIGNIN_FAILURE, Response)
/*
{
  type: 'FETCH_SIGNIN_FAILURE',
  payload: null,
  error: Error
}
*/

// statusToError

const Response = {
  data: null,
  status: {
    code: 1024,
    message: 'Wraning Message!'
  }
}
HttpServices.statusToError(Response, 'loginError')
/*
{
  loginError: {
    code: 1024,
    message: 'Wraning Message!'
  }
}
*/
HttpServices.statusToError(Response, 'loginError', 'loginMessage')
/*
{
  loginError: 1024,
  loginMessage: 'Wraning Message!'
}
*/

// getStatusError

const Error = {
  response: {
    status: 404,
    statusText: 'Not Found',
    ...
  },
  ...
}
HttpServices.getStatusError(Error.response)
/*
{
  code: 404,
  message: 'Not Found'
}
*/
```

## License

this repo is released under the [MIT License](https://github.com/thondery/http-services/blob/master/LICENSE).