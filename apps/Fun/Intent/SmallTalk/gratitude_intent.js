// Gratitude
	
var Intent = require('../../../../src/Intent/intent');
var _ = require('underscore');

function GratitudeIntent() {
	var methods = {
		name: 'Gratitude',
		trigger: 'thanks',
		synonyms: [
			"thank",
			"gratitude",
			"good luck"
		],
		tests: [
			{ input:'thanks' },
			{ input:'thank you' },
			{ input:'good luck' }
		]
	}
	methods.__proto__ = Intent()

	methods.response = function() {
		var choices = [
			"Thanks!",
			"No problems!",
			"It's my job!",
			"Thanks for the recognition!"
		];
		return _.sample(choices);
	}

	return methods
}


module.exports = GratitudeIntent;
