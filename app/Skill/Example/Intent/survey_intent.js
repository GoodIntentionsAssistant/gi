/**
 * Survey Example
 */
const Intent = require('../../../../src/Intent/intent');
const _ = require('underscore');

module.exports = class SurveyIntent extends Intent {

	setup() {
		this.train([
			'take survey'
		]);
	}

	response(request) {
		request.expect({
			entity: 'App.Common.Entity.Confirm',
			force: true,
			key: 'survey.do_you_watch_sports_tv',
			save_answer: true,
			action: {
				'yes': 'what_sport',
				'no': 'watch_online'
			}
		});
		request.attachment('action','Yes');
		request.attachment('action','No');
		return 'Do you watch sports TV?';
	}
	

	what_sport(request) {
		request.expect({
			force: true,
			action: 'watch_online',
			key: 'survey.most_watched_sports',
			save_answer: true
		});
		return 'Which sports do you watch the most?';
	}
	

	watch_online(request) {
		request.expect({
			force: true,
			entity: 'App.Common.Entity.Confirm',
			action: 'finished',
			key: 'survey.watch_sports_online',
			save_answer: true
		});
		request.attachment('action','Yes');
		request.attachment('action','No');
		return 'Ok. And do you watch sports online?';
	}


	finished(request) {
		let output = ['Great, thanks for participatating. Here are your answers.'];
		let data = request.session.user('survey');

		for(let key in data) {
			output.push(_.humanize(key)+': '+data[key]);
		}

		return output;
	}

}
