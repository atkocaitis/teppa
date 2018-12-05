# Teppa
SOAP API test automation framework

[![NPM](https://nodei.co/npm/teppa.png)](https://nodei.co/npm/teppa/)

## Introduction

Teppa is simple SOAP API testing framework build using mocha and chai

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
    "teppa": "^1.0.0"
  }
}
```

## Running

To run test use

    npm test

To run specific test file you can use

    npm test your_test.js

For more configuration options use https://mochajs.org

Tip: to avoid timeout issue increase default mocha timeout: "test": "mocha --timeout 60000"

## Creating Tests

(All examples can be found in https://github.com/atkocaitis/teppa/tree/master/examples)

Loading SOAP request from external file

```javascript
const	test = require('teppa'),
		config = {
			url: 'http://www.dneonline.com/calculator.asmx',
			headers: { 'Content-Type': 'application/soap+xml'}
		};

it("Loading request from file", function() {

	return test
		.loadRequest('./examples/xml/request.xml')
		.post(config)
		.then(function(response) {
			test.expect(response.body).to.include('<AddResult>2</AddResult>');
		});

});
```

Updating SOAP request after load

```javascript
it("Updating request after load", function() {

	return test
		.loadRequest('./examples/xml/request.xml')
		.updateRequest('tem:Add',  `<tem:Add><tem:intA>2</tem:intA><tem:intB>2</tem:intB></tem:Add>`)
		.post(config)
		.then(function(response) {
			test.expect(response.body).to.include('<AddResult>4</AddResult>');
		});

});
```

Loading expected SOAP response for assertion from file

```javascript
it("Loading expected response from file", function() {

	return test
		.loadRequest('./examples/xml/request.xml')
		.updateRequest('tem:intA', `<tem:intA>2</tem:intA>`)
		.post(config)
		.then(function(response) {
			test.expect(response.bodyJs).to.deep.equal(test.loadXMLtoJs('./examples/xml/response.xml'));
		});

});
```