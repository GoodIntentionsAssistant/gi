/**
 * Unit Entity
 */
const Entity = require('../../../../src/Entity/entity');
const convert = require('convert-units');
const extend = require('extend');

module.exports = class UnitEntity extends Entity {

	setup() {
		this.import = {
			file: "Data.Common.units",
			type: "json"
		};
	}

	parse(string) {
		var result = this.find(string, {
			use_key: false
		});
		return result;
	}

}

