/**
 * Animal Example
 */
const Intent = require('../../../../src/Intent/intent');

module.exports = class AnimalIntent extends Intent {

	setup() {
		this.train([
			'cat','dog'
		]);

		this.add_parameter('choice', {
			name: "Choice",
			entity: "App.Example.Entity.Animal"
		});
	}

	response(request) {
		let choice = request.parameters.value('choice');

		if(choice) {
			return 'You chose '+choice;
		}
		else {
			return 'Dog or cat?';
		}
	}

}

