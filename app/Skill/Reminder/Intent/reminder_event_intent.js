/**
 * Reminder Event Intent
 */
const Intent = require('../../../../src/Intent/intent');

module.exports = class ReminderEventIntent extends Intent {

  setup(app) {
    //Listen for the reminder trigger
    this.app.on('scheduler.trigger.reminder', (data) => {
      this.app.request({
        client_id: data.schedule.client_id,
        session_id: data.schedule.session_id,
        intent: 'App.Reminder.Intent.ReminderEvent',
        schedule_data: data.schedule,
        fast: true
      });
    });
  }


  response(request) {
    let output = [];
    let reminder_text = request.input.schedule_data.text;

    if(reminder_text) {
      output.push('You asked me to remind you...');
      output.push(reminder_text)
    }
    else {
      output.push('This is your reminder');
    }

    return output;
  }

}