/**
 * Reminder List Intent
 */
const Intent = require('../../../../src/Intent/intent');
const moment = require('moment');

module.exports = class ReminderListIntent extends Intent {

  setup(app) {
    this.train([
      'tell me my reminders',
      'what are my reminders',
      'upcoming reminders',
      'future reminders',
      'my reminders',
      'list reminders'
    ]);
  }


  response(request) {
    let output = [];

    let reminders = request.app.Scheduler.find_by_session_id(request.session.session_id);

    if(reminders.length == 0) {
      output.push('You have no reminders set');
    }
    else if(reminders.length == 1) {
      output.push('You have one reminder set in ' + reminders[0].data.when.from(moment()));
    }
    else {
      output.push('You have '+reminders.length+' reminders set')
    }

    return output;
  }

}