// Entertain me
	
var Intent = require('../../../../src/Intent/intent');
var Promise = require('promise');
var _ = require('underscore');

function EntertainmentIntent() {
	var methods = {
		name: 'Entertainment',
		trigger: 'entertain me',
		synonyms: [],
		tests: [
			{ input:'entertain me' }
		]
	}
	methods.__proto__ = Intent()

	methods.response = function(request) {
		var choices = ["Fun/Joke","Fun/Catfacts"];
		var intent = _.sample(choices);

		return request.redirect(intent);
	}

	return methods
}


module.exports = EntertainmentIntent;
