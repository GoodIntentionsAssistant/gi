/**
 * Response
 */

module.exports = class MessageResponse {

/**
 * Constructor
 *
 * @param object response
 * @access public
 * @return void
 */
  constructor(response) {
    this.response = response;
    this.request = response.request;
  }


/**
 * Send notice
 *
 * @param hash options
 * @access public
 * @return bool
 */
  send(options) {
    let data = {
      type:     'notice',
      ident:    this.request.ident,
      messages: options.messages
    };
    this.send_to_client(data);

    this.emit('sent');

    return true;
  }


}