/**
 * Kiss me Example
 */
const Intent = require('../../../../src/Intent/intent');

module.exports = class KissMeIntent extends Intent {

	setup() {
		this.name = 'Kiss me';

		this.train(['kiss me'], {
      classifier: 'strict'
    });
	}

	response() {
		return 'Muwah';
	}

}

