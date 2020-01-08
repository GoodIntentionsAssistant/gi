/**
 * Scheduler
 */
const Logger = girequire('/src/Helpers/logger');

const Randtoken = require('rand-token');
const schedule = require('node-schedule');
const dotty = require("dotty");

module.exports = class Scheduler {

/**
 * Constructor
 *
 * @constructor
 * @param {Object} app App instance
 */
  constructor(app) {
    this.scheduled = {};
    this.app = app;
  }


/**
 * Trigger a scheduled event
 *
 * @param {string} scheduler_id Scheduler id
 * @returns {boolean} If triggered
 */
  trigger(scheduler_id) {
    let schedule = this.find(scheduler_id);

    if(!schedule) {
      Logger.warn(`Scheduler "${scheduler_id}" was triggered but could not found`);
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
 * @param {string} type Type of schedule
 * @param {Object} data Settings for data
 * @returns {boolean} If added to scheduler
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
      job,
      type,
      data
    };

    return true;
  }


/**
 * Check
 *
 * @param {string} schedule_id Schedule id
 * @returns {*} False if not found, otherwise the schedule object
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
 * @param {string} session_id Session id
 * @returns {string[]} Array of schedules
 */
  find_by_session_id(session_id) {
    let output = [];

    for(let key in this.scheduled) {
      //Get the session id for this
      let _session_id = dotty.get(this.scheduled[key], 'data.session_id');
      
      if(_session_id !== session_id) {
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
 * @param {string} scheduler_id Scheduler id
 * @returns {boolean} Success of canceling scheduled job
 */
  cancel(scheduler_id) {
    this.scheduled[scheduler_id].cancel();
    return this.remove(scheduler_id);
  }


/**
 * Remove
 *
 * @param {string} scheduler_id Scheduler id
 * @returns {boolean} Success of removing scheduled job
 */
  remove(scheduler_id) {
    delete this.scheduled[scheduler_id];
    return true;
  }

}