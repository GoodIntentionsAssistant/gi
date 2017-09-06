/**
 * Test Skill
 */
var Skill = require('../../../src/Skill/skill');

module.exports = class TestSkill extends Skill {

/**
 * Constructor
 *
 * @param App app
 * @access public
 * @return void
 */
	constructor(app) {
		super();
		this.name = 'Test';
		this.app = app;
	}

}