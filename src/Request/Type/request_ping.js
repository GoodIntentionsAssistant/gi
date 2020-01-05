/**
 * Request Ping
 */
const Request = require('../request.js');

module.exports = class RequestPing extends Request {

/**
 * Constructor
 *
 * @param object app
 * @param string ident
 * @access public
 * @return void
 */
  constructor(app, ident) {
    super(app, ident);
  }

/**
 * Process
 * 
 * @access public
 * @return boolean
 */
  process() {
    this.result('pong');
    return true;
  }


}
