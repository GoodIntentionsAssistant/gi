/**
 * Small Talk Skill
 */
var Skill = require('../../../src/Skill/skill');

module.exports = class SmallTalkSkill extends Skill {

/**
 * Constructor
 *
 * @param App app
 * @access public
 * @return void
 */
	constructor(app) {
		super();
		this.name = 'Small Talk';
		this.app = app;
	}

}