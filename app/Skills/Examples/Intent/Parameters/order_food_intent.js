/**
 * Order Food Example
 */
var Intent = require('../../../../../src/Intent/intent');

module.exports = class OrderFoodIntent extends Intent {

	setup() {
		this.name = 'Order Food';
		this.trigger = 'order';

		this.synonyms = [
			'order food'
		];

		this.entities = {};
	}


	response(request) {
		request.session.set_expecting({
			intent: this,
			entity: 'Common/Confirm',
			action: {
				'yes': 'yup',
				'no': 'nope'
			},
			force: true
		});
		request.attachment.add_action('Yes');
		request.attachment.add_action('No');
		return 'Order for here?';
	}
	

	yup(request) {
		return 'It is for here';
	}
	

	nope(request) {
		return 'Take away!';
	}

}

