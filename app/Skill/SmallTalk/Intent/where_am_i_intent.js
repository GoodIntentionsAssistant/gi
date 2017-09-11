// Time zone
	
const Intent = require('../../../../src/Intent/intent');
var moment = require('moment-timezone');

module.exports = class TimezoneIntent extends Intent {

	setup() {
		this.name = 'Timezone';
		this.trigger = 'where am i';
		this.synonyms = [
		];
		this.entities = {
		};
		this.parameters = {
			"location": {
				name: "Location",
				entity: ["Common/Country","Common/City"],
				required: false,
				action: 'specified',
				from_user: true
			}
		};
	}


	response(request) {
		request.expecting.set({
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
