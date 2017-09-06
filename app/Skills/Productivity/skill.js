/**
 * Productivity Skill
 */
var Skill = require('../../../src/Skill/skill');

module.exports = class ProductivitySkill extends Skill {

/**
 * Constructor
 *
 * @param App app
 * @access public
 * @return void
 */
	constructor(app) {
		super();
		this.name = 'Productivity';
		this.app = app;
	}

}