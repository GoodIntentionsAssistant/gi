/**
 * Request Ping
 */
const Request = girequire('/src/Request/request.js');

module.exports = class RequestPing extends Request {

/**
 * Process
 * 
 * @returns {boolean} Success
 */
  process() {
    this.attachment('ping');
    this.result();
    return true;
  }


}
