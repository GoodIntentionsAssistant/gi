/**
 * What Fallback Intent
 */
var Intent = require('../../../Intent/intent');

module.exports = class WhatIntent extends Intent {

	setup() {
		this.name = 'What Fallback';
		this.train(['what'], {
			classifier: 'fallback'
		});
	}
	

	response(response) {
		if(response.input.text.indexOf('meaning of life') > -1) {
			return '42?';
		}
		return 'Not sure, Google might know';
	}

}

