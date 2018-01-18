/**
 * Reminder Intent
 */
const Intent = require('../../../../src/Intent/intent');
const _ = require('underscore');
const moment = require('moment');

module.exports = class ReminderIntent extends Intent {

  setup(app) {
    this.train([
      'reminder',
      'reminders',
      'notification',
      'notifications',
      'remind',
      'remind me',
      'notify me'
    ]);

    this.parameter('when', {
      name: 'When',
      entity: 'App.Common.Entity.Date'
    });

    this.parameter('which', {
      name: 'Which',
      data: {
        'last': {
          'synonyms': ['previous']
        },
        'next': {
          'synonyms': []
        },
        'all': {
          'synonyms': ['everything']
        }
      }
    });

    this.parameter('cancel', {
      name: 'Cancel',
      entity: 'App.Common.Entity.Cancel',
      action: 'cancel'
    });

    //Listen for the reminder trigger
    this.app.on('scheduler.trigger.reminder', (data) => {
      let session = this.app.Auth.identify(data.schedule.session_id);

      this.app.request({
        client_id: data.schedule.client_id,
        session: session,
        intent: 'App.Reminder.Intent.Reminder',
        action: 'send',
        schedule_data: data.schedule,
        fast: true
      });
    });
  }

  response(request) {
    let when_val = request.parameters.get('when.value');
    let when_str = request.parameters.get('when.string');
    let when_obj = moment(when_val);

    //Check it's not before now
    if(when_obj < moment()) {
      return 'You cannot set a reminder in the past';
    }

    //Clean up text
    let reminder_text = this._reminder_text(request.utterance.text(), when_str);

    //Add to scheduler
    //Reminder skill will listen for this type of schedule and route it back to ::send
    request.app.Scheduler.add('reminder', {
      when: when_obj,
      client_id: request.client.client_id,
      session_id: request.session.session_id,
      text: reminder_text
    });

    //From
    let from = when_obj.from(moment());

    return 'Added reminder '+from;
  }


  _reminder_text(str, when_str) {
    str = str.replace(when_str, '');

    //Remove all trained keywords
    let keywords = this.keywords();
    let output = [];
    for(let ii=0; ii<keywords.length; ii++) {
      output.push(keywords[ii].keyword);
    }

    //Sort by longest keyword first
    output.sort(function(a, b){
      return b.length - a.length;
    });

    //Replace each of these trained words
    for(let ii=0; ii<output.length; ii++) {
      let re = new RegExp(output[ii], 'gi');
      str = str.replace(re, '');
    }

    //Remove starting 'to'
    str = str.trim().replace(/^to/i,'');

    str = str.trim(str);

    return str;
  }


  cancel(request) {
    return 'Reminder has been cancelled';
  }


  send(request) {
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

