// How Fallback
	
var Intent = require('../../../../src/Intent/intent');
var _ = require('underscore');

function HowIntent() {
	var methods = {
		name: 'How Fallback',
		trigger: 'how',
		synonyms: [],
		classifier: 'fallback'
	}
	methods.__proto__ = Intent()

	methods.response = function() {
		var output = 'How does anything happen?';
		return output;
	}

	return methods
}


module.exports = HowIntent;
