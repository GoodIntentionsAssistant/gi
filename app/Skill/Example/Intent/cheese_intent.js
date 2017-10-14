/**
 * Cheese Example
 */
const Intent = require('../../../../src/Intent/intent');

module.exports = class CheeseIntent extends Intent {

	setup() {
		this.name = 'Cheese';
		this.train(['cheese']);
	}

	response(request) {
    request.attachment.add_action('Yes');
    request.attachment.add_action('No');
		return 'Do you like cheese?';
	}

	answered(request) {
		let choice = request.parameters.value('choice');
		return choice == 'yes' ? 'Sweet tooth' : 'Health option';
	}

}

