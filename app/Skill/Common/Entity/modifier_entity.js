/**
 * Modifier Entity
 */
const Entity = require('../../../../src/Entity/entity');

module.exports = class NumberEntity extends Entity {

	setup() {
		this.data = {
			'+': {
				synonyms:[]
			},
			'-': {
				synonyms:[]
			},
			'*': {
				synonyms:[]
			}
		};
	}

	parsen(string) {
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

}
