/**
 * Animal Entity
 */	
const Entity = require('../../../../src/Entity/entity');

module.exports = class AnimalEntity extends Entity {

	setup() {
		this.import = {
			file: "App.Example.Data.animals",
			type: "json"
		};
	}

}