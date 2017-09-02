// What are you doing
	
var Intent = require('../../../../src/Intent/intent');
var _ = require('underscore');

function DoingIntent() {
	var methods = {
		name: 'Gratitude',
		trigger: 'doing',
		synonyms: [
			"up to",
			"going on",
			"sup"
		],
		tests: [
			{ input:'what are you doing' }
		]
	}
	methods.__proto__ = Intent()

	methods.response = function() {
		var choices = [
			"Helping as many people as I can and entertaining them with cat facts!",
			"Calculations, currency and checking the time in different countries",
			"Browsing tech sites and trying to figure out what I\'ll be doing in 10 years time"
		];
		return _.sample(choices);
	}

	return methods
}


module.exports = DoingIntent;
