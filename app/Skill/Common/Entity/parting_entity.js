/**
 * Parting Entity
 */	
const Entity = require('../../../../src/Entity/entity');

module.exports = class PartingEntity extends Entity {

	setup() {
		this.name = "Parting";

		this.data = {
			"i'll be back": {
				"reply": "See you then!"
			},
			"goodbye": {},
			"good bye": {},
			"good night": {},
			"goodnight": {},
			"sweet dreams": {},
			"see you": {},
			"sleep": {
				"reply": "zzz"
			},
			"go to sleep": {
				"reply": "zzz"
			},
			"night": {},
			"farewell": {},
			"have a good day": {},
			"take care": {},
			"bye": {},
			"bye bye": {},
			"later": {},
			"see you later": {},
			"talk to you later": {},
			"so long": {},
			"peace": {},
			"adios": {},
			"ciao": {},
			"au revoir": {}
		};
	}

	parse(string) {
		var result = this.find(string);
		return result;
	}

}
