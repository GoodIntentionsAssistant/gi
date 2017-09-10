/**
 * Random number intent
 */
const Intent = require('../../../../src/Intent/intent');
var _ = require('underscore');

module.exports = class RandomNumberIntent extends Intent {

	setup() {
		this.name = 'Random Number';
		this.trigger = 'random number';
		this.synonyms = [
    ];
		this.parameters = {
			"number": {
				name: "Number",
				entity: "Sys.Common.Entity.Number",
				required: false
			},
			"number_to": {
				name: "Number To",
				entity: "Sys.Common.Entity.Number",
				required: false
			}
		};
	}


	response(request) {
		let number = request.parameters.value('number');
    let number_to = request.parameters.value('number_to');
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

}

