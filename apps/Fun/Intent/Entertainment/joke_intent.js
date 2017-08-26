// Joke
	
var Intent = require('../../../../src/Intent/intent');
var Promise = require('promise');
var _ = require('underscore');

function JokeIntent() {
	var methods = {
		name: 'Catfacts',
		trigger: 'tell me a joke',
		synonyms: [],
		tests: [
			{ input:'tell me a joke' }
		]
	}
	methods.__proto__ = Intent()

	methods.response = function(request) {
		return "I'll be able to tell you a joke when I know some!";
	}

	return methods
}


module.exports = JokeIntent;
