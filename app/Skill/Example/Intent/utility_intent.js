/**
 * Utility Example
 */
const Intent = require('../../../../src/Intent/intent');

module.exports = class UtilityIntent extends Intent {

	setup() {
		this.train([
			'utility'
		]);

		this.reject('add');

		this.reject([
			'remove',
			'update'
		]);
	}

	response(request) {
		return 'Utility reading is 10';
	}

}

