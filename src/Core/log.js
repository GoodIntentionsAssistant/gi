/**
 * Log
 */
const Config = require('../Config/config.js');

module.exports = class Log {

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
 * Log
 * 
 * @param {string} msg Message to log
 * @param {string} prefix Identification to prefix
 * @returns {boolean}
 */
  add(msg, prefix) {
    if(prefix) {
      msg = prefix+': '+msg;
    }
    
    if(this.app.verbose) {
      console.log(msg);
    }

    return true;
  }


/**
 * Error
 * 
 * @todo Clean up the options and make it like add
 * @param {string} msg Message to log
 * @param {Object} options Options for printing
 * @returns {boolean}
 */
  error(msg, options) {
    if(options && options.ident) {
      msg = options.ident+': '+msg;
    }

    return this.add(msg);
  }

}