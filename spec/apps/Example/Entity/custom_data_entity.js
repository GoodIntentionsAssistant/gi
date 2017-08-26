// CustomData
	
var Entity = require('../../../../src/Entity/entity');

function CustomDataEntity() {
	var entity = {
		name: "CustomData",
		require_session: 'system'
	}
	entity.__proto__ = Entity()

	entity.parse = function(string) {
		var result = this.find(string);
		return result;
	}

	return entity
}

module.exports = CustomDataEntity;
