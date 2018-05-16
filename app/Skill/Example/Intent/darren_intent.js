/**
 * Darren Example
 */
const Intent = require('../../../../src/Intent/intent');

module.exports = class DarrenIntent extends Intent {

	setup() {
		this.train('darren');
		this.must('who')
	}

	response(request) {
		return 'The creator is great!';
	}

}

