
const colors = require('colors');


/**
 * Verbose
 * 
 * @param {*} msg Message to log
 * @param {Object} options Options
 * @returns {boolean}
 */
exports.verbose = function(msg, options = {}) {
  //New line before outputting
  if(options.new_line) {
    this.nl();
  }

  //Prefix output
  if(options.prefix) {
    msg = '['+options.prefix.dim+'] '+msg;
  }

  //Message
  if(typeof msg !== "object") {
    msg = [msg];
  }
  for(let ii=0; ii<msg.length; ii++) {
    if(!options.color) {
      options.color = 'white';
    }
    
    console.log(colors[options.color](msg[ii]));
  }

  //Error stack and message
  if(options && options.error) {
    console.log(options.error.message);
    console.log(options.error.stack);
  }

  return true;
}


/**
 * New line
 * 
 * @returns {boolean}
 */
  exports.nl = function() {
    console.log('');
    return true;
  }


/**
 * Info
 * 
 * @param {*} msg Message to log
 * @param {Object} options Options
 * @returns {boolean}
 */
  exports.info = function(msg, options = {}) {
    options.color = 'white';
    return this.verbose(msg, options);
  }


/**
 * Mute
 * 
 * @param {*} msg Message to log
 * @param {Object} options Options
 * @returns {boolean}
 */
  exports.mute = function(msg, options = {}) {
    options.color = 'gray';
    return this.verbose(msg, options);
  }


/**
 * Success
 * 
 * @param {*} msg Message to log
 * @param {Object} options Options
 * @returns {boolean}
 */
  exports.success = function(msg, options = {}) {
    options.color = 'green';
    return this.verbose(msg, options);
  }


/**
 * Error
 * 
 * @param {*} msg Message to log
 * @param {Object} options Options
 * @returns {boolean}
 */
  exports.error = function(msg, options = {}) {
    options.color = 'red';
    return this.verbose(msg, options);
  }


/**
 * Fatal error
 * 
 * @param {*} msg Message to log
 * @param {Object} options Options
 */
  exports.fatal = function(msg, options = {}) {
    options.color = 'red';
    this.verbose(msg, options);
    process.exit(1);
  }


/**
 * Warn
 * 
 * @param {*} msg Message to log
 * @param {Object} options Options
 * @returns {boolean}
 */
  exports.warn = function(msg, options = {}) {
    options.color = 'yellow';
    return this.verbose(msg, options);
  }


/**
 * Debug
 * 
 * @param {*} msg Message to log
 * @param {Object} options Options
 * @returns {boolean}
 */
  exports.debug = function(msg, options = {}) {
    options.color = 'blue';
    return this.verbose(msg, options);
  }