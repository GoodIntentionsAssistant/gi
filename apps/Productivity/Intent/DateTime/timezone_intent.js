// Time zone
	
var Intent = require('../../../../src/Intent/intent');
var moment = require('moment-timezone');

function TimezoneIntent() {
	var methods = {
		name: 'Timezone',
		trigger: 'time',
		synonyms: [
			'timezone',
			'time zone',
			'time in',
			'what is the time',
			'what is the timezone'
		],
		entities: {
			'Common/Country': {},
			'Common/City': {}
		},
		parameters: {
			"location": {
				name: "Location",
				entity: ["Common/Country","Common/City"],
				required: false,
				action: 'specified',
				from_user: true
			}
		},
		tests: [
			{ input:'time in london' },
			{ input:'time in new york' },
			{ input:'what is the time in solihull' },
		]
	}
	methods.__proto__ = Intent()


	methods.response = function(request) {
		return 'For a timezone please specify the country or city';
	}


	methods.specified = function(request) {
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

	return methods
}


module.exports = TimezoneIntent;
