// Confirm Fallback
	
var Intent = require('../../../../src/Intent/intent');
var _ = require('underscore');

function ConfirmIntent() {
	var methods = {
		name: 'Confirm Fallback',
		entities: {
			'Common/Confirm': {}
		},
		classifier: 'fallback',
		parameters: {
			"confirm": {
				name: "Confirm",
				entity: 'Common/Confirm'
			}
		}
	}
	methods.__proto__ = Intent()

	methods.response = function() {
		var confirm = request.param('confirm');
		var output = 'Okay!';
		
		if(confirm == 'yes') {
			output = 'Not sure what you are saying yes to.';
		}

		return output;
	}

	return methods
}


module.exports = ConfirmIntent;
