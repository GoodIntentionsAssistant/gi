// How are you
	
var Intent = require('../../../../src/Intent/intent');
var _ = require('underscore');

function HowAreYouIntent() {
	var methods = {
		name: 'How are you',
		trigger: 'how are you',
		synonyms: [
			"i'm feeling",
			"i feel",
			"how do you feel"
		],
		entities: {
			'Common/Emotion':{}
		},
		parameters: {
			"user_emotion": {
				name: "User Emotion",
				entity: 'Common/Emotion',
				action: 'user_emotion'
			}
		}
	}
	methods.__proto__ = Intent()

	methods.response = function(request) {
		if(request.session.data('feeling')) {
			var value = request.session.data('feeling');
			return "I'm still feeling "+value;
		}

		var entity = request.app.Entities.get('Common/Emotion');
		var data = entity.get_data();

		var positives = _.where(data,{ type:'positive' });
		var set = _.sample(positives);
		var value = _.sample(set.synonyms);

		request.session.set('feeling',value);

		var output = [];
		output.push("I'm "+value+'. How are you?');

		return output;
	}


	methods.user_emotion = function(request) {
		var emotion_key = request.param('user_emotion');

		var entity = request.app.Entities.get('Common/Emotion');
		var data = entity.find_data_by_key(emotion_key);

		if(data.type == 'positive') {
			return 'Happy to hear :)';
		}
		else {
			return 'Hope things get better soon!';
		}
	}


	return methods
}


module.exports = HowAreYouIntent;
