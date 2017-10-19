/**
 * Who Fallback Intent
 */
var Intent = require('../../../Intent/intent');

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
