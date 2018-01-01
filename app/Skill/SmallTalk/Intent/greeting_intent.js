/**
 * Greeting Intent
 */
'use strict';

const Intent = require('../../../../src/Intent/intent');
const _ = require('underscore');
const Promise = require('promise');

module.exports = class GreetingIntent extends Intent {

	setup() {
		this.train([
			'@App.Common.Entity.Greeting'
		]);

		this.parameter('time_of_day',{
			name: "Time of day",
			entity: 'App.Common.Entity.TimeOfDay'
		});
	}

	response(request) {
		let output = null;

		//Check if time of day has been included
		let time_of_day = request.parameters.value('time_of_day');

		if(time_of_day) {
			output = 'Good '+time_of_day+' to you too';
		}
		else {
			output = [
				"Hi! I'm the Good Intentions bot!",
				"I'm all about productivity and getting things done!"
			];
		}

		return output;
	}

}

