/**
 * Event
 */
const _ = require('underscore');

module.exports = class Event {

/**
 * Constructor
 *
 * @constructor
 * @param {Object} app App instance
 */
  constructor(app) {
    this.app = app;
  }


/**
 * Emit event
 *
 * @param {string} event_name Event name to emit
 * @param {*} args Arguments to pass to emitter
 * @returns {boolean} Success of emitting
 */
  emit(event_name, args = {}) {
    args.app = this.app;

    //Events to ignore verbose
    let ignore = ['app.loop'];

    if(_.indexOf(ignore, event_name) !== 0) {
      let listeners = this.app.listeners(event_name);
      if(listeners.length > 0) {
        //this.app.Log.add(`Event emit, ${event_name}`);
      }
    }

    return this.app.emit(event_name, args);
  }

}