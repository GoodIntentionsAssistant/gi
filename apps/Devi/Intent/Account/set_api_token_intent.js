// Set Api Token
	
var Intent = require('../../../../src/Intent/intent');
var DeviApi = require('../../api');
var Promise = require('promise');

function SetApiTokenIntent() {
	var methods = {
		name: 'SetApiToken',
		trigger: 'set api token',
		synonyms: ['api token','token'],
		parameters: {
			"token": {
				name: "Api Token",
				entity: "Devi/ApiToken",
				required: true
			}
		}
	}
	methods.__proto__ = Intent()

	methods.response = function(request) {
		var that = this;

		//Incoming param has token
		var token = request.param('token');
		var api = new DeviApi;

		return new Promise(function(resolve, reject) {
			var promise = api.call(request.session, 'account', 'info', {}, {
				api_token: token
			});

			promise.then(function(data) {
				if(data.account) {
					request.session.set_auth('devi',{
						api_token: token,
						data: data.account
					});
					resolve('Hey '+data.account.first_name+'! You are now ready to use Devi');
				}
				else {
					request.session.set('api_token',false);
					resolve('The API token is not valid');
				}
			});
		});

	}

	return methods
}


module.exports = SetApiTokenIntent;
