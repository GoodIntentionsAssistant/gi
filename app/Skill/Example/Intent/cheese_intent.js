/**
 * Cheese Example
 */
const Intent = require('../../../../src/Intent/intent');

module.exports = class CheeseIntent extends Intent {

	setup() {
		this.train(['cheese']);
		this.parameter('confirm', {
			name: 'Confirm',
      entity: 'App.Common.Entity.Confirm',
      action: 'answered'
		});
	}

	response(request) {
    request.attachment('action','Yes');
    request.attachment('action','No');
    request.expect({
      force: true
    });
		return 'Do you like cheese?';
	}

	answered(request) {
		let confirm = request.parameters.value('confirm');
		return confirm == 'yes' ? 'I like cheese too!' : 'Smell my cheese';
	}

}

