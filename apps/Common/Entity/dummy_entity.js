// Dummy
	
var Entity = require('../../../src/Entity/entity');

function DummyEntity() {
	var entity = {
		name: "Dummy",
		data: {}
	}
	entity.__proto__ = Entity()

	entity.parse = function(string) {
		var result = this.find(string);
		return result;
	}

	return entity
}

module.exports = DummyEntity;
