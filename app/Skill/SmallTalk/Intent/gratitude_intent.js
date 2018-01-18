/**
 * Gratitude Intent
 */
const Intent = require('../../../../src/Intent/intent');
const _ = require('underscore');

module.exports = class GratitudeIntent extends Intent {

	setup() {
		this.train([
			'thanks',
			'thank',
			'gratitude',
			'good luck',
			'cool'
		]);
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

