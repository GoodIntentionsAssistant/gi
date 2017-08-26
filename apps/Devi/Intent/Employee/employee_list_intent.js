// Employee list add
	
var Intent = require('../../../../src/Intent/intent');
var DeviApi = require('../../api');
var Promise = require('promise');
var _ = require('underscore');

function EmployeeListIntent() {
	var methods = {
		name: 'Employee List',
		trigger: 'list employees',
		synonyms: ['list staff'],
		auth: 'devi'
	}
	methods.__proto__ = Intent()

	methods.response = function(request) {
		var that = this;
		var api = new DeviApi;

		return new Promise(function(resolve, reject) {
			var promise = api.call(request.session, 'employees', 'list');

			promise.then(function(data) {
				var output = [];

				output.push('You have '+data.employees.length+' employees. They are...');
				for(var ii=0; ii<data.employees.length; ii++) {
					output.push('* '+data.employees[ii].full_name+' who was born on '+data.employees[ii].date_of_birth);
				}

				resolve(output);
			});
		});
	}

	return methods
}


module.exports = EmployeeListIntent;
