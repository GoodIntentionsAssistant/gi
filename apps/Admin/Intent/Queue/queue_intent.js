// Queue
	
var Admin = require('../admin');

function QueueIntent() {
	var methods = {
		name: 'Queue',
		trigger: 'queue status'
	}
	methods.__proto__ = Admin()

	methods.response = function(response) {
		var output = [];

		output.push('Queue status');

		var status = response.app.Queue.status();
		for(var key in status) {
			output.push('- '+key+': '+status[key]);
		}

		return output;
	}

	return methods
}

module.exports = QueueIntent;
