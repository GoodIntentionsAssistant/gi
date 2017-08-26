// Login
	
var Intent = require('../../../../src/Intent/intent');
var DeviApi = require('../../api');
var Promise = require('promise');

function LogoutIntent() {
	var methods = {
		name: 'Logout',
		trigger: 'logout',
		synonyms: ['signout']
	}
	methods.__proto__ = Intent()


	methods.response = function(request) {
		var that = this;
		var api = new DeviApi();

		return new Promise(function(resolve, reject) {
			var promise = api.call(request.session, 'user', 'sign_out', {}, {
				sub_domain: 'app'
			});
			promise.then(function(data) {
				request.session.remove_auth('devi');
				resolve("You're now logged out of Devi on this device");
			});
		});
	}

	return methods
}


module.exports = LogoutIntent;
