/**
 * Is it tomorrow intent
 */
const Intent = require('../../../../src/Intent/intent');
const moment = require('moment');

module.exports = class IsItTomorrowIntent extends Intent {

	setup() {
		this.train([
			'monday',
			'tuesday',
			'wednesday',
			'thursday',
			'friday',
			'saturday',
			'sunday',
			'today',
			'tomorrow',
			'yesterday'
    ]);

    this.parameter('date', {
      name: 'date',
			entity: 'App.Common.Entity.Date'
    });
	}


	response(request) {
		return 'cool';
	}

}
