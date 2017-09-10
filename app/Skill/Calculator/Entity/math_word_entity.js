/**
 * Math Word Entity
 */
var Entity = require('../../../../src/Entity/entity');

module.exports = class MathWordEntity extends Entity {

	setup() {
		this.name = "Math Word";
		this.data = {
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
		};
	}

	parse(string) {
		var result = this.find(string);
		return result;
	}

}

