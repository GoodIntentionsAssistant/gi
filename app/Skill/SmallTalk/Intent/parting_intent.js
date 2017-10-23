/**
 * Parting Intent
 */
const Intent = require('../../../../src/Intent/intent');
const _ = require('underscore');

module.exports = class PartingIntent extends Intent {

	setup() {
		this.name = 'Parting';
		this.trigger = 'goodbye';
		this.classifier = 'strict';
		this.entities = {
			'App.Common.Entity.Parting': {}
		};
		this.tests = [
			{ input:'goodbye' },
			{ input:'good night' }
		];
	}

	response(request) {
		var entity = request.app.EntityRegistry.get('App.Common.Entity.Parting');
		var data = entity.get_data();

		var output = _.sample(Object.keys(data));

		if(data[output].reply) {
			output = data[output].reply;
		}

		return output;
	}

}
