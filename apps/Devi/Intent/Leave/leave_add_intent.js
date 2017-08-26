// Leave add
	
var Intent = require('../../../../src/Intent/intent');
var DeviApi = require('../../api');
var _ = require('underscore');

function LeaveAddIntent() {
	var methods = {
		name: 'LeaveAdd',
		trigger: 'leave',
		synonyms: ["vacation","holiday"],
		entities: {
			"Common/Date": {}
		},
		parameters: {
			"date": {
				name: "Date",
				entity: "Common/Date"
			},
			"confirm": {
				name: "Confirm",
				entity: "Common/Confirm"
			},
			"employee": {
				name: "Employee",
				entity: "Devi/Employee"
			}
		},
		auth:'devi'
	}
	methods.__proto__ = Intent()

	methods.response = function(request) {
		var employee = request.param('employee');

		if(employee) {
			var output = [];
			var employee_name = request.param_label('employee');
			output.push('Please confirm you want to book '+employee_name+' for xxx off for leave');
			return output;
		}

		if(request.param('date')) {
			return this.confirm(request);
		}

		var output = 'When do you want your leave? Today, tomorrow, next week?';

		/*request.session.set_expecting({
			intent: this,
			entity: 'date',
			action: 'confirm',
			force: true
		});*/
		return output;
	}

	methods.confirm = function(request) {
		var date = request.param('date');
		var employee = request.param('employee');
		var output = [];

		if(employee) {
			var employee_name = request.param_label('employee');
			output.push('Please confirm you want to book '+employee_name+' for '+date+' off for leave');
		}
		else {
			output.push('Please confirm you want to book '+date+' off for leave');
		}

		//Turn off confirm for now
		/*request.session.set('date',date);
		request.session.set_expecting({
			intent: this,
			entity: 'date',
			action: 'answered',
			force: true
		});*/
		return output;
	}

	methods.answered = function(request) {
		var confirm = request.param('confirm');
		var date = request.session.data('date');
		var output = null;

		if(confirm == 'yes') {
			output = 'Thanks, '+date+' has been booked off!';
		}
		else {
			output = 'No problems, the request has been cancelled';
		}

		return output;
	}

	return methods
}


module.exports = LeaveAddIntent;
