/**
 * Greeting Entity
 */	
var Entity = require('../../../Entity/entity');

module.exports = class GreetingEntity extends Entity {

	setup() {
		this.name = "Greeting";

		this.data = {
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
		};
	}

	parse(string) {
		var result = this.find(string,{
   		use_key: false
    });
		return result;
	}

}
