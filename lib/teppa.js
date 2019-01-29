const   xml2js = require('xml2js'),
        _ = require('lodash'),
        axios = require('axios'),
        fs = require('fs');

/**
 * New test instance
 * @param {string} method API method name
 * @returns {object} This instance for chaining
 */
function Test(method) {
    this.name = method;
    this.globalSetup = _.merge(this, global.config)
    this.request = loadRequest(this);
    this.response = loadResponseToJs(this);

    return this;
};

/**
 * Overwrite global setup cofiguration
 * @param {object} opts Custom configuration
 * @returns {object} This instance for chaining
 */
Test.prototype.setup = function(opts) {
    this.globalSetup = _.merge(this.globalSetup, opts);

    return this;
};

/**
 * This function loads xml request file
 * @param {string} file Full file path with name
 * @returns {string} Request file content
 */
function loadRequest(test) {
    return fs.readFileSync(test.requestPath + test.name + '.xml', "utf8");
};

/**
 * This function updates request which is already loaded 
 * @param {string} node XML node name to replace
 * @param {string} replace New XML node
 * @returns {object} This instance for chaining
 */
Test.prototype.updateRequest = function(node, replace) {
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
 * This function loads response xml file and converts it to JavaScript object 
 * @param {string} file Full file path with name
 * @returns {object} JavaScript object
 */
function loadResponseToJs(test) {
    return convertToJs(fs.readFileSync(test.responsePath + test.name + '.xml', "utf8"));
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
 * @returns {promise} Promise resolve with response body and status code or reject with error
 */
Test.prototype.post = function() {
    return new Promise((resolve, reject) => {
        if (this.globalSetup.log) console.log('Request:',this.request);
        axios({
            method: 'post',
            url: this.globalSetup.url,
            headers: this.globalSetup.headers,
            data: this.request,
            timeout: 60000,
        }).then((response) => {
            if (this.globalSetup.log) console.log('Response:',response.data);
            resolve({
                body: response.data,
                bodyJs: convertToJs(response.data),
                statusCode: response.status,
            });
        }).catch((error) => {
            if (this.globalSetup.log) console.log('Response:',error.response.data);
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

module.exports = Test;