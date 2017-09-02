// Random number
	
var Intent = require('../../../../src/Intent/intent');
var _ = require('underscore');


function RandomNumberIntent() {
	var methods = {
		name: 'Random Number',
		trigger: 'random number',
		synonyms: [
    ],
		parameters: {
			"number": {
				name: "Number",
				entity: "Common/Number",
				required: false
			},
			"number_to": {
				name: "Number To",
				entity: "Common/Number",
				required: false
			}
		}
	}
	methods.__proto__ = Intent()


	methods.response = function(request) {
		let number = request.param('number');
    let number_to = request.param('number_to');
    let result;
    
    if(number && number_to) {
      result = _.random(parseInt(number), parseInt(number_to));
    }
    else if(number) {
      result = _.random(0, parseInt(number));
    }
    else {
      result = _.random(1, 100);
    }

		return 'The random number is '+result;
	}

	return methods
}


module.exports = RandomNumberIntent;
