/**
 * Ping Intent
 */
const Intent = require('../../../../src/Intent/intent');

module.exports = class PingIntent extends Intent {

	setup() {
		this.name = 'Ping';
		this.train(['ping','pong']);
	}

	response() {
		return 'Pong';
	}

}

