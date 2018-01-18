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
      app.request({
        client_id: data.client.ident,
        session: data.session,
        intent: 'App.Welcome.Intent.Welcome'
      });
    });
  }

}