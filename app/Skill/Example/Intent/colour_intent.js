/**
 * Colour Intent
 */
const Intent = require('../../../../src/Intent/intent');

module.exports = class ColourIntent extends Intent {

	setup() {
		this.train([
      '@App.Example.Entity.Colour'
    ]);
	}

	response() {
		return 'You mentioned a colour';
	}

}

