/**
 * How Fallback Intent
 */
const Intent = require('../../../../src/Intent/intent');

module.exports = class HowIntent extends Intent {

	setup() {
		this.name = 'How Fallback';
		this.train(['how'], {
			classifier: 'fallback'
		});
	}
	
	response() {
		return 'How does anything happen?';
	}

}


