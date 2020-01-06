/**
 * Request Ping
 */
const Request = require('../request.js');

module.exports = class RequestPing extends Request {

/**
 * Process
 * 
 * @returns {boolean}
 */
  process() {
    this.attachment('ping');
    this.result();
    return true;
  }


}
