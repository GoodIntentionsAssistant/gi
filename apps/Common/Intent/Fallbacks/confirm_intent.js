/**
 * Confirm Fallback Intent
 */
var Intent = require('../../../../src/Intent/intent');

module.exports = class ConfirmIntent extends Intent {

	setup() {
		this.name = 'Confirm Fallback';

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

	response() {
		var confirm = request.param('confirm');
		var output = 'Okay!';
		
		if(confirm == 'yes') {
			output = 'Not sure what you are saying yes to.';
		}

		return output;
	}

}
