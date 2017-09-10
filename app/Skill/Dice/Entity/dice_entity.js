/**
 * Dice Entity
 */
const Entity = require('../../../../src/Entity/entity');

module.exports = class DiceEntity extends Entity {

	setup() {
		this.name = 'Dice';
		this.data = {};
	}


	parse(string) {
		let original = null;
		let value = null;

		//Standard notation
		//[\d+]?d\d+[\+|\-]?\d*
		let matches = string.match(/(\d+)?d((\d+)([+-]\d+)?)?$/);

		if(matches) {
			let rolls = matches[1] ? matches[1] : 1;
			let sides = matches[3] ? matches[3] : 6;

			//Maximums
			if(rolls > 12) { rolls = 12; }
			if(sides > 12) { sides = 12; }

			let dice = rolls+'d'+sides;

			value = {
				dice: dice,
				dice_rolls: rolls,
				dice_sides: sides,
				dice_modifier: matches[4]
			};

			original = matches.input;
		}
		else {
			//Check for numbers
			//12 rolls
			//12 sides
			let match = string.match(/^\d+|\d+\b|\d+(?=\w)/);

			if(match) {
				//Check for the word sides otherwise default to rolls
				let type = 'rolls';
				if(/sides|sided/i.test(string)) {
					type = 'sides';
				}

				if(type == 'rolls') {
					//Dice based on number of rolls
					value = {
						dice: match[0]+'d6',
						dice_rolls: match[0]
					};
				}
				else {
					//Dice based on die sides
					value = {
						dice: '1d'+match[0],
						dice_sides: match[0]
					};
				}
			}
		}

		return {
			value: value,
			original: original
		}
	}

}

