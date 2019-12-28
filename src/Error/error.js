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
 * Warning error
 * 
 * @param string message
 * @access public
 * @return void
 */
  warning(messages) {
    if(typeof messages !== "object") {
      messages = [messages];
    }

    console.log('Warning'.yellow.underline);

    for(let ii=0; ii<messages.length; ii++) {
      if(typeof messages[ii] === 'object') {
        messages[ii] = messages[ii].toString();
      }

      console.log(messages[ii].yellow);
    }
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
      let line = messages[ii];

      if(typeof line === 'object' && line.stack) {
        line = line.message + "\n" + line.stack;
      }
      else if(typeof line === 'object') {
        line = line.toString();
      }

      console.log(line.red);
    }

    process.exit(1);
  }

}