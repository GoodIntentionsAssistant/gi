/**
 * Skill Registry
 */

const ObjectRegistry = require('../Core/object_registry.js');

module.exports = class SkillRegistry extends ObjectRegistry {

/**
 * Constructor
 *
 * @param object app
 * @access public
 * @return void
 */
	constructor(app) {
		super(app);
		this.type = 'Skill';
	}


/**
 * After load
 *
 * @access public
 * @return void
 */
  after_load(skill) {
		skill.setup();
		skill.load();
	}


}