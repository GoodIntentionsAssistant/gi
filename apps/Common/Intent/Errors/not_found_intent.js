// not_found.js
	
var Intent = require('../../../../src/Intent/intent');
var _ = require('underscore');

function NotFoundIntent() {
	var methods = {
		name: 'NotFound'
	}
	methods.__proto__ = Intent()

	methods.response = function() {
		var responses = [
			"Sorry, I don't understand what you mean",
			"I'm sorry. I'm having trouble understanding what you mean",
			"I'm a bit confused what you mean",
			"I'm not totally sure about that.",
			"I'm afraid I don't understand.",
			"I'm a bit confused"
		];
		
		return _.sample(responses);
	}

	return methods
}


module.exports = NotFoundIntent;
