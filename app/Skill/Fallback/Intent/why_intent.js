/**
 * Why Fallback Intent
 */
const Intent = require('../../../../src/Intent/intent');

module.exports = class WhyIntent extends Intent {

	setup() {
		this.name = 'Why Fallback';
		this.train(['why'], {
			classifier: 'fallback'
		});
	}
	

	response() {
		return 'Everyone asks why';
	}

}

