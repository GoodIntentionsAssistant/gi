// Gratitude
	
const Intent = require('../../../../src/Intent/intent');
var _ = require('underscore');

module.exports = class GratitudeIntent extends Intent {

	setup() {
		this.name = 'Gratitude';
		this.trigger = 'thanks';
		this.synonyms = [
			"thank",
			"gratitude",
			"good luck"
		];
		this.tests = [
			{ input:'thanks' },
			{ input:'thank you' },
			{ input:'good luck' }
		];
	}

	response() {
		var choices = [
			"Thanks!",
			"No problems!",
			"It's my job!",
			"Thanks for the recognition!"
		];
		return _.sample(choices);
	}

}

