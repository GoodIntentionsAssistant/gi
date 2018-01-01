/**
 * Kiss me Example
 */
const Intent = require('../../../../src/Intent/intent');

module.exports = class KissMeIntent extends Intent {

	setup() {
		this.train(['kiss me'], {
      collection: 'strict'
    });
	}

	response() {
		return 'Muwah';
	}

}

