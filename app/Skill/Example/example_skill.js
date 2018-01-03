/**
 * Example Skill
 */
var Skill = require('../../../src/Skill/skill');

module.exports = class ExampleSkill extends Skill {

/**
 * Constructor
 *
 * @param App app
 * @access public
 * @return void
 */
	constructor(app) {
		super(app);
		this.intents = [];
	}

}