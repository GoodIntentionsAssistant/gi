/**
 * Scheduler
 */
const Randtoken = require('rand-token');
const schedule = require('node-schedule');
const moment = require('moment');
const dotty = require("dotty");

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
 * @param hash data
 * @access public
 * @return bool
 */
  add(type, data) {
    let schedule_id = Randtoken.generate(16);

    //If request has been passed in data we'll use that for the session and client id
    //This makes putting in a scheduled job in intents quicker
    //The request object must be removed from data because it'll add overhead to the job
    if(data.request) {
      data.client_id = data.request.client.client_id;
      data.session_id = data.request.session.session_id;
      delete data.request;
    }

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
 * Find by session_id
 *
 * @param int session_id
 * @access public
 * @return array
 */
  find_by_session_id(session_id) {
    let output = [];

    for(let key in this.scheduled) {
      //Get the session id for this
      let _session_id = dotty.get(this.scheduled[key], 'data.session_id');
      if(_session_id != session_id) {
        continue;
      }

      //Session matches
      output.push(this.scheduled[key]);
    }

    return output;
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