/**
 * Flip Coin Skill
 */
var Skill = require('../../../src/Skill/skill');

module.exports = class FlipCoinSkill extends Skill {

/**
 * Constructor
 *
 * @param App app
 * @access public
 * @return void
 */
	constructor(app) {
		super(app);
		this.name = 'App.FlipCoin';
	}

}