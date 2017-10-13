/**
 * Order Example
 */
const Intent = require('../../../../src/Intent/intent');

module.exports = class Order1Intent extends Intent {

	setup() {
		this.name = 'Order Food';

		this.train([
			'order',
			'order food'
		]);

		this.add_parameter('choice', {
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

