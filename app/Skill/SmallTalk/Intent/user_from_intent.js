/**
 * User From Intent
 */
const Intent = require('../../../../src/Intent/intent');

module.exports = class UserFromIntent extends Intent {

	setup() {
		this.train([
			'where am I?'
		]);

    //Ignore PRP$ Possessive pronoun
    this.reject('#PRP$');
	}

	response(request) {
		//User city set
		if(request.user.has('city')) {
			return 'You told me you was in '+request.user.get('city');
		}

    request.expect({
      action: 'reply',
      entity: 'App.Common.Entity.City',
      force: true
    });

		return 'I don\'t know, what city are you from?';
	}

	reply(request) {
		let city = request.parameters.value('expects');

		request.user.set('city', city);

		return 'I\'ve heard '+city+' is nice'
	}

}

