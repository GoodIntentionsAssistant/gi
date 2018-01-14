/**
 * Scheduler
 */
const Randtoken = require('rand-token');
const schedule = require('node-schedule');
const moment = require('moment');

module.exports = class Scheduler {

/**
 * Constructor
 *
 * @param object app
 * @access public
 * @return void
 */
  constructor(app) {
    this.scheduled = {};
    this.upcoming = [];

    this.app = app;

    app.on('app.loop', (data) => {
      this.check();
    });
  }


/**
 * Check
 *
 * @todo Optimise scheduler with another array that stores upcoming in the next hour
 * @access public
 * @return bool
 */
  check() {
    if(this.upcoming.length == 0) {
      return;
    }
  }


/**
 * Trigger a scheduled event
 *
 * @param int scheduler_id
 * @access public
 * @return bool
 */
  trigger(scheduler_id) {
    let schedule = this.find(scheduler_id);

    if(!schedule) {
      return false;
    }

    this.app.Event.emit('scheduler.trigger.'+schedule.type, {
      schedule: schedule.data
    });

    this.remove(scheduler_id);

    return true;
  }


/**
 * Add
 *
 * @param string type
 * @param int session_id users session id
 * @param hash data
 * @access public
 * @return bool
 */
  add(type, session_id, data) {
    let schedule_id = Randtoken.generate(16);

    //Convert momentjs to javascript date
    let when = data.when.toDate();

    //Create scheduled job
    let job = schedule.scheduleJob(schedule_id, when, () => {
      this.trigger(schedule_id);
    });

    //Add to hash
    this.scheduled[schedule_id] = {
      job: job,
      type: type,
      data: data
    };

    return true;
  }


/**
 * Check
 *
 * @param int schedule_id
 * @access public
 * @return mixed
 */
  find(schedule_id) {
    if(!this.scheduled[schedule_id]) {
      return false;
    }
    return this.scheduled[schedule_id];
  }


/**
 * Cancel
 *
 * @access public
 * @return bool
 */
  cancel(scheduler_id) {
    this.scheduled[schedule_id].cancel();
    this.remove(schedule_id);
  }


/**
 * Remove
 *
 * @access public
 * @return bool
 */
  remove(scheduler_id) {
    delete this.scheduled[scheduler_id];
  }

}