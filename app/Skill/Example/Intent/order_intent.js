/**
 * Order Example
 */
const Intent = require('../../../../src/Intent/intent');

module.exports = class OrderIntent extends Intent {

	setup() {
		this.train([
			'order',
			'order food'
		]);

		this.parameter('choice', {
			name: "Choice",
			data: {
				"pizza": {},
				"burger": {},
				"fries": {}
			}
		});
	}

	response(request) {
		let choice = request.parameters.value('choice');

		if(choice) {
			return 'You chose '+choice;
		}
		else {
			return 'Pizza, burger or fries?';
		}
	}

}

