/**
 * Why Fallback Intent
 */
const Intent = require('../../../../src/Intent/intent');

module.exports = class WhyIntent extends Intent {

	setup() {
		this.train(['why'], {
			classifier: 'fallback'
		});
	}
	

	response() {
		return 'Everyone asks why';
	}

}

