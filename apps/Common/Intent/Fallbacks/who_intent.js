/**
 * Who Fallback Intent
 */
var Intent = require('../../../../src/Intent/intent');

module.exports = class WhoIntent extends Intent {

	setup() {
		this.name = 'Who Fallback';
		this.trigger = 'who is in the house?';
		this.synonyms = [];
		this.classifier = 'fallback';
	}
	

	response() {
		var output = 'No idea!';
		return output;
	}

}
