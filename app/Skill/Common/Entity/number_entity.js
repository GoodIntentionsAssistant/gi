/**
 * Number Entity
 */	
const Entity = require('../../../../src/Entity/entity');

module.exports = class NumberEntity extends Entity {

	setup() {
		this.data = {};
	}

	parse(string) {
		var original = null;
		var value = null;

		var match = string.match(/^\d+|\d+\b|\d+(?=\w)/);

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