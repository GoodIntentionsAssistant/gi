/**
 * Currency Entity
 */
var Entity = require('../../../../src/Entity/entity');
var _ = require('underscore');

module.exports = class CurrencyEntity extends Entity {

	setup() {
		this.name = "Currency";
		this.import = {
			file: "Data.Common.currencies",
			type: "csv"
		};
	}

}
