// Request create
	
var Intent = require('../../../../src/Intent/intent');
var DeviApi = require('../../api');
var Promise = require('promise');
var _ = require('underscore');

function RequestCreateIntent() {
	var methods = {
		name: 'Request Create',
		trigger: 'request',
		auth: 'devi'
	}
	methods.__proto__ = Intent()

	methods.response = function(request) {
		request.send('Type in your request');
		request.expecting.set({
			action: 'submit',
			force: true
		});
		return;
	}

	methods.submit = function(request) {
		var that = this;
		var api = new DeviApi;

		return new Promise(function(resolve, reject) {
			var promise = api.call(request.session, 'request', 'create', {
				description: "Test!"
			});

			promise.then(function(data) {
				var output = [];

				output.push('Thanks! Your request has been sent');
				resolve(output);
			});
		});
	}

	return methods
}


module.exports = RequestCreateIntent;
