// No auth
	
var Intent = require('../../../../src/Intent/intent');
var _ = require('underscore');

function NoAuthIntent() {
	var methods = {
		name: 'NoAuth'
	}
	methods.__proto__ = Intent()

	methods.response = function() {
		var output = [
			"You need to be logged in to do that command"
		];
		return output;
	}

	return methods
}


module.exports = NoAuthIntent;
