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
				synonyms:['add','sum','plus']
			},
			'subtraction': {
				value: '-',
				synonyms:['subtract','deduct','detract','minus']
			},
			'multiplication': {
				value: '*',
				synonyms:['multiply','multiplied','times','x']
			},
			'percent': {
				value: '%',
				synonyms:['percentage']
			}
		};
	}

	parse(string) {
		var result = this.find(string);
		return result;
	}

}

