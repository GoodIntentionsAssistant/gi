// Modifier
	
var Entity = require('../../../src/Entity/entity');

function DiceEntity() {
	var entity = {
		name: "Dice",
		data: {
		}
	}
	entity.__proto__ = Entity()

	entity.parse = function(string) {
		var original = null;
		var value = null;

		//Standard notation
		//[\d+]?d\d+[\+|\-]?\d*
		var matches = string.match(/(\d+)?d((\d+)([+-]\d+)?)?$/);

		if(matches) {
			var rolls = matches[1] ? matches[1] : 1;
			var sides = matches[3] ? matches[3] : 6;

			//Maximums
			if(rolls > 12) { rolls = 12; }
			if(sides > 12) { sides = 12; }

			var dice = rolls+'d'+sides;

			value = {
				dice: dice,
				dice_rolls: rolls,
				dice_sides: sides,
				dice_modifier: matches[4]
			};

			original = matches.input;
		}

		return {
			value: value,
			original: original
		}
	}

	return entity
}

module.exports = DiceEntity;
