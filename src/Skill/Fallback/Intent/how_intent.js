/**
 * How Fallback Intent
 */
var Intent = require('../../../Intent/intent');

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


