// Where Fallback
	
var Intent = require('../../../../src/Intent/intent');
var _ = require('underscore');

function WhereIntent() {
	var methods = {
		name: 'Where Fallback',
		trigger: 'where',
		synonyms: [],
		classifier: 'fallback'
	}
	methods.__proto__ = Intent()

	methods.response = function() {
		var output = 'Could be anywhere. I have no idea';
		return output;
	}

	return methods
}


module.exports = WhereIntent;
