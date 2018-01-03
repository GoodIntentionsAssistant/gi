/**
 * Random number intent
 */
const Intent = require('../../../../src/Intent/intent');
var _ = require('underscore');

module.exports = class RandomNumberIntent extends Intent {

	setup() {
		this.train([
			'random number'
		]);

		this.parameter('number', {
			name: "Number",
			entity: "App.Common.Entity.Number",
			required: false
		});

		this.parameter('number_to', {
			name: "Number To",
			entity: "App.Common.Entity.Number",
			required: false
		});
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
		
		//Attachments
		if(number) {
			request.attachment('field',{
				title: "Number from",
				value: number
			});
		}
		if(number_to) {
			request.attachment('field',{
				title: "Number to",
				value: number_to
			});
		}

		return 'The random number is '+result;
	}

}

