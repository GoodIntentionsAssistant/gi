// Currencies
	
var Entity = require('../../../../src/Entity/entity');

function NumberEntity() {
	var entity = {
		name: "Number"
	}
	entity.__proto__ = Entity()

	entity.parse = function(string) {
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

	return entity
}

module.exports = NumberEntity;
