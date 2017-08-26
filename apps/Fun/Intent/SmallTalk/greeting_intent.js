// Hello
	
var Intent = require('../../../../src/Intent/intent');
var _ = require('underscore');
var Promise = require('promise');

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
		else if(type == 'hello') {
			return new Promise(function(resolve, reject) {
				var giphy = require('giphy-api')();
				giphy.search('hello', function(err, res) {
					//url, https://media.giphy.com/media/3ohA31GE4iCdTfpgSA/giphy.gif
					if(!res || !res.data) {
						resolve('Hello!');
						return;
					}
					var rand = _.sample(res.data);
					var img_url = rand.images.original.url;
					request.attachment.add_image(img_url);
					resolve('Hello!');
				});
			});
		}
		else {
			var output = [
				"Hi! I'm Devi",
				"I'm all about productivity and getting things done!",
				"I can help you keep your office organised and help you with useful business things"
			];
		}

		return output;
	}

	return methods
}


module.exports = GreetingIntent;
