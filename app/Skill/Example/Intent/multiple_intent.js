/**
 * Multiple Intent
 */
const Intent = require('../../../../src/Intent/intent');

module.exports = class MultipleIntent extends Intent {

	setup() {
		this.train([
      'multiple'
    ], {
      collection: 'strict'
    });
	}

	response(response) {
    response.send('Let\'s ping!');

    response.app.request({
      client_id: response.client.client_id,
      session_id: response.session.session_id,
      intent: 'App.Example.Intent.Ping',
      fast: true
    });

		return true;
	}

}

