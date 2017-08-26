// Employee field
	
var Entity = require('../../../src/Entity/entity');

function EmployeeFieldEntity() {
	var entity = {
		name: "EmployeeField",
		data: {
			"first_name": {
				label: 'First name',
				synonyms: ['first name']
			},
			"last_name": {
				label: 'Last name',
				synonyms: ['last name']
			},
			"date_of_birth": {
				label: 'DOB',
				synonyms: ['born','dob','date of birth','birthday']
			},
			"phone_mobile": {
				label: 'Mobile',
				synonyms: ['mobile','mobile number','phone']
			},
			"position.name": {
				label: 'Position',
				synonyms: ['position','job']
			},
			"email": {
				label: 'Email',
				synonyms: []
			},
			"social_security_number": {
				label: "SSN",
				synonyms: ['social security','SSN']
			},
			"address": {
				label: "Address",
				synonyms: ['home','address','postcode','zip code','post code']
			}
		}
	}
	entity.__proto__ = Entity()

	entity.parse = function(string) {
		return this.find(string);
	}

	return entity
}

module.exports = EmployeeFieldEntity;
