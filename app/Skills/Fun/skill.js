/**
 * Fun Skill
 */
var Skill = require('../../../src/Skill/skill');

module.exports = class FunSkill extends Skill {

/**
 * Constructor
 *
 * @param App app
 * @access public
 * @return void
 */
	constructor(app) {
		super();
		this.name = 'Fun';
		this.app = app;
	}

}