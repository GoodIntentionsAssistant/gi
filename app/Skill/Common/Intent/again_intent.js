/**
 * Again Intent
 */
const Intent = require('../../../../src/Intent/intent');

module.exports = class AgainIntent extends Intent {

	setup() {
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
		let history = request.history.last();
		request.process_message(history.text);
		return false;
	}

}

