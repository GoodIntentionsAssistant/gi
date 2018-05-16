/**
 * Age Example
 */
const Intent = require('../../../../src/Intent/intent');

module.exports = class AgeIntent extends Intent {

	setup() {
		this.train([
			'what is my age?',
			'how old am i?'
		]);

		this.parameter('dob_year', {
			name: 'Choice',
			data: ['yes', 'no'],
			prompt: 'What year was you born?'
		});

		this.parameter('dob_month', {
			name: 'Choice',
			data: ['yes', 'no'],
			prompt: 'Which month?'
		});

		this.parameter('dob_day', {
			name: 'Choice',
			data: ['yes', 'no'],
			prompt: 'What day?'
		});
	}

	response(request) {
		let dob_year = request.parameters.value('dob_year');
		let dob_month = request.parameters.value('dob_month');
		let dob_day = request.parameters.value('dob_day');
		return 'cool !';
	}

}

