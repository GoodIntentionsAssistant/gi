/**
 * Reminder Skill
 */
const Skill = require('../../../src/Skill/skill');

module.exports = class ReminderSkill extends Skill {

/**
 * Constructor
 *
 * @param object app
 * @access public
 * @return void
 */
  constructor(app) {
    super(app);
  }

}