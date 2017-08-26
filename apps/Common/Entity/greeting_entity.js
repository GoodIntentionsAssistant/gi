// Greeting
	
var Entity = require('../../../src/Entity/entity');

function GreetingEntity() {
	var entity = {
		name: "Greeting",
		data: {
			"hello": {
				"synonyms": [
					"hello",
					"hi",
					"hey",
					"yo",
					"sup",
					"hullo",
					"hey man",
					"howdy",
					"sup",
					"whazzup",
					"gday",
					"hiya"
				]
			},
			"time_of_day": {
				"synonyms": [
					"good morning",
					"morning",
					"good afternoon",
					"afternoon",
					"good evening",
					"evening"
				]
			}
		}
	}
	entity.__proto__ = Entity()

	entity.parse = function(string) {
		var result = this.find(string,{
   		use_key: false
    });
		return result;
	}

	return entity
}

module.exports = GreetingEntity;
