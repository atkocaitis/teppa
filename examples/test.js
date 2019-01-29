const	teppa = require('../lib/teppa.js'),
		expect = require('chai').expect;

global.config = {
	url: 'http://www.dneonline.com/calculator.asmx',
	headers: { 'Content-Type': 'application/soap+xml'},
	requestPath: './examples/xml/request/',
	responsePath: './examples/xml/response/',
	log: false
};

describe("Calculator tests examples", function() {

	var test = new teppa('calculator');

	it("Loading request from file", function() {

		return test
			.post()
			.then(function(response) {
				expect(response.body).to.include('<AddResult>2</AddResult>');
			});
	});

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

	it("Loading expected response from file", function() {

		return test
			.updateRequest('tem:intA', `<tem:intA>1</tem:intA>`)
			.post()
			.then(function(response) {
				expect(response.bodyJs).to.deep.equal(test.response);
			});
	});
});