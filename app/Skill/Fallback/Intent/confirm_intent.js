/**
 * Confirm Fallback Intent
 */
const Intent = require('../../../../src/Intent/intent');

module.exports = class ConfirmIntent extends Intent {

	setup() {
		this.entities = {
			'Common/Confirm': {}
		};

		this.classifier = 'fallback';

		this.parameters = {
			"confirm": {
				name: "Confirm",
				entity: 'Common/Confirm'
			}
		};
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