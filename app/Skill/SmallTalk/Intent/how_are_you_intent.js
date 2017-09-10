// How are you
	
var Intent = require('../../../../../src/Intent/intent');
var _ = require('underscore');

module.exports = class HowAreYouIntent extends Intent {

	setup() {
		this.name = 'How are you';
		this.trigger = 'how are you';
		this.synonyms = [
			"i'm feeling",
			"i feel",
			"how do you feel"
		];
		this.entities = {
			'Common/Emotion':{}
		};
		this.parameters = {
			"user_emotion": {
				name: "User Emotion",
				entity: 'Common/Emotion',
				action: 'user_emotion'
			}
		};
	}

	response(request) {
		if(request.session.data('feeling')) {
			var value = request.session.data('feeling');
			return "I'm still feeling "+value;
		}

		var entity = request.app.EntityRegistry.get('Common/Emotion');
		var data = entity.get_data();

		var positives = _.where(data,{ type:'positive' });
		var set = _.sample(positives);
		var value = _.sample(set.synonyms);

		request.session.set('feeling',value);

		var output = [];
		output.push("I'm "+value+'. How are you?');

		return output;
	}


	user_emotion(request) {
		let emotion_key = request.parameters.value('user_emotion');
		let type = request.parameters.get('user_emotion.matched.type');

		if(type == 'positive') {
			return 'Happy to hear :)';
		}
		else {
			return 'Hope things get better soon!';
		}
	}

}

