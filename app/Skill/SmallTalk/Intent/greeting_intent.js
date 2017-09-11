/**
 * Greeting Intent
 */
'use strict';

const Intent = require('../../../../src/Intent/intent');
const _ = require('underscore');
const Promise = require('promise');

module.exports = class GreetingIntent extends Intent {

	setup() {
		this.name = 'Hello';
		this.trigger = 'hello';
		this.entities = {
			"Sys.Common.Entity.Greeting": {}
		};
		this.tests = [
			{ input:'hello' },
			{ input:'sup' }
		];
		this.parameters = {
			"time_of_day": {
				name: "Time of day",
				entity: 'Sys.Common.Entity.TimeOfDay',
				full: true
			},
			"type": {
				name: "Type of Greeting",
				entity: 'Sys.Common.Entity.Greeting'
			}
		};
	}

	response(request) {
		var type = request.parameters.value('type');
		var time_of_day = request.parameters.value('time_of_day');

		if(type == 'time_of_day') {
			if(!time_of_day) {
				time_of_day = 'morning'
			}
			var output = 'Good '+time_of_day+' to you too';
		}
		else {
			var output = [
				"Hi! I'm the Good Intentions bot!",
				"I'm all about productivity and getting things done!"
			];
		}

		return output;
	}

}

