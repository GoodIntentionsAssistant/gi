// Employee
	
var Entity = require('../../../src/Entity/entity');
var DeviApi = require('../api');

function EmployeeEntity() {
	var entity = {
		name: "Employee",
		require_session: 'devi',
		import: {
			type: 'custom'
		}
	}
	entity.__proto__ = Entity()


	entity.load_data = function(resolve, request) {
		if(!request) {
			resolve();
			return;
		}

		var that = this;
		var api = new DeviApi;

		var promise = api.call(request.session, 'employees', 'list');
		promise.then(function(data) {
			that.set_data(data);
			resolve();
		});
	}


	entity.set_data = function(data) {
		for(var ii=0; ii<data.employees.length; ii++) {
			var record = data.employees[ii];

			this.data[record.id] = {
				label: record.full_name,
				data: record,
				synonyms:[
					record.first_name,
					record.last_name
				]
			};
		}
	}


	entity.parse = function(string) {
		var result = this.find(string);

		if(result.value) {
			result.value = this.data[result.value];
		}

		return result;
	}

	return entity
}

module.exports = EmployeeEntity;
