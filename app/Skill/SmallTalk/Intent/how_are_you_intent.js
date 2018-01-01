/**
 * How are you Intent
 */
const Intent = require('../../../../src/Intent/intent');
const _ = require('underscore');

module.exports = class HowAreYouIntent extends Intent {

	setup() {
		this.train([
			'how are you',
			'how do you feel'
		],{
			collection: 'strict'
		});
		
		this.train([
			'i feel',
			'feeling',
			'@App.Common.Entity.Emotion'
		]);

		this.parameter('user_emotion',{
			name: "User Emotion",
			entity: 'App.Common.Entity.Emotion',
			action: 'user_emotion'
		});
	}

	response(request) {
		if(request.session.data('feeling')) {
			var value = request.session.data('feeling');
			return "I'm still feeling "+value;
		}

		var entity = request.app.EntityRegistry.get('App.Common.Entity.Emotion');
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

