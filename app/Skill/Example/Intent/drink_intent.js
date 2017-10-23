/**
 * Drink Example
 */
const Intent = require('../../../../src/Intent/intent');

module.exports = class DrinkIntent extends Intent {

	setup() {
		this.train([
			'@App.Example.Entity.Drink'
		]);

		this.add_parameter('choice', {
			name: "Choice",
			entity: "App.Example.Entity.Drink"
		});
	}

	response(request) {
		let choice = request.parameters.value('choice');
		return 'You want to drink '+choice;
	}

}

