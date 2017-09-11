// What are you doing
	
const Intent = require('../../../../src/Intent/intent');
var _ = require('underscore');

module.exports = class DoingIntent extends Intent {

	setup() {
		this.name = 'Gratitude';
		this.trigger = 'doing';
		this.synonyms = [
			"up to",
			"going on",
			"sup"
		];
		this.tests = [
			{ input:'what are you doing' }
		];
	}

	response() {
		var choices = [
			"Helping as many people as I can and entertaining them with cat facts!",
			"Calculations, currency and checking the time in different countries",
			"Browsing tech sites and trying to figure out what I\'ll be doing in 10 years time"
		];
		return _.sample(choices);
	}

}

