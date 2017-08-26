// Paramters failed
	
var Intent = require('../../../../src/Intent/intent');
var _ = require('underscore');

function ParametersFailedIntent() {
	var methods = {
		name: 'ParametersFailed'
	}
	methods.__proto__ = Intent()

	methods.response = function(request) {
		var intent_name = request._failed_intent.name;

		var output = [
			"Parameters failed for "+intent_name
		];

		for(var field in request.parameters.data) {
			if(!request.parameters.data[field].valid) {
				output.push(request.parameters.data[field].name+' was not provided');
			}
		}

		return output;
	}

	return methods
}


module.exports = ParametersFailedIntent;
