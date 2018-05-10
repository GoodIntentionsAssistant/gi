/**
 * Request Intent
 */
const Request = require('../request.js');

module.exports = class RequestEvent extends Request {

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
    //Make sure an event was defined
    if(!this.input || !this.input.data) {
      this.app.Error.warning('Invalid input');
      return;
    }

    //Make sure an event was defined
    if(!this.input.data.event) {
      this.app.Error.warning('Custom event not specified');
      return;
    }

    //Emit event
    this.app.Event.emit('custom.' + this.input.data.event, {
      ident: this.ident,
      session: this.session,
      client: this.client,
      data: this.input.data
    });
  }


}
