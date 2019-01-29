# Teppa
SOAP API test automation framework

[![NPM](https://nodei.co/npm/teppa.png)](https://nodei.co/npm/teppa/)

## Introduction

Teppa is simple SOAP API testing framework build using mocha

## Installation

Get Teppa framework as dependency to your project

    npm i teppa -D

Add mocha to scripts as test to package.json

```javascript
{
  "name": "my-awesome-package",
  "version": "1.0.0",
  "scripts": {
    "test": "mocha"
  },
  "devDependencies": {
    "teppa": "^1.3.0"
  }
}
```

## Running

To run test use

    npm test

To run specific test file you can use

    npm test test.js

For more configuration options use https://mochajs.org

Tip: to avoid timeout issue increase default mocha timeout: "test": "mocha --timeout 60000"

## Creating Tests

(All examples can be found in https://github.com/atkocaitis/teppa/tree/master/examples)

First you need to load teppa, assertion library (like chai) and set some test configuration. Example of online Soap API calculator:

```javascript
const   teppa = require('../lib/teppa.js'),
        expect = require('chai').expect;

global.config = {
    url: 'http://www.dneonline.com/calculator.asmx',
    headers: { 'Content-Type': 'application/soap+xml'},
    requestPath: './examples/xml/request/',
    responsePath: './examples/xml/response/',
    log: false
};
```

First you need to create new test instance for each method. Test instance will automatically load method request and expected response from requestPath, responsePath. After creating test instance you can use post() method to make a call and check response:

```javascript
var test = new teppa('calculator');

it("Loading request from file", function() {

    return test
        .post()
        .then(function(response) {
            expect(response.body).to.include('<AddResult>2</AddResult>');
        });
});
```

If you need to change default request you can use updateRequest() to do that:

```javascript
it("Updating request after load", function() {

    return test
        .updateRequest('tem:Add',  `<tem:Add>
                                        <tem:intA>2</tem:intA>
                                        <tem:intB>2</tem:intB>
                                    </tem:Add>`)
        .post()
        .then(function(response) {
            expect(response.body).to.include('<AddResult>4</AddResult>');
        });

});
```

To make assertion using expected response you can use actual (response.bodyJs) and expected (test.response) response which will be converted from xml to javascript object for better comparison in javascript:

```javascript
it("Loading expected response from file", function() {

    return test
        .updateRequest('tem:intA', `<tem:intA>1</tem:intA>`)
        .post()
        .then(function(response) {
            expect(response.bodyJs).to.deep.equal(test.response);
        });

});
```