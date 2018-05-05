/**
 * Custom Event Page Visit Example
 */
const Intent = require('../../../../src/Intent/intent');

module.exports = class CustomEventPageVisitIntent extends Intent {

	setup() {

	}


	response(request) {
    let url = request.parameters.value('url');

    if(url.indexOf('/overview/events') === -1) {
      return true;
    }

    return 'You are now on the event page. This is a custom event!';
	}

}

