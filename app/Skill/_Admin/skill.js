/**
 * Admin Skill
 */
var Skill = require('../../../src/Skill/skill');

module.exports = class AdminSkill extends Skill {

/**
 * Constructor
 *
 * @param App app
 * @access public
 * @return void
 */
	constructor(app) {
		super();
		this.name = 'Admin';
		this.app = app;
	}

}