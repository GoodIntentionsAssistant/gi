/**
 * Cancel Intent
 */
const Intent = require('../../../../src/Intent/intent');

module.exports = class CancelIntent extends Intent {

	setup() {
		this.train(['@App.Common.Entity.Cancel',], {
			collection: 'cancel'
		});
	}
	
	response(request) {
		return 'No problems!';
	}

}

