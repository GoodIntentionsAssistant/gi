/**
 * Reminder Create Intent
 */
const Intent = require('../../../../src/Intent/intent');
const _ = require('underscore');
const moment = require('moment');

module.exports = class ReminderCreateIntent extends Intent {

  setup(app) {
    this.train([
      'reminder',
      'reminders',
      'notification',
      'notifications',
      'remind',
      'remind me',
      'notify me',
      'set reminder for'
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

    return 'Added reminder '+from +' to "'+reminder_text+'"';
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

    //Remove starting words
    str = str.trim().replace(/^to/i,'');
    str = str.trim().replace(/^about/i,'');

    str = str.trim(str);

    return str;
  }

}

