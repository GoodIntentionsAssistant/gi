/**
 * Skill Registry
 */

const ObjectRegistry = require('../Core/object_registry.js');

module.exports = class SkillRegistry extends ObjectRegistry {

/**
 * Constructor
 *
 * @param object app
 * @return void
 */
	constructor(app) {
		super(app);
		this.type = 'Skill';
	}


/**
 * After load
 *
 * @return void
 */
  after_load(skill) {
		skill.path = '';

		skill.setup();
		skill.load();
	}


}