/**
 * Animal Entity
 */	
const Entity = require('../../../../src/Entity/entity');

module.exports = class AnimalEntity extends Entity {

	setup() {
		this.name = "Animal";
		this.import = {
			file: "App.Example.Data.animals",
			type: "json"
		};
	}

	parse(string) {
		var result = this.find(string);
		return result;
	}

}