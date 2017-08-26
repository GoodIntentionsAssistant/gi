// Employee detail
	
var Intent = require('../../../../src/Intent/intent');
var inflect = require('i')();
var moment = require('moment');

function EmployeeDetailIntent() {
	var methods = {
		name: 'Employee Detail',
		trigger: 'detail',
		synonyms: [],
		entities: {
			'Devi/EmployeeField': {}
		},
		auth: 'devi',
		parameters: {
			"employee": {
				name: "Employee",
				entity: "Devi/Employee",
				required: false
			},
			"field": {
				name: "Employee Field",
				entity: "Devi/EmployeeField",
				required: false
			}
		}
	}
	methods.__proto__ = Intent()

	methods.response = function(request) {
		//Who
		var employee = request.param('employee');
		var name = '';

		if(employee) {
			name = employee.data.full_name;
			name_plural = name+"'s";
		}
		else {
			employee = {
				data: request.session.auth('devi','data')
			};
			name = 'Your';
			name_plural = name;
		}

		//Field to get and the label
		var field = request.param('field');
		var label = request.param_label('field');
		label = label.toLowerCase();

		var value = employee.data[field];

		//Output
		var output = [];

		//Just name
		if(field == 'last_name' || field == 'first_name') {
			output.push('It is '+name);
		}
		else if(field == 'address') {
			var address = [];
			address.push(employee.data.address_1);
			address.push(employee.data.address_2);
			address.push(employee.data.address_3);
			address.push(employee.data.city);
			address.push(employee.data.postcode);
			address.push(employee.data.country.name);

			address = address.filter(function(n){ return n != '' }); 

			if(address.length > 0) {
				output.push(name_plural+" address is...");
				for(var ii=0; ii<address.length; ii++) {
					output.push(address[ii]);
				}
			}
			else {
				output.push(name+" does not have their address saved in Devi");
			}
		}
		else if(!value) {
			output.push("It doesn't look like "+name+" has their "+label+" is saved in Devi");
		}
		else {
			output.push(name_plural+" "+label+' is '+value);
		}

		//Output how old they are
		if(field == 'date_of_birth') {
			var born_date = moment(value);
			var years = moment().diff(born_date, 'years');
			output.push('They are '+years);
		}

		//Check if it's their birthday soon
		var born_date = employee.data.date_of_birth;
		var this_year = moment(born_date).set('year', moment().format('YYYY'));

		var diff_days = moment().diff(this_year, 'days');
		diff_days *= -1;

		if(diff_days < 50) {
			var to = moment().to(this_year);
			output.push('Their birthday is '+to+', '+moment(this_year).format('dddd Do MMM'));
		}

		return output;
	}

	return methods
}


module.exports = EmployeeDetailIntent;
