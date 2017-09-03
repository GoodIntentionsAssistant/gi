// Joke
	
var Intent = require('../../../../src/Intent/intent');
var Promise = require('promise');
var _ = require('underscore');

module.exports = class JokeIntent extends Intent {

	setup() {
		this.name = 'Catfacts';
		this.trigger = 'tell me a joke';
		this.synonyms = [];
		this.tests = [
			{ input:'tell me a joke' }
		];
	}

	response(request) {
		return "I'll be able to tell you a joke when I know some!";
	}

}

