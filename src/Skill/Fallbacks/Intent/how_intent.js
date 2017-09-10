/**
 * How Fallback Intent
 */
var Intent = require('../../../../../src/Intent/intent');

module.exports = class HowIntent extends Intent {

	setup() {
		this.name = 'How Fallback';
		this.trigger = 'how';
		this.synonyms = [];
		this.classifier = 'fallback';
	}
	

	response() {
		var output = 'How does anything happen?';
		return output;
	}

}


