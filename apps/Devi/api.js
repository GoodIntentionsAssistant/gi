/**
 * API
 */

var Promise = require('promise');
var extend = require('extend');

var Api = function() {
}


/**
 * Initialize
 *
 */
Api.prototype.initialize = function() {
}


/**
 * Call API
 *
 * @param object session
 * @param string controller
 * @param string method
 * @return object Promise
 */
Api.prototype.call = function(session, controller, method, data, options) {

	return new Promise(function(resolve, reject) {
		_options = {
			sub_domain: session.data('sub_domain'),
			api_token: session.auth('devi','api_token'),
			secure: true
		};
		options = extend(_options, options);

		//For now we're forcing the sub domain to app
		options.sub_domain = 'app';
		var DeviAPI = require('./Lib/devi2').DeviAPI;
		var devi = new DeviAPI(options.sub_domain, options.api_token, { version : '1.0', secure: options.secure });

		devi.call(controller, method, data, function (error, data) {
	    resolve(data); 
		});
	});
	
}


module.exports = Api;


