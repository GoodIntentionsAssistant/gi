/**
 * What Fallback Intent
 */
var Intent = require('../../../../../src/Intent/intent');

module.exports = class WhatIntent extends Intent {

	setup() {
		this.name = 'What Fallback';
		this.trigger = 'what';
		this.synonyms = [];
		this.classifier = 'fallback';
	}
	

	response(response) {
		if(response.input.text.indexOf('meaning of life') > -1) {
			return '42?';
		}
		var output = 'Not sure, Google might know';
		return output;
	}

}

