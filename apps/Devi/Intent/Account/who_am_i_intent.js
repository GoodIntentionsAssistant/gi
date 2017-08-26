// Who Am I
	
var Intent = require('../../../../src/Intent/intent');
var DeviApi = require('../../api');
var Promise = require('promise');
var _ = require('underscore');

function WhoAmIIntent() {
	var methods = {
		name: 'Who Am I',
		trigger: 'whoami',
		synonyms: [],
		auth: 'devi'
	}
	methods.__proto__ = Intent()

	methods.response = function(request) {
		var that = this;
		var api = new DeviApi;

		return new Promise(function(resolve, reject) {
			var promise = api.call(request.session, 'account', 'info');
			promise.then(function(data) {
				resolve(['You are '+data.account.full_name]); 
			});
		});
	}

	return methods
}


module.exports = WhoAmIIntent;
