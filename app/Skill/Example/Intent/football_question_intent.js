/**
 * Football question Example
 */
const Intent = require('../../../../src/Intent/intent');

module.exports = class FootballQuestionIntent extends Intent {

	setup() {
		this.train([
      'do you like football?'
		]);
	}

	response(request) {
    if(request.session.has('user.football')) {
      if(request.session.data('user.football') == 'yes') {
        return 'Yes I do and I know you love it too!';
      }
      else {
        return 'Yes I do and I know you don\'t enjoy it already';
      }
    }

		request.expecting.set({
      action: 'reply',
      entity: 'App.Common.Entity.Confirm',
      save_answer: 'football'
		});
    return [
      'Yes, I love football, do you?'
    ];
  }
  
  reply(request) {
    var value = request.parameters.value('football');
    if(value == 'yes') {
      return 'We will go to a game together soon!';
    }
    return 'Shame, not everyone enjoys it';
  }

}
