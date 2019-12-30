/**
 * Log
 */
const Config = require('../Config/config.js');

module.exports = class Log {

/**
 * Constructor
 *
 * @return void
 */
  constructor(app) {
    this.app = app;
  }

/**
 * Log
 * 
 * @param string msg
 * @return void
 */
  add(msg, ident) {
    if(ident) {
      msg = ident+': '+msg;
    }
    
    if(this.app.verbose) {
      console.log(msg);
    }
  }


/**
* Error
* 
* @param string msg
* @access public
* @return void
*/
  error(msg, options) {
    if(options && options.ident) {
      msg = options.ident+': '+msg;
    }

    this.add(msg);
  }

}