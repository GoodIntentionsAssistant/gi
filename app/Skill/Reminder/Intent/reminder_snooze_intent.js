/**
 * Reminder Snooze Intent
 */
const Intent = require('../../../../src/Intent/intent');
const moment = require('moment');

module.exports = class ReminderSnoozeIntent extends Intent {

  setup(app) {
    this.train([
      'snooze',
      'snooze reminder'
    ]);
  }

  response(request) {
    return [];
  }

}