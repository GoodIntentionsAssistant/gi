/**
 * Must Be Positive Example
 */
const Intent = require('../../../../src/Intent/intent');

module.exports = class MustBePositiveIntent extends Intent {

	setup() {
		this.train('must be');
    this.must('#positive');
	}

	response() {
		return 'Positive all the time!';
	}

}

