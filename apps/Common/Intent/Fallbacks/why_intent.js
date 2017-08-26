// Why Fallback
	
var Intent = require('../../../../src/Intent/intent');
var _ = require('underscore');

function WhyIntent() {
	var methods = {
		name: 'Why Fallback',
		trigger: 'why',
		synonyms: [],
		classifier: 'fallback'
	}
	methods.__proto__ = Intent()

	methods.response = function() {
		var output = 'Everyone asks why';
		return output;
	}

	return methods
}


module.exports = WhyIntent;
