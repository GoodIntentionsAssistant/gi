/**
 * Why Fallback Intent
 */
var Intent = require('../../../../../src/Intent/intent');

module.exports = class WhyIntent extends Intent {

	setup() {
		this.name = 'Why Fallback';
		this.trigger = 'why';
		this.synonyms = [];
		this.classifier = 'fallback';
	}
	

	response() {
		var output = 'Everyone asks why';
		return output;
	}

}

