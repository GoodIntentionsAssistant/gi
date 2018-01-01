/**
 * Parting Intent
 */
const Intent = require('../../../../src/Intent/intent');
const _ = require('underscore');

module.exports = class PartingIntent extends Intent {

	setup() {
		this.train([
			'@App.Common.Entity.Parting'
		], {
			collection: 'strict'
		});
	}

	response(request) {
		let entity = request.app.EntityRegistry.get('App.Common.Entity.Parting');
		let data = entity.get_data();

		let output = _.sample(Object.keys(data));

		if(data[output].reply) {
			output = data[output].reply;
		}

		return output;
	}

}
