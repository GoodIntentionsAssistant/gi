/**
 * Debug Skill
 */
var Skill = require('../../../src/Skill/skill');

module.exports = class DebugSkill extends Skill {

/**
 * Constructor
 *
 * @param App app
 * @access public
 * @return void
 */
  constructor(app) {
    super(app);

    app.on('app.understand.match', (data) => {
      console.log('Understand Match');
      console.log(data);
    });
  }

}