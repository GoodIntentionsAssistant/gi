/**
 * Who Fallback Intent
 */
const Intent = require('../../../../src/Intent/intent');

module.exports = class WhoIntent extends Intent {

	setup() {
		this.name = 'Who Fallback';
		this.train(['who'], {
			classifier: 'fallback'
		});
	}
	

	response() {
		return 'No idea who!';
	}

}
