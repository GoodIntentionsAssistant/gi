/**
 * Request Event
 */
const Request = girequire('/src/Request/request');
const Logger = girequire('/src/Helpers/logger');

module.exports = class RequestEvent extends Request {

/**
 * Process
 * 
 * @todo Check call back boolean
 * @returns {boolean} Success of processing?
 */
  process() {
    //Make sure an event was defined
    if(!this.input.data) {
      Logger.warn('Invalid input for event request. Data was not defined.', { prefix:this.ident });
      return;
    }

    //Make sure an event was defined
    if(!this.input.data.event) {
      Logger.warn('Custom event name not specified', { prefix:this.ident });
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
