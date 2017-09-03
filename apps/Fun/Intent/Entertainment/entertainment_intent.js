// Entertain me
	
var Intent = require('../../../../src/Intent/intent');
var Promise = require('promise');
var _ = require('underscore');

module.exports = class EntertainmentIntent extends Intent {

	setup() {
		this.name = 'Entertainment';
		this.trigger = 'entertain me';
		this.synonyms = [];
		this.tests = [
			{ input:'entertain me' }
		];
	}

	response(request) {
		var choices = ["Fun/Joke","Fun/Catfacts"];
		var intent = _.sample(choices);

		return request.redirect(intent);
	}

}

