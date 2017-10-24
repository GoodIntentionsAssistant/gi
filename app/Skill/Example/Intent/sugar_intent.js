/**
 * Sugar Example
 */
const Intent = require('../../../../src/Intent/intent');

module.exports = class SugarIntent extends Intent {

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
		return 'Do you want sugar in your tea?';
	}

	answered(request) {
		let choice = request.parameters.value('choice');
		return choice == 'yes' ? 'Sweet tooth' : 'Health option';
	}

}

