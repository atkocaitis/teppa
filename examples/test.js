const	test = require('../lib/teppa.js'),
		expect = require('chai').expect,
		path = __dirname,
		config = {
			url: 'http://www.dneonline.com/calculator.asmx',
			headers: { 'Content-Type': 'application/soap+xml'}
		};

describe("Calculator tests examples", function() {

	it("Loading request from file", function() {

		return test
			.loadRequest(path + '/xml/request.xml')
			.post(config)
			.then(function(response) {
				expect(response.body).to.include('<AddResult>2</AddResult>');
			});

	});

	it("Updating request after load", function() {

		return test
			.loadRequest(path + '/xml/request.xml')
			.updateRequest('tem:Add',  `<tem:Add>
											<tem:intA>2</tem:intA>
											<tem:intB>2</tem:intB>
										</tem:Add>`)
			.post(config)
			.then(function(response) {
				expect(response.body).to.include('<AddResult>4</AddResult>');
			});

	});

	it("Loading expected response from file", function() {

		return test
			.loadRequest(path + '/xml/request.xml')
			.updateRequest('tem:intA', `<tem:intA>2</tem:intA>`)
			.post(config)
			.then(function(response) {
				expect(response.bodyJs).to.deep.equal(test.loadXMLtoJs(path + '/xml/response.xml'));
			});

	});
	
});