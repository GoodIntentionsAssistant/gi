/**
 * Error
 */

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
  fatal(message) {
    console.log(message);
    process.exit();
  }

}