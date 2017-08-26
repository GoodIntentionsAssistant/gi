// Again
	
var Intent = require('../../../../src/Intent/intent');

function AgainIntent() {
	var methods = {
		name: 'Again',
		trigger: 'again',
		classifer: 'strict',
		synonyms: ['again!','again?','repeat','once more','come again','encore','more'],
	}
	methods.__proto__ = Intent()

	methods.response = function(request) {
		var history = request.session.history();

		//Remove again
		history.pop();

		var last = history[history.length-1].text;
		request.input.text = last;

		request._process();
		return false;
	}

	return methods
}

module.exports = AgainIntent;
