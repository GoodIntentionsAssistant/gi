/**
 * What Fallback Intent
 */
const Intent = require('../../../../src/Intent/intent');

module.exports = class WhatIntent extends Intent {

	setup() {
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

