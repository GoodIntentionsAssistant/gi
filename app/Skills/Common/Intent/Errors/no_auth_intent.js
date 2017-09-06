/**
 * No Auth Intent
 */
var Intent = require('../../../../../src/Intent/intent');

module.exports = class NoAuthIntent extends Intent {

	setup() {
		this.name = 'No Authorization';
	}


	response () {
		var output = [
			"You need to be logged in to do that command"
		];
		return output;
	}

}
