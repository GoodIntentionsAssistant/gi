/**
 * Not Found Intent
 */
const Intent = require('../../../../src/Intent/intent');
var _ = require('underscore');

module.exports = class NotFoundIntent extends Intent {

	setup() {
	}
	

	response() {
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

}
