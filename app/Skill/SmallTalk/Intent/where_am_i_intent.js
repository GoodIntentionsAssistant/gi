/**
 * Where am i Intent
 */
const Intent = require('../../../../src/Intent/intent');
const moment = require('moment-timezone');

module.exports = class WhereAmIIntent extends Intent {

	setup() {
		this.name = 'Where am i';
		this.trigger = 'where am i';
		this.synonyms = [
		];
		this.entities = {
		};
		this.parameters = {
			"location": {
				name: "Location",
				entity: ["App.Common.Entity.Country","App.Common.Entity.City"],
				required: false,
				action: 'specified',
				slotfill: true
			}
		};
	}


	response(request) {
		request.expect({
      force: true,
      action: 'specified'
		});
		return "I don't know, where are you?";
	}


	specified(request) {
    var location = request.parameters.get('location.matched.label');
    
    if(!location) {
      return "Nice, but I don't know that place yet. I'm still learning!";
    }

		return 'Nice, I heard '+location+' is nice';
	}

}
