/**
 * Confirm Fallback Intent
 */
const Intent = require('../../../../src/Intent/intent');

module.exports = class ConfirmIntent extends Intent {

	setup() {
		this.train([
			'@App.Common.Entity.Confirm'
		], {
			collection: 'fallback'
		});

		this.parameter('confirm', {
			name: 'Confirm',
			entity: 'App.Common.Entity.Confirm'
		});
	}

	response(request) {
		var confirm = request.parameters.value('confirm');
		var output = 'Okay!';
		
		if(confirm == 'yes') {
			output = 'Not sure what you are saying yes to.';
		}

		return output;
	}

}
