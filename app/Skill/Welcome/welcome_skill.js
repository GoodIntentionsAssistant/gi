/**
 * Welcome Skill
 */
var Skill = require('../../../src/Skill/skill');

module.exports = class WelcomeSkill extends Skill {

/**
 * Constructor
 *
 * @param App app
 * @access public
 * @return void
 */
  constructor(app) {
    super(app);

    //Onboarding
    app.on('auth.new', (data) => {
      app.request(data.client, {
        session: data.session,
        intent: 'App.Welcome.Intent.Welcome'
      });
    });
  }

}