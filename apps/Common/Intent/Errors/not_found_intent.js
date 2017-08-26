// not_found.js
	
var Intent = require('../../../../src/Intent/intent');
var _ = require('underscore');

function NotFoundIntent() {
	var methods = {
		name: 'NotFound'
	}
	methods.__proto__ = Intent()

	methods.response = function() {
		var output = [
			"Sorry, I don't understand what you mean"
		];
		return output;
	}

	return methods
}


module.exports = NotFoundIntent;
