/**
 * Again Intent
 */
const Intent = require('../../../../src/Intent/intent');

module.exports = class AgainIntent extends Intent {

	setup() {
		this.name = 'Again';
		this.train([
			'again',
			'again!',
			'again?',
			'repeat',
			'once more',
			'come again',
			'encore',
			'more',
			'another'
		], {
			collection: 'strict'
		});
	}
	

	response(request) {
		var history = request.session.history();

		//Remove again
		history.pop();

		var last = history[history.length-1].text;
		request.input.text = last;

		request._process();
		return false;
	}

}

