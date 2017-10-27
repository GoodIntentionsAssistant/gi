/**
 * Date number Intent
 */
const Intent = require('../../../../src/Intent/intent');
const moment = require('moment');

module.exports = class DateNumberIntent extends Intent {

	setup() {
		this.train([
			'date on'
    ]);

    this.parameter('date', {
      name: 'date',
			entity: 'App.Common.Entity.Date',
			required: true
    });
	}


	response(request) {
		let date = request.parameters.value('date');
		let ref = request.parameters.get('date.string');
		let tense = 'is';

		if(moment(date) < moment()) {
			tense = 'was';
		}

		let output = 'The date '+ref+' '+tense+' '+moment(date).format('Do MMMM');


		return output;
	}

}
