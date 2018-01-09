/**
 * Cancel Entity
 */
const Entity = require('../../../../src/Entity/entity');

module.exports = class CancelEntity extends Entity {

	setup() {
		this.import = {
			file: "Data.Common.cancel",
			type: "json"
		};
	}

}

