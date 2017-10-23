/**
 * Boing Intent
 */
const Intent = require('../../../../src/Intent/intent');

module.exports = class BoingIntent extends Intent {

	setup() {
		this.train(['boing']);
	}

	response(request) {
		return request.redirect('App.Example.Intent.Ping');
	}

}

