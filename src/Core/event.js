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
  constructor(App) {
    this.App = App;
  }


/**
 * Emit
 *
 * @param string event_name
 * @param any ...args
 * @access public
 * @return void
 */
  emit(event_name, ...args) {
    return this.App.emit(event_name, args);
  }

}