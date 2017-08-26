// Get Started
	
var Intent = require('../../../../src/Intent/intent');
var _ = require('underscore');
var Promise = require('promise');

function GetStartedIntent() {
	var methods = {
		name: 'Get Started',
		trigger: 'get started',
		classifier: 'strict',
		tests: [
			{ input:'get started' }
		],
		parameters: {
			"choice": {
				name: "Choice",
				data: {
					"yes":{},
					"no":{}
				}
			}
		}
	}
	methods.__proto__ = Intent()

	methods.response = function(request) {
		var output = [
			"Hi! I'm Devi",
			"I'm all about productivity and getting things done!",
			"I can help you keep your office organised and help you with useful business things"
		];
		request.send(output);

		var output = [
			"Do you have an account with Devi already?"
		];
		request.send(output);

		request.attachment.add_action('Yes');
		request.attachment.add_action('No');

		request.expecting.set({
			action: 'have_account',
			force: true
		});

		return true;
	}

	methods.have_account = function(request) {
		var choice = request.param('choice');
		var output = [];

		if(choice == 'yes') {
			output.push('Great! Click the login button');
			request.attachment.add_action('Login');
		}
		else {
			output.push('To get the most out of this chat bot go to http://devi.io in your web browser and sign up your company!');
			output.push('Once you\'re registered click the login again');
			request.attachment.add_action('Login');
			request.attachment.add_action('Not Now');
		}

		return output;
	}

	return methods
}


module.exports = GetStartedIntent;
