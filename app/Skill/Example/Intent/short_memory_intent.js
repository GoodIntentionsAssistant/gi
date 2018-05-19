/**
 * Short Memory Intent
 */
const Intent = require('../../../../src/Intent/intent');

module.exports = class ShortMemoryIntent extends Intent {

	setup() {
		this.train('short memory');
	}

	response(request) {
    request.expect({
      action: 'reply',
      force: true,
      expire: 5
    });
		return 'Do you like bananas?';
	}

  reply(request) {
    return 'I like bananas';
  }

}

