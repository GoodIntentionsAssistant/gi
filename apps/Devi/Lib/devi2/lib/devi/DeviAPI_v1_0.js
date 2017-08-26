var http = require('http'),
    request = require('request'),
    helpers = require('./helpers');

/**
 * Devi API wrapper for the API version 1.0. This object should not be
 * instantiated directly but by using the version wrapper {@link DeviAPI}.
 *
 * @param apiKey The API key to access the Devi API with
 * @param options Configuration options
 * @return Instance of {@link DeviAPI_v1_0}
 */
function DeviAPI_v1_0 (subDomain, apiKey, options) {

	if (!options)
		var options = {};

	this.version     = '1';
	this.subDomain   = subDomain;
	this.apiKey      = apiKey;
	this.secure      = options.secure || false;
	this.packageInfo = options.packageInfo;
	this.httpHost    = this.subDomain+'.devi.io';
	this.httpUri     = (this.secure) ? 'https://'+this.httpHost+':443' : 'http://'+this.httpHost+':80';
	this.userAgent   = options.userAgent+' ' || '';

}

module.exports = DeviAPI_v1_0;

/**
 * Sends a given request as a HTTP POST (application/x-www-form-urlencoded) to
 * the Devi API and finally calls the given callback function with the
 * resulting JSON object. This method should not be called directly but will be
 * used internally by all API methods defined.
 *
 * @param method RESTful, POST, GET, DELETE, etc..
 * @param action Devi API action to call
 * @param availableParams Parameters available for the specified API method
 * @param givenParams Parameters to call the Devi API with
 * @param callback Callback function to call on success
 */
DeviAPI_v1_0.prototype.execute = function (method, action, availableParams, givenParams, callback) {

    var finalParams = { };
    var currentParam;

	for (var i = 0; i < availableParams.length; i++) {
		currentParam = availableParams[i];
		if (typeof givenParams[currentParam] !== 'undefined')
			finalParams[currentParam] = givenParams[currentParam];
	}

	request({
		uri : this.httpUri+'/api/v'+this.version+'/'+action,
		method: method,
		headers : {
                'Content-Type' : 'application/json',
                'User-Agent'   : this.userAgent+'node-devi/'+this.packageInfo['version'],
                'X-API-TOKEN'  : this.apiKey
              },
        body : JSON.stringify(finalParams)
	}, function (error, response, body) {
		var parsedResponse;
		if (error) {
			callback(new Error('Unable to connect to the Devi API endpoint.'));
		} else {

			try {
				parsedResponse = JSON.parse(body);
			} catch (error) {
				callback(new Error('Error parsing JSON answer from Devi API.'));
				return;
			}

			if (typeof parsedResponse.status != 'undefined' && parsedResponse.status === 'error') {
				callback(new Error(parsedResponse.message));
				return;
			}

			callback(null, parsedResponse);

		}
	});

}

/**
 * You can either call the API methods directly or using this function which
 * assembles the name of the API method from a given method category and
 * method name. Categories and methods are described in the Mandrill API
 * Documentation.
 *
 * @see http://apidocs.devi.io/
 *
 * @param category The category of the API method to call (e.g. 'users')
 * @param method The method to call in the given category
 * @param params Parameters to pass to the API method
 * @param callback Callback function for returned data or errors
 */

DeviAPI_v1_0.prototype.call = function (category, method, params, callback) {

	if (typeof params == 'function') callback = params, params = {};

	if (typeof category != 'string' || typeof method != 'string') {
		callback(new Error('You have to provide the category and the name of the method to call.'));
		return;
	}

	var methodToCall = category+'_'+method.replace(/\-/g, '_');

	if (typeof this[methodToCall] == 'function') {
		this[methodToCall](params, callback);
	} else {
		callback(new Error('The API method '+methodToCall+' does not exist.'));
		return;
	}

}



/*****************************************************************************/
/******************************* Employee Calls ******************************/
/*****************************************************************************/

/**
 * Create session
 *
 * @see http://apidocs.devi.io/index/sessions.html
 */
DeviAPI_v1_0.prototype.user_sign_in = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('POST', 'users/sign_in', ['email','password'], params, callback);
}


/**
 * Delete session
 *
 * @see http://apidocs.devi.io/index/sessions/destroy.html
 */
DeviAPI_v1_0.prototype.user_sign_out = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('DELETE', 'users/sign_out', [], params, callback);
}


/**
 * Display your account
 *
 * @see http://apidocs.devi.io/index/account/show.html
 */
DeviAPI_v1_0.prototype.account_info = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('GET', 'account', [
	], params, callback);
}


/**
 * List of employees
 *
 * @see http://apidocs.devi.io/index/employees.html#description-index
 */
DeviAPI_v1_0.prototype.employees_list = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('GET', 'employees', [
	], params, callback);
}


/**
 * List of employees
 *
 * @see http://apidocs.devi.io/index/employees.html#description-index
 */
DeviAPI_v1_0.prototype.request_create = function (params, callback) {
	if (typeof params == 'function') callback = params, params = {};
	this.execute('POST', 'requests', ['description'], params, callback);
}