/**
 * When Fallback Intent
 */
const Intent = require('../../../../src/Intent/intent');

module.exports = class WhenIntent extends Intent {

	setup() {
		this.train(['when'], {
			classifier: 'fallback'
		});
	}
	

	response() {
		return 'I am not sure when';
	}

}

