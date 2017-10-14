/**
 * Menu Entity
 */	
const Entity = require('../../../../src/Entity/entity');

module.exports = class MenuEntity extends Entity {

	setup() {
		this.name = "Menu";
		this.import = {
			file: "App.Example.Data.menu",
			type: "json"
		};
	}

	parse(string) {
		var result = this.find(string);
		return result;
	}

}