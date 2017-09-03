// Parting
	
var Intent = require('../../../../src/Intent/intent');
var Scrubber = require('../../../../src/Utility/scrubber');
var _ = require('underscore');

function PartingIntent() {
	var methods = {
		name: 'Parting',
		trigger: 'goodbye',
		classifier: 'strict',
		entities: {
			'Common/Parting': {}
		},
		tests: [
			{ input:'goodbye' },
			{ input:'good night' }
		]
	}
	methods.__proto__ = Intent()

	methods.response = function(request) {
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

	return methods
}


module.exports = PartingIntent;
