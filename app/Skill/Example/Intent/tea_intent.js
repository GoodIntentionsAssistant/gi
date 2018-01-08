/**
 * Tea Example
 */
const Intent = require('../../../../src/Intent/intent');

module.exports = class TeaIntent extends Intent {

	setup() {
		this.train([
			'tea'
		]);

		this.parameter('choice', {
			name: "Choice",
			data: {
				"yes": {},
				"no": {}
			},
			action: 'answered'
		});
	}

	response(request) {
    request.expect({
      force: true
    });
		return 'Do you want sugar in your tea?';
	}

	answered(request) {
		let choice = request.parameters.value('choice');
		return choice == 'yes' ? 'Sweet tooth' : 'Healthy option';
	}

}

