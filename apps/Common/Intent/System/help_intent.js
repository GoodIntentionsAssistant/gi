/**
 * Help Intent
 */
var Intent = require('../../../../src/Intent/intent');

module.exports = class HelpIntent extends Intent {

	setup() {
		this.name = 'Help';
		this.trigger = 'help';
	}


	response() {
		return 'I will help you another time';
	}

}

