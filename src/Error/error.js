/**
 * Error
 */
const colors = require('colors');

module.exports = class Error {

/**
 * Constructor
 * 
 * @access public
 * @return void
 */
  constructor() {
  }


/**
 * Fatal error
 * 
 * @param string message
 * @access public
 * @return void
 */
  fatal(messages) {
    if(typeof messages !== "object") {
      messages = [messages];
    }

    console.log('Fatal Error'.red.underline);

    for(let ii=0; ii<messages.length; ii++) {
      console.log(messages[ii].red);
    }

    process.exit(1);
  }

}