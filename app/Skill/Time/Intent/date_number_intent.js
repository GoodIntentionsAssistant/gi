/**
 * Date number Intent
 */
const Intent = require('../../../../src/Intent/intent');
const moment = require('moment');

module.exports = class DateNumberIntent extends Intent {

	setup() {
		this.train([
			'date',
			'day',
			'@App.Common.Entity.Date'
    ]);

    this.parameter('date', {
      name: 'date',
			entity: 'App.Common.Entity.Date',
			default: 'today'
    });
	}


	response(request) {
		let date = request.parameters.value('date');
		let ref = request.parameters.get('date.string');
		let tense = 'is';

		let _date = moment(date);
		let now = moment();
		if(_date.diff(now,'days') < 0) {
			tense = 'was';
		}

		let output = 'The date '+ref+' '+tense+' '+moment(date).format('dddd Do MMMM');


		return output;
	}

}
