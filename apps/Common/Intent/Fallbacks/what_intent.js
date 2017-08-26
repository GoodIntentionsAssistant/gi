// What Fallback
	
var Intent = require('../../../../src/Intent/intent');
var _ = require('underscore');

function WhatIntent() {
	var methods = {
		name: 'What Fallback',
		trigger: 'what',
		synonyms: [],
		classifier: 'fallback'
	}
	methods.__proto__ = Intent()

	methods.response = function(response) {
		if(response.input.text.indexOf('meaning of life') > -1) {
			return '42?';
		}
		var output = 'Not sure, Google might know';
		return output;
	}

	return methods
}


module.exports = WhatIntent;
