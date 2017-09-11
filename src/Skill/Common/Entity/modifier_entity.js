/**
 * Modifier Entity
 */
var Entity = require('../../../../src/Entity/entity');

function ModifierEntity() {
	var entity = {
		name: "Modifier",
		data: {
			'+': {
				synonyms:[]
			},
			'-': {
				synonyms:[]
			},
			'*': {
				synonyms:[]
			}
		}
	}
	entity.__proto__ = Entity()

	entity.parse = function(string) {
		var remaining = string;
		var value = null;

		if(string.indexOf('+') > -1) {
			remaining = remaining.replace('+','');
			value = 'addition'
		}
		else if(string.indexOf('-') > -1) {
			remaining = remaining.replace('-','');
			value = 'minus'
		}
		else if(string.indexOf('*') > -1) {
			remaining = remaining.replace('*','');
			value = 'times'
		}

		return {
			value: value,
			original: remaining
		}
	}

	return entity
}

module.exports = ModifierEntity;
