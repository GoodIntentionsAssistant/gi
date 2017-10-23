/**
 * Hello Intent
 */
const Intent = require('../../../../src/Intent/intent');

module.exports = class HelloIntent extends Intent {

	setup() {
		this.train(['hello']);
	}

	response() {
		return [
      'Hey!',
      'Very nice to meet you',
      'Let me know if you need any help'
    ];
	}

}

