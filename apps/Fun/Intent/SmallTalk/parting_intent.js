// Parting
	
var Intent = require('../../../../src/Intent/intent');
var Scrubber = require('../../../../src/Utility/scrubber');
var _ = require('underscore');

module.exports = class PartingIntent extends Intent {

	setup() {
		this.name = 'Parting';
		this.trigger = 'goodbye';
		this.classifier = 'strict';
		this.entities = {
			'Common/Parting': {}
		};
		this.tests = [
			{ input:'goodbye' },
			{ input:'good night' }
		];
	}

	response(request) {
		var entity = request.app.Entities.get('Common/Parting');
		var data = entity.get_data();

		var output = _.sample(Object.keys(data));

		if(data[output].reply) {
			output = data[output].reply;
		}
		else {
			output = Scrubber.sentence_case(output);
		}

		return output;
	}

}
