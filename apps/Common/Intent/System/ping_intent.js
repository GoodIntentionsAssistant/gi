/**
 * Ping Intent
 */
var Intent = require('../../../../src/Intent/intent');

module.exports = class PingIntent extends Intent {

	setup() {
		this.name = 'Ping';
		this.trigger = 'ping';
    this.symnomns = ['pong'];
	}

	response() {
		return 'Pong';
	}

}

