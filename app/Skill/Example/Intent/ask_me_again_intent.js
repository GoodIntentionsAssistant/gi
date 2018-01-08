/**
 * Ask me again
 */
const Intent = require('../../../../src/Intent/intent');

module.exports = class AskMeAgainIntent extends Intent {

	setup() {
    this.train(['ask me again'], { collection:'strict' });
    
		this.parameter('ask_again', {
      name: 'Ask again',
      entity: 'App.Common.Entity.Confirm'
		});
	}

	response(request) {
    request.attachment('action','Yes');
    request.attachment('action','No');

		request.expect({
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

