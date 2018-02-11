/**
 * Timezone Intent
 */
const Intent = require('../../../../src/Intent/intent');
const moment = require('moment-timezone');

module.exports = class TimezoneIntent extends Intent {

	setup() {
		this.train([
			'time',
			'timezone',
			'time zone',
			'time in'
		]);

		this.parameter('location',{
			name: 'Location',
			entity: ['App.Common.Entity.Country','App.Common.Entity.City'],
			required: false,
			action: 'specified',
			slotfill: ['city','country']
		});
	}

	response(request) {
		return 'For a timezone please specify the country or city';
	}

	specified(request) {
		let location = request.parameters.get('location.data');

		//Vars
		let label = location.label;
		let zone_key = location.zone_key;

		//Clean up label, America/New_York = America, New York
		label = label.replace('_',' ');
		label = label.replace('/',', ');

		let result = moment().tz(zone_key).format('h:mm a, dddd Do (zZ)');
		return result+' in '+label;
	}

}
