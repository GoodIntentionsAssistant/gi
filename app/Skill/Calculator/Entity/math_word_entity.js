/**
 * Math Word Entity
 */
var Entity = require('../../../../src/Entity/entity');

function MathWordEntity() {
	var entity = {
		name: "Math Word",
		data: {
			'addition': {
				value: '+',
				synonyms:['add','sum']
			},
			'subtraction': {
				value: '-',
				synonyms:['subtract','deduct','detract','minus']
			},
			'multiplication': {
				value: '*',
				synonyms:['multiply','multiplied','times','x']
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

module.exports = MathWordEntity;
