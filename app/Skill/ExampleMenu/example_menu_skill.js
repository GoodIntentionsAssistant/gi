/**
 * Example Menu Skill
 */
var Skill = require('../../../src/Skill/skill');

module.exports = class ExampleMenuSkill extends Skill {

/**
 * Constructor
 *
 * @param App app
 * @access public
 * @return void
 */
	constructor(app) {
		super(app);
		this.name = 'App.ExampleMenu';
		this.intents = [
			'Order1'
		];
	}

}