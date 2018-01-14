/**
 * Welcome Intent
 */
'use strict';

const Intent = require('../../../../src/Intent/intent');

module.exports = class WelcomeIntent extends Intent {

  setup() {
  }

  response(request) {
    request.attachment('display', true);
    return 'Welcome to Good Intentions!';
  }

}

