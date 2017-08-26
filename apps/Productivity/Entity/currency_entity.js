// Currencies
	
var Entity = require('../../../src/Entity/entity');
var _ = require('underscore');

function CurrencyEntity() {
	var entity = {
		name: "Currency",
		import: {
			file: "Common/Data/currencies.csv",
			type: "csv"
		},
		data: {}
	}
	entity.__proto__ = Entity()

	entity.parse = function(string) {
		//Find string
		var result = this.find(string);
		return result;
	}

	return entity
}

module.exports = CurrencyEntity;
