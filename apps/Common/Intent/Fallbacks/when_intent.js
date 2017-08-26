// When Fallback
	
var Intent = require('../../../../src/Intent/intent');
var _ = require('underscore');

function WhenIntent() {
	var methods = {
		name: 'When Fallback',
		trigger: 'when',
		synonyms: [],
		classifier: 'fallback'
	}
	methods.__proto__ = Intent()

	methods.response = function() {
		var output = 'I am not sure when';
		return output;
	}

	return methods
}


module.exports = WhenIntent;
