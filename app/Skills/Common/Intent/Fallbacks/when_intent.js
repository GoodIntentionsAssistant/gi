/**
 * When Fallback Intent
 */
var Intent = require('../../../../../src/Intent/intent');

module.exports = class WhenIntent extends Intent {

	setup() {
		this.name = 'When Fallback';
		this.trigger = 'when';
		this.synonyms = [];
		this.classifier = 'fallback';
	}
	

	response() {
		var output = 'I am not sure when';
		return output;
	}

}

