// Time of day
	
var Entity = require('../../../src/Entity/entity');

function TimeOfDayEntity() {
	var entity = {
		name: "Greeting",
		data: {
			"morning": {},
			"afternoon": {},
			"evening": {}
		}
	}
	entity.__proto__ = Entity()

	entity.parse = function(string) {
		var result = this.find(string);
		return result;
	}

	return entity
}

module.exports = TimeOfDayEntity;
