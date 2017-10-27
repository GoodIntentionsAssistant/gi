/**
 * Dummy Entity
 */
const Entity = require('../../../../src/Entity/entity');

module.exports = class DummyEntity extends Entity {
	
	setup() {
		this.data = {};
	}

	parse(string) {
		var result = this.find(string);
		return result;
	}

}