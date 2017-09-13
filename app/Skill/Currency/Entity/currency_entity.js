/**
 * Currency Entity
 */
var Entity = require('../../../../src/Entity/entity');
var _ = require('underscore');

module.exports = class MathWordEntity extends Entity {

	setup() {
		this.name = "Currency";
		this.import = {
			file: "Data.Common.currencies",
			type: "csv"
		};
		this.data = {};
	}

	parse(string) {
		//Find string
		var result = this.find(string);
		return result;
	}

}
