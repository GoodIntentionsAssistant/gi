/**
 * Scone Example
 */
const Intent = require('../../../../src/Intent/intent');

module.exports = class SconeIntent extends Intent {

	setup() {
		this.train([
			'scone'
		]);

		this.parameter('choice', {
			name: 'Choice',
			data: {
				'yes': {
					synonyms: ['yup','yeah']
				},
				'no': {
					synonyms: ['nope','nah']
				}
			},
			action: 'answered'
		});
	}

	response(request) {
    request.expect({
      force: true
    });
		return 'Do you want jam on your scone?';
	}

	answered(request) {
		let choice = request.parameters.value('choice');
		return choice == 'yes' ? 'A scone with jam coming up!' : 'A scone without jam is ordered!';
	}

}

