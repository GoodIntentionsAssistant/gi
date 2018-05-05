/**
 * Example Skill
 */
var Skill = require('../../../src/Skill/skill');

module.exports = class ExampleSkill extends Skill {

/**
 * Constructor
 *
 * @param App app
 * @access public
 * @return void
 */
	constructor(app) {
		super(app);
		this.intents = [];

    //Dispatch example
    app.on('request.call', (data) => {
      if(data.identifier === 'App.Example.Intent.Boing') {
        console.log('Boing redirect was called!');
      }
    });

    //Onboarding
    app.on('custom.page-visit', (data) => {
      app.request({
        client_id: data.client.client_id,
        session_id: data.session.session_id,
        intent: 'App.Example.Intent.CustomEventPageVisit',
        data: data.data
      });
    });
	}

}