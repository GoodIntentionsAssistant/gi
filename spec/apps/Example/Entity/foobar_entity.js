// Foobar
	
var Entity = require('../../../../src/Entity/entity');

function FoobarEntity() {
	var entity = {
		name: "Foobar",
		data: {
			'yes': {
				label: "Yes",
				synonyms:['yeah','yep','yup','aye','sure','indeed','true']
			},
			'no': {
				label: "No",
				synonyms:['nope','cancel','maybe','negative','nah','false']
			}
		}
	}
	entity.__proto__ = Entity()

	entity.parse = function(string) {
		var result = this.find(string);
		return result;
	}

	return entity
}

module.exports = FoobarEntity;
