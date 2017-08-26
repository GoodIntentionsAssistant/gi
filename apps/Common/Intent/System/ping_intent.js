// ping.js
	
var Intent = require('../../../../src/Intent/intent');
var _ = require('underscore');

function PingIntent() {
	var methods = {
		name: 'Ping',
		trigger: 'ping'
	}
	methods.__proto__ = Intent()

	methods.response = function() {
		var output = [
			'Pong'
		];
		return output;
	}

	return methods
}


module.exports = PingIntent;
