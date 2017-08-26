// What are you doing
	
var Intent = require('../../../../src/Intent/intent');
var _ = require('underscore');

function DoingIntent() {
	var methods = {
		name: 'Gratitude',
		trigger: 'what are you doing',
		synonyms: [
			"what am i doing"
		],
		tests: [
			{ input:'what are you doing' },
			{ input:'thank you' },
			{ input:'good luck' }
		]
	}
	methods.__proto__ = Intent()

	methods.response = function() {
		var choices = [
			"Helping as many people as I can and entertaining them with cat facts!",
			"Helping, helping lots of employees request holiday leave",
			"Helping people manage their offices",
			"Calculations, currency and checking the time in different countries"
		];
		return _.sample(choices);
	}

	return methods
}


module.exports = DoingIntent;
