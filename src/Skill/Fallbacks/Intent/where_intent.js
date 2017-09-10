/**
 * Where Fallback Intent
 */
var Intent = require('../../../../../src/Intent/intent');

module.exports = class WhereIntent extends Intent {

	setup() {
		this.name = 'Where Fallback';
		this.trigger = 'where';
		this.synonyms = [];
		this.classifier = 'fallback';
	}
	

	response() {
		var output = 'Could be anywhere. I have no idea';
		return output;
	}

}

