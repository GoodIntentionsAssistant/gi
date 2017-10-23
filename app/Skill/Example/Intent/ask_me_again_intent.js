/**
 * Ask me again
 */
const Intent = require('../../../../src/Intent/intent');

module.exports = class AskMeAgainIntent extends Intent {

	setup() {
		this.name = 'Ask me again';

    this.train(['ask me again'], { classifier:'strict' });
    
		this.add_parameter('ask_again', {
      name: 'Ask again',
      entity: 'App.Common.Entity.Confirm'
		});
	}

	response(request) {
    request.attachment.add_action('Yes');
    request.attachment.add_action('No');

		request.expecting.set({
			action: 'chosen',
			force: true
		});

    return 'Ask me again?';
  }
  
  chosen(request) {
    var choice = request.parameters.value('ask_again');
    if(choice == 'yes') {
			return request.redirect('App.Example.Intent.AskMeAgain');
    }
    return 'OK that is enough';
  }

}

