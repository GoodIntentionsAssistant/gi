/**
 * Survey Example
 */
var Intent = require('../../../../src/Intent/intent');

module.exports = class SurveyIntent extends Intent {

	setup() {
		this.train([
			'take survey'
		]);
	}

	response(request) {
		request.expecting.set({
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
		request.attachment('action','Yes');
		request.attachment('action','No');
		return 'Do you watch sports TV?';
	}
	

	what_sport(request) {
		request.expecting.set({
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
	

	watch_online(request) {
		request.expecting.set({
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


	finished(request) {
		let output = ['Great, thanks for participatating. Here are your answers.'];
		let data = request.session.data('survey');

		for(let key in data) {
			output.push(data[key].name+': '+data[key].result);
		}

		return output;
	}

}
