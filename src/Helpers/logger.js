
const colors = require('colors');


/**
 * Verbose
 * 
 * @param {string} msg Message to log
 * @param {string} options Options
 * @returns {boolean}
 */
exports.verbose = function(msg, options = {}) {
  if(options.prefix) {
    msg = options.prefix+': '+msg;
  }

  console.log(msg);

  if(options && options.error) {
    console.log(options.error.message);
    console.log(options.error.stack);
  }

  return true;
}


/**
 * Log
 * 
 * @param {string} msg Message to log
 * @param {string} options Options
 * @returns {boolean}
 */
  exports.info = function(msg, options) {
    return this.verbose(msg.green, options);
  }


/**
 * Error
 * 
 * @param {string} msg Message to log
 * @param {string} options Options
 * @returns {boolean}
 */
  exports.error = function(msg, options) {
    return this.verbose(msg.red, options);
  }


/**
 * Warn
 * 
 * @param {string} msg Message to log
 * @param {string} options Options
 * @returns {boolean}
 */
  exports.warn = function(msg, options) {
    return this.verbose(msg.magenta, options);
  }


/**
 * Debug
 * 
 * @param {string} msg Message to log
 * @param {string} options Options
 * @returns {boolean}
 */
  exports.debug = function(msg, options) {
    return this.verbose(msg.blue, options);
  }