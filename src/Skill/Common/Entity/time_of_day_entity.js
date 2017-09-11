/**
 * Emotion Entity
 */	
const Entity = require('../../../Entity/entity');

module.exports = class TimeOfDayEntity extends Entity {

	setup() {
		this.name = "Greeting";

		this.data = {
			"morning": {},
			"afternoon": {},
			"evening": {}
		};
	}

	parse(string) {
		var result = this.find(string);
		return result;
	}

}

