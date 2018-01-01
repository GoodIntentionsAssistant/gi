/**
 * Guess number intent
 */
const Intent = require('../../../../src/Intent/intent');
var _ = require('underscore');

module.exports = class GuessNumberIntent extends Intent {

	setup() {
		this.train([
			'guess number game'
		]);

		this.parameter('guess', {
			name: "Number",
			entity: "App.Common.Entity.Number",
			required: false,
      action: 'guess'
		});
	}

  after_request(request) {
    //Dont set expecting if the number has been reset
    if(!request.session.has('guess_number')) {
      return;
    }

    request.expecting.set({
      entity: 'App.Common.Entity.Number',
      fail: 'invalid',
      force: true
    });
  }

	response(request) {
    let number = _.random(1, 100);
    request.session.set('guess_number', number);
    return 'Ok, I am thinking of a number between 1 and 100. Guess my number!';
	}

  invalid(request) {
    return 'You must type in a number between 1 and 100';
  }

  guess(request) {
    let number = request.session.get('guess_number');
    let guess = request.parameters.value('guess');

    if(guess == number) {
      request.session.remove('guess_number');
      return 'Well done, my number was '+number+'!';
    }

    if(guess < number) {
      return 'Higher!';
    }
    else if(guess > number) {
      return 'Lower!'
    }

  }

}

