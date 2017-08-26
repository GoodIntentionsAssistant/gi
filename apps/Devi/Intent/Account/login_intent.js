// Login
	
var Intent = require('../../../../src/Intent/intent');
var DeviApi = require('../../api');
var Promise = require('promise');
var GoogleUrl = require('google-url');

function LoginIntent() {
	var methods = {
		name: 'Login',
		trigger: 'login',
		synonyms: ['signin','ready'],
		parameters: {
			"ready": {
				name: "Ready",
				data: {
					"ready":{}
				},
				action: 'ready'
			}
		}
	}
	methods.__proto__ = Intent()

	methods.response = function(request) {
		var length = 32;
		var token = Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
		var url = 'https://app.devi.io/manage/tokens/create_from_param?token='+token;
		request.session.user('token_create',token);

		return new Promise(function(resolve, reject) {

			googleUrl = new GoogleUrl({ key: 'AIzaSyCpeWCz6WV7eyUvjWWsSepIug7AgeocQGA' });
			googleUrl.shorten(url, function( err, shortUrl ) {
				//Probably an error so use the original horrible url
				if(!shortUrl) {
					shortUrl = url;
				}

			  var output = []
				output.push('To login click the link below');
				output.push(shortUrl);
				request.attachment.add_action('Ready');
				request.attachment.add_link(shortUrl,'Login');
				resolve(output);
			});

		});
	}


	methods.ready = function(request) {
		var that = this;

		//Incoming param has token
		var token = request.session.user('token_create');
		var api = new DeviApi;


		return new Promise(function(resolve, reject) {
			var promise = api.call(request.session, 'account', 'info', {}, {
				api_token: token
			});

			promise.then(function(data) {
				if(data && data.account) {
					request.session.set_auth('devi',{
						api_token: token,
						data: data.account
					});
					resolve('Hey '+data.account.first_name+'! You are now ready to use Devi');
				}
				else {
					request.session.user('token_create','');
					request.attachment.add_action('Login');
					resolve('Sorry, I could not log you in. Type login to try again.');
				}
			});
		});
	}

/*
	methods.response = function(request) {
		var output = {
			messages: [ 'Enter your email address' ]
		};
		request.expecting.set({
			intent: this,
			action: 'email',
			force: true
		});
		return output;
	}

	methods.email = function(request) {
		request.session.set('email',request.input.text);

		var output = {
			messages: [ 'Now enter your password' ]
		};
		request.expecting.set({
			intent: this,
			action: 'password',
			force: true
		});
		return output;
	}

	methods.password = function(request) {
		var email = request.session.data('email');
		var password = request.input.text;
		var that = this;
		var api = new DeviApi;

		return new Promise(function(resolve, reject) {
			var promise = api.call(request.session, 'user', 'sign_in', {
				'email': email,
				'password': password
			}, {
				sub_domain: 'app'			//Force to use app. instead of company slug
			});
			promise.then(function(data) {
				if(data.success) {
					request.session.set_auth('devi',{
						api_token: data.auth_token
					});
					resolve('You are now ready to use Devi!');
				}
				else {
					var message = data.message;
					if(!message) {
						message = 'Invalid username or password';
					}
					resolve(message);
				}

			});
		});

	}*/

	return methods
}


module.exports = LoginIntent;
