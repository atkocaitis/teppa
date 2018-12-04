# Teppa
SOAP API testing framework

## Introduction

Teppa is simple SOAP API testing framework.

## Creating Tests

Loading SOAP request from external file.

```javascript
const	test = require('teppa'),
		expect = require('chai').expect,
		path = __dirname,
		config = {
			url: 'http://www.dneonline.com/calculator.asmx',
			headers: { 'Content-Type': 'application/soap+xml'}
		};

it("Loading request from file", function() {

	return test
		.loadRequest(path + '/xml/request.xml')
		.post(config)
		.then(function(response) {
			expect(response.body).to.include('<AddResult>2</AddResult>');
		});

});
```

Updating SOAP request after load.

```javascript
it("Updating request after load", function() {

	return test
		.loadRequest(path + '/xml/request.xml')
		.updateRequest('tem:Add',  `<tem:Add><tem:intA>2</tem:intA><tem:intB>2</tem:intB></tem:Add>`)
		.post(config)
		.then(function(response) {
			expect(response.body).to.include('<AddResult>4</AddResult>');
		});

});
```

Loading expected SOAP response for assertion from file.

```javascript
it("Loading expected response from file", function() {

	return test
		.loadRequest(path + '/xml/request.xml')
		.updateRequest('tem:intA', `<tem:intA>2</tem:intA>`)
		.post(config)
		.then(function(response) {
			expect(response.bodyJs).to.deep.equal(test.loadXMLtoJs(path + '/xml/response.xml'));
		});

});
```