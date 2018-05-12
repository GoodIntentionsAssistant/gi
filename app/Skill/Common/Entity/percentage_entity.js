/**
 * Percentage Entity
 */	
const Entity = require('../../../../src/Entity/entity');

module.exports = class PercentageEntity extends Entity {

	setup() {
		this.data = {};
	}

	parse(string) {
		var original = null;
		var value = null;

		//Match numbers in the string
		let match = string.match(/^\d+|\d+\b|\d+(?=\w)/);

		if(match) {
			value = match[0];
			original = match[0];
		}

		return {
			value: value,
			original: original
		}
	}

}
