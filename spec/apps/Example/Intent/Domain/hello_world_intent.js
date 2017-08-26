// Hello World

var Intent = require('../../../../../src/Intent/intent');

function HelloWorldIntent() {
	var methods = {
		name: 'Hello',
		trigger: 'hello',
		synonyms: ["hey","yo","what's up?","sup","hullo"]
	}
	methods.__proto__ = Intent()

	methods.response = function(request) {
		var output = [
			'Yo!'
		];
		return output;
	}

	return methods
}


module.exports = HelloWorldIntent;
