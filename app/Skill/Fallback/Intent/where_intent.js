/**
 * Where Fallback Intent
 */
const Intent = require('../../../../src/Intent/intent');

module.exports = class WhereIntent extends Intent {

	setup() {
		this.name = 'Where Fallback';
		this.train(['where'], {
			classifier: 'fallback'
		});
	}
	

	response() {
		return 'Could be anywhere. I have no idea';
	}

}

