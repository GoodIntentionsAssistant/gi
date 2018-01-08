/**
 * How old are you Example
 */
const Intent = require('../../../../src/Intent/intent');

module.exports = class HowOldAreYouIntent extends Intent {

	setup() {
		this.train([
      'how old are you',
      'what is your age'
		]);
	}

	response(request) {
		request.expect({
			action: 'reply',
			force: true
		});
    return [
      'I have no age, I am a bot!',
      'How old are you?'
    ];
  }
  
  reply(request) {
    return 'OK, you are '+request.input.text;
  }

}

