/**
 * No Auth Intent
 */
const Intent = require('../../../../src/Intent/intent');

module.exports = class NoAuthIntent extends Intent {

	setup() {
	}

	response () {
		var output = [
			"You need to be logged in to do that command"
		];
		return output;
	}

}