// Order food
	
var Intent = require('../../../../src/Intent/intent');

function OrderFoodIntent() {
	var methods = {
		name: 'OrderFood',
		trigger: 'order',
		synonyms: [
			'order food'
		],
		entities: {
		}
	}
	methods.__proto__ = Intent()


	methods.response = function(request) {
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
	

	methods.yup = function(request) {
		return 'It is for here';
	}
	

	methods.nope = function(request) {
		return 'Take away!';
	}

	return methods
}


module.exports = OrderFoodIntent;
