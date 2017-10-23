/**
 * Emotion Entity
 */	
const Entity = require('../../../../src/Entity/entity');

module.exports = class EmotionEntity extends Entity {

	setup() {
		this.import = {
			file: "Data.Common.emotion",
			type: "json"
		};
	}

	parse(string) {
		var result = this.find(string);
		return result;
	}

}