// Who Fallback
	
var Intent = require('../../../../src/Intent/intent');
var _ = require('underscore');

function WhoIntent() {
	var methods = {
		name: 'Who Fallback',
		trigger: 'who is in the house?',
		synonyms: ['?','house','who is in the house?'],
		classifier: 'fallback'
	}
	methods.__proto__ = Intent()

	methods.response = function() {
		var output = 'No idea!';
		return output;
	}

	return methods
}


module.exports = WhoIntent;
