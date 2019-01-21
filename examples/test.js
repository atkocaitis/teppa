const	test = require('../lib/teppa.js');

test.setGlobalSetup({
	url: 'http://www.dneonline.com/calculator.asmx',
	headers: { 'Content-Type': 'application/soap+xml'},
	requestPath: './examples/xml/request/',
	responsePath: './examples/xml/response/'
});

describe("Calculator tests examples", function() {

	it("Loading request from file", function() {

		return test
			.loadRequest('calculatorRequest.xml')
			.post()
			.then(function(response) {
				test.expect(response.body).to.include('<AddResult>2</AddResult>');
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
				test.expect(response.body).to.include('<AddResult>4</AddResult>');
			});

	});

	it("Loading expected response from file", function() {

		return test
			.updateRequest('tem:intA', `<tem:intA>1</tem:intA>`)
			.post()
			.then(function(response) {
				test.expect(response.bodyJs).to.deep.equal(test.loadResponseToJs('calculatorResponse.xml'));
			});

	});
	
});