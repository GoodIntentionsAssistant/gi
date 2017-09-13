/**
 * Time Skill
 */
var Skill = require('../../../src/Skill/skill');

module.exports = class TimeSkill extends Skill {

/**
 * Constructor
 *
 * @param App app
 * @access public
 * @return void
 */
	constructor(app) {
		super(app);
		this.name = 'App.Time';
	}

}