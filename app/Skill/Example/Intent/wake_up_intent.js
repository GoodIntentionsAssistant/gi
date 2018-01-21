/**
 * Wake up Intent
 */
const Intent = require('../../../../src/Intent/intent');
const moment = require('moment');

module.exports = class WakeupIntent extends Intent {

	setup() {
		this.train(['wake up'], {
      collection: 'strict'
    });

    this.app.on('scheduler.trigger.wakeup', (data) => {
      this.app.request({
        client_id: data.schedule.client_id,
        session_id: data.schedule.session_id,
        intent: 'App.Example.Intent.WakeUp',
        action: 'wakeup',
        schedule_data: data.schedule,
        skip_queue: true,
        fast: true
      });
    });
	}

	response(request) {
    request.app.Scheduler.add('wakeup', {
      when: moment().add(5, 'seconds'),
      request: request,
      text: 'Wake up (5 seconds)'
    });

    request.app.Scheduler.add('wakeup', {
      when: moment().add(10, 'seconds'),
      request: request,
      text: 'Wake up (10 seconds)'
    });

    return 'In 5 and 10 seconds I\'ll remind you to wake up using the scheduler';
	}

  wakeup(request) {
    return request.input.schedule_data.text;
  }

}

