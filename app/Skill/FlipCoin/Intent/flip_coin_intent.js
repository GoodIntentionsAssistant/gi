/**
 * Flip Coin Intent
 */
	
const Intent = require('../../../../src/Intent/intent');
var _ = require('underscore');
var extend = require('extend');

module.exports = class FlipCoinIntent extends Intent {

	setup() {
		this.train([
      'flip coin',
      'toss coin',
      'coin toss',
      'flip penny',
      'throw coin'
    ]);

		this.parameter('flips', {
      name: "Flips",
      entity: 'App.Common.Entity.Number',
      required: false,
      default: 1
    });
	}

	response(request) {
    let results = [];
    let flips = request.parameters.value('flips');

    for(let ii=0; ii < flips; ii++) {
      let flip = _.random(1, 2);
      if(flip == 1) {
        results.push('Heads');
      }
      else if(flip == 2) {
        results.push('Tails');
      }
    }

    let output = results.join(', ');

		return output;
	}

}

