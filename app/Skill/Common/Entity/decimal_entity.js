/**
 * Decimal Entity
 */	
const Entity = require('../../../../src/Entity/entity');

module.exports = class DecimalEntity extends Entity {

	setup() {
		this.data = {};
	}

	parse(string) {
		let original = null;
		let value = null;
		let position = null

		//Match numbers in the string
		//let match = string.match(/^\d+|\d+\b|\d+(?=\w)/);

		//https://www.codeproject.com/Questions/426944/regular-expression-which-allow-both-decimals-as-we
		let match = string.match(/[0-9]\d{0,9}(\.\d{1,3})?/);

		if(match) {
			value = match[0];
			original = match[0];

			//Find the index for position
			position = string.indexOf(match[0]);
		}

		return {
			value: value,
			original: original,
			position: position
		}
	}

}
