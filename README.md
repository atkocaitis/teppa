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
    "teppa": "^1.2.0"
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

First you need to load teppa and set some test configuration. Example of online Soap API calculator:

```javascript
const	test = require('teppa');

test.setGlobalSetup({
	url: 'http://www.dneonline.com/calculator.asmx',
	headers: { 'Content-Type': 'application/soap+xml'},
	requestPath: './examples/xml/request/',
	responsePath: './examples/xml/response/'
});
```

In first test step you need to load request xml file (file path is set in GlobalSetup). This file will be used as body for your Post request. After loading request you need to initiate post function and add response assertion (by default Teppa includes Chai assertion library):

```javascript
it("Loading request from file", function() {

	return test
		.loadRequest('calculatorRequest.xml')
		.post()
		.then(function(response) {
			test.expect(response.body).to.include('<AddResult>2</AddResult>');
		});

});
```

After you have load request xml file you can update part of request using updateRequest function:

```javascript
it("Updating request after load", function() {

	return test
		.updateRequest('tem:Add',  `<tem:Add>
										<tem:intA>2</tem:intA>
										<tem:intB>2</tem:intB>
									</tem:Add>`)
		.post()
		.then(function(response) {
			test.expect(response.body).to.include('<AddResult>4</AddResult>');
		});

});
```

To use external xml file for response assertion you can use loadResponseToJs function which will load response xml file and it will convert it to javascript object for better comparison (to get actual response body as javascript object use response.bodyJs):

```javascript
it("Loading expected response from file", function() {

	return test
		.updateRequest('tem:intA', `<tem:intA>1</tem:intA>`)
		.post()
		.then(function(response) {
			test.expect(response.bodyJs).to.deep.equal(test.loadResponseToJs('calculatorResponse.xml'));
		});

});
```