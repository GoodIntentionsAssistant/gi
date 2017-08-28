// Hello
'use strict';

const Intent = require('../../../../src/Intent/intent');
const _ = require('underscore');
const Promise = require('promise');

// module.exports = class GreetingIntent extends Intent {

// 	constructor() {
// 		super();

// 		this.name = 'Hello';
// 		this.trigger = 'hello';

// 		this.entities = {
// 			"Common/Greeting": {}
// 		};

// 		this.tests = [
// 			{ input:'hello' },
// 			{ input:'sup' }
// 		];

// 		this.parameters = {
// 			"time_of_day": {
// 				name: "Time of day",
// 				entity: 'Common/TimeOfDay',
// 				full: true
// 			},
// 			"type": {
// 				name: "Type of Greeting",
// 				entity: 'Common/Greeting'
// 			}
// 		}
// 	}

// 	hello() {

// 	}

// 	response(request) {
// 		console.log('hey!');
// 		var type = request.param('type');
// 		var time_of_day = request.param('time_of_day');

// 		if(type == 'time_of_day') {
// 			if(!time_of_day) {
// 				time_of_day = 'morning'
// 			}
// 			var output = 'Good '+time_of_day+' to you too';
// 		}
// 		else {
// 			var output = [
// 				"Hi! I'm the Good Intentions bot!",
// 				"I'm all about productivity and getting things done!"
// 			];
// 		}

// 		return output;
// 	}

// }



function GreetingIntent() {
	var methods = {
		name: 'Hello',
		trigger: 'hello',
		entities: {
			"Common/Greeting": {}
		},
		tests: [
			{ input:'hello' },
			{ input:'sup' }
		],
		parameters: {
			"time_of_day": {
				name: "Time of day",
				entity: 'Common/TimeOfDay',
				full: true
			},
			"type": {
				name: "Type of Greeting",
				entity: 'Common/Greeting'
			}
		}
	}
	methods.__proto__ = Intent()

	methods.response = function(request) {
		var type = request.param('type');
		var time_of_day = request.param('time_of_day');

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

	return methods
}


module.exports = GreetingIntent;
