/**
 * Log
 */
const fs = require('fs');
const moment = require('moment');
const Config = require('../Core/config.js');

module.exports = class Log {

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
 * Log
 * 
 * @param string msg
 * @access public
 * @return void
 */
  add(msg, ident) {
    if(ident) {
      msg = ident+': '+msg;
    }
    
    if(this.app.verbose) {
      console.log(msg);
    }
    this.write_log('system',msg);
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
    this.write_log('error',msg);
  }


/**
* Write to a log file
* 
* @param string type
* @param string msg
* @access public
* @return void
*/
  write_log(type, text) {
    //Disabled logging
    if(!Config.read('logging.enabled')) {
      return false;
    }

    var filename = this.app.Path.get('logs')+'/'+type+'/'+moment().format('MM-DD-YYYY')+'.txt'
    var line = moment().format('MM-DD-YYYY HH:mm:ss')+': '+text+"\n";

    fs.appendFile(filename, line, function (err) {
    });
  }

}