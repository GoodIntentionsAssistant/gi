// Survey
	
var Intent = require('../../../../src/Intent/intent');

function SurveyIntent() {
	var methods = {
		name: 'Survey',
		trigger: 'take survey',
		synonyms: [
		],
		entities: {
		}
	}
	methods.__proto__ = Intent()


	methods.response = function(request) {
		request.session.set_expecting({
			intent: this,
			entity: 'Common/Confirm',
			force: true,
			action: {
				'yes': 'what_sport',
				'no': 'watch_online'
			},
			save_answer: {
				'name': 'Watch sports on TV',
				'key': 'survey.sports_tv'
			}
		});
		request.attachment.add_action('Yes');
		request.attachment.add_action('No');
		return 'Do you watch sports TV?';
	}
	

	methods.what_sport = function(request) {
		request.session.set_expecting({
			intent: this,
			force: true,
			action: 'watch_online',
			save_answer: {
				'name': 'Sport watched the most',
				'key': 'survey.sport_most_watched'
			}
		});
		return 'Which sports do you watch the most?';
	}
	

	methods.watch_online = function(request) {
		request.session.set_expecting({
			intent: this,
			force: true,
			entity: 'Common/Confirm',
			action: 'finished',
			save_answer: {
				'name': 'Watch online',
				'key': 'survey.watch_sport_online'
			}
		});
		return 'Ok. And do you watch sports online?';
	}


	methods.finished = function(request) {
		var output = ['Great, thanks for participatating. Here are your answers.'];

		var data = request.session.data('survey');

		for(var key in data) {
			output.push(data[key].name+': '+data[key].result);
		}

		return output;
	}

	return methods
}


module.exports = SurveyIntent;
