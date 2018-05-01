/**
 * Ping Intent
 */
const Intent = require('../../../../src/Intent/intent');

module.exports = class PingIntent extends Intent {

	setup() {
		this.train('ping');
	}

	response() {
		return 'Pong';
	}

  shutdown() {
    console.log('Ping shutting down');
  }

}

