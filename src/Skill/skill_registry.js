/**
 * Skill Registry
 */

const ObjectRegistry = require('../Core/object_registry.js');

module.exports = class SkillRegistry extends ObjectRegistry {

/**
 * Constructor
 *
 * @constructor
 * @param {Object} app App instance
 */
	constructor(app) {
		super(app);
		this.type = 'Skill';
	}


/**
 * After load
 *
 * @param {Object} skill Skill instance
 * @returns {boolean} Success
 */
  after_load(skill) {
		skill.path = '';

		skill.setup();
		skill.load();

		return true;
	}


}