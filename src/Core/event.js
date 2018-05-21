/**
 * Event
 */

module.exports = class Event {

/**
 * Constructor
 *
 * @access public
 * @return void
 */
  constructor(app) {
    this.app = app;
  }


/**
 * Emit
 *
 * @param string event_name
 * @param any ...args
 * @access public
 * @return void
 */
  emit(event_name, args = {}) {
    args.app = this.app;

    return this.app.emit(event_name, args);
  }

}