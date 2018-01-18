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
      client: response.client.client_id,
      session: response.session,
      intent: 'App.Example.Intent.Ping',
      fast: true
    });

		return true;
	}

}

