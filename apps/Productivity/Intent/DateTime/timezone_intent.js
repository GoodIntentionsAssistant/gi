// Time zone
	
var Intent = require('../../../../src/Intent/intent');
var moment = require('moment-timezone');

module.exports = class TimezoneIntent extends Intent {

	setup() {
		this.name = 'Timezone';
		this.trigger = 'time';
		this.synonyms = [
			'timezone',
			'time zone',
			'time in',
			'what is the time',
			'what is the timezone'
		];
		this.entities = {
			'Common/Country': {},
			'Common/City': {}
		};
		this.parameters = {
			"location": {
				name: "Location",
				entity: ["Common/Country","Common/City"],
				required: false,
				action: 'specified',
				from_user: true
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
		var location = request.param('location');

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
