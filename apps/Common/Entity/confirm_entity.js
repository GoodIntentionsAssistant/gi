// Confirm
	
var Entity = require('../../../src/Entity/entity');

function ConfirmEntity() {
	var entity = {
		name: "Confirm",
		data: {
			'yes': {
				synonyms:['yeah','yep','yup','aye','sure','indeed','true','ok']
			},
			'no': {
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

module.exports = ConfirmEntity;
