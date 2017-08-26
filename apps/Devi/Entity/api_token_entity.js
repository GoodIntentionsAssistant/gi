// Api Token
	
var Entity = require('../../../src/Entity/entity');

function ApiTokenEntity() {
	var entity = {
		name: "ApiToken"
	}
	entity.__proto__ = Entity()

	entity.parse = function(string) {
		var original = null;
		var value = null;
		
		var match = string.match(/[a-zA-Z0-9_]{34}/);

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

module.exports = ApiTokenEntity;
