/**
 * Unit Entity
 */
const Entity = require('../../../../src/Entity/entity');
const convert = require('convert-units');
const extend = require('extend');

function UnitEntity() {
	var entity = {
		name: "Unit",
		import: {
			file: "Common/Data/units.json",
			type: "json"
		}
	}
	entity.__proto__ = Entity()

	entity.parse = function(string) {
		var result = this.find(string, {
			use_key: false
		});
		return result;
	}

	return entity
}

module.exports = UnitEntity;
