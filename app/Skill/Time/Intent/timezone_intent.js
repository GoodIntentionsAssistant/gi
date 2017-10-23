/**
 * Timezone Intent
 */
const Intent = require('../../../../src/Intent/intent');
const moment = require('moment-timezone');

module.exports = class TimezoneIntent extends Intent {

	setup() {
		this.name = 'Timezone';

		this.train([
			'time',
			'timezone',
			'time zone',
			'time in'
		]);

		this.entities = {
			'App.Common.Entity.Country': {},
			'App.Common.Entity.City': {}
		};
		this.parameters = {
			"location": {
				name: "Location",
				entity: ["App.Common.Entity.Country","App.Common.Entity.City"],
				required: false,
				action: 'specified',
				slotfill: true
			}
		};
		this.tests = [
			{ input:'time in london' },
			{ input:'time in new york' },
			{ input:'what is the time in solihull' }
		];
	}


	response(request) {
		return 'For a timezone please specify the country or city';
	}


	specified(request) {
		var location = request.parameters.value('location');

		//Vars
		var label = location.label;
		var zone_key = location.zone_key;

		//Clean up label, America/New_York = America, New York
		label = label.replace('_',' ');
		label = label.replace('/',', ');

		var result = moment().tz(zone_key).format('h:mm a, dddd Do (zZ)');
		return result+' in '+label;
	}

}
