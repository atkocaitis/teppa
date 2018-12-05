const	xml2js = require('xml2js'),
		axios = require('axios'),
		expect = require('chai').expect,
		fs = require('fs');

/**
 * This function loads xml request file
 * @param {string} file Full file path with name
 * @returns {object} This instance for chaining
 */
function loadRequest(file) {
	this.request = fs.readFileSync(file, "utf8");

	return this;
};

/**
 * This function updates request which is already loaded 
 * @param {string} node XML node name to replace
 * @param {string} replace New XML node
 * @returns {object} This instance for chaining
 */
function updateRequest(node, replace) {
	let obj = convertToJs(this.request),
		newObj = convertToJs(replace);
	
	this.request = convertToXml(updateObjects(obj, node, newObj));

	return this;
};

/**
 * This function updates JavaScript object child
 * @param {object} obj JavaScript object to update
 * @param {string} key Object child key name
 * @param {object} newObj New child object
 * @returns {object} Updated JavaScript object
 */
function updateObjects(obj, key, newObj) {
	let objects = [];

	for (let i in obj) {
		if (i == key) {
			obj[key] = newObj[key];
			break;
		} else if (typeof obj[i] == 'object') {
			objects = objects.concat(updateObjects(obj[i], key, newObj));
		};
	};

	return obj;
};

/**
 * This function loads xml file and converts it to JavaScript object 
 * @param {string} file Full file path with name
 * @returns {object} JavaScript object
 */
function loadXMLtoJs(file) {
	return convertToJs(fs.readFileSync(file, "utf8"));
};

/**
 * This function converts JavaScript object to XML 
 * @param {object} jsObj JavaScript object
 * @returns {string} XML content
 */
function convertToXml(jsObj) {
	return new xml2js.Builder({headless: true}).buildObject(jsObj);
};

/**
 * This function converts XML to JavaScript object
 * @param {string} xml XML content
 * @returns {object} JavaScript object
 */
function convertToJs(xml) {
	let jsObj;

	xml2js.parseString(xml, (err, result) => { 
		jsObj = result;
	});

	return jsObj;
};

/**
 * This function converts XML to JavaScript object
 * @param {object} config Request configuration {url: '',headers: {}}
 * @returns {promise} Promise resolve with response body and status code or reject with error
 */
function post(config) {
	return new Promise((resolve, reject) => {
		axios({
			method: 'post',
			url: config.url,
			headers: config.headers,
			data: this.request,
			timeout: 60000,
		}).then((response) => {
			resolve({
				body: response.data,
				bodyJs: convertToJs(response.data),
				statusCode: response.status,
			});
		}).catch((error) => {
			if (error.response) {
				resolve({
					body: error.response.data,
					statusCode: error.response.status,
				});
			} else {
				reject(error);
			};
		});
	});
};

module.exports = {
	post: post,
	loadRequest: loadRequest,
	updateRequest: updateRequest,
	loadXMLtoJs: loadXMLtoJs,
	expect: expect
};