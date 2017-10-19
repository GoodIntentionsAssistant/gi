/**
 * Confirm Fallback Intent
 */
var Intent = require('../../../Intent/intent');

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

	response(request) {
		var confirm = request.parameters.value('confirm');
		var output = 'Okay!';
		
		if(confirm == 'yes') {
			output = 'Not sure what you are saying yes to.';
		}

		return output;
	}

}
