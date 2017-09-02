// Flip coin
	
var Intent = require('../../../../src/Intent/intent');
var _ = require('underscore');
var extend = require('extend');

function FlipCoinIntent() {
	var methods = {
		name: 'Dice',
		trigger: 'flip coin',
		synonyms: [
      'toss coin',
      'coin toss',
      'flip penny',
      'throw coin'
    ]
	}
	methods.__proto__ = Intent()

	methods.response = function(request) {
    //About a 1 in 6000th chance the coin lands on its edge
    let flip = _.random(1, 6001);
    let output;

    if(flip == 1) {
      output = 'Landed on its edge!';
    }
    else if(flip > 1 && flip <= 3000) {
      output = 'Heads';
    }
    else if(flip > 3000 && flip <= 6001) {
      output = 'Tails';
    }

		return output;
	}

	return methods
}


module.exports = FlipCoinIntent;
