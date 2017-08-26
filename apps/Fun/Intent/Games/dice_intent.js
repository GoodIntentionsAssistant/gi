// Rock Paper Scissors
	
var Intent = require('../../../../src/Intent/intent');
var _ = require('underscore');
var extend = require('extend');

function DiceIntent() {
	var methods = {
		name: 'Dice',
		trigger: 'roll',
		synonyms: ['rolling'],
		parameters: {
			"die": {
				name: "Choice",
				entity: 'Fun/Dice'
			}
		}
	}
	methods.__proto__ = Intent()

	methods.response = function(request) {
		var die = request.param('die');

		_options = {
			dice: '1d6',
			dice_rolls: 1,
			dice_sides: 5,
			dice_modifier: false
		};
		options = extend(_options, die);

		var rolls = [];
		var answer = 0;

		//Ensure ints
		options.dice_rolls = parseInt(options.dice_rolls);
		options.dice_sides = parseInt(options.dice_sides);

		//Roll the dice
		for(var roll_count=1; roll_count<=options.dice_rolls; roll_count++) {
			var roll = _.random(1, options.dice_sides);
			rolls.push(roll);
			answer += roll;
		}

		//Check modifier
		if(options.dice_modifier) {
			var num = parseInt(options.dice_modifier.replace(/[^0-9]/g,''));
			if(options.dice_modifier.substr(0,1) == '+') {
				answer += num;
			}
			else if(options.dice_modifier.substr(0,1) == '-') {
				answer -= num;
			}
		}

		var output = 'Rolled '+answer;

		request.attachment.add_field({
			title: "Dice",
			value: options.dice
		});

		request.attachment.add_field({
			title: "Rolls",
			value: rolls.join(' ')
		});

		return output;
	}

	return methods
}


module.exports = DiceIntent;
