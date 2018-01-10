/**
 * Dispatcher
 */
module.exports = class Dispatcher {

/**
 * Constructor
 *
 * @param text string
 * @access public
 * @return void
 */
  constructor(request) {
    this.request = request;
    this.app = request.app;
  }


/**
 * Dispatch
 * 
 * @access public
 * @return bool
 */
  dispatch() {
    //
    this.request.log('Calling ' + this.request.intent.identifier+'::' + this.request.action);

    //Emit event
    this.app.Event.emit('dipatch',{
      ident: this.request.ident,
      identifier: this.request.intent.identifier,
      action: this.request.action,
      input: this.request.input
    });

    let promise = this.request.intent.fire(this.request);
    promise.then((result) => {
      this.request.result(result);
    });

    return true;
  }


/**
 * Redirect
 *
 * @access public
 * @return void
 */
  redirect(identifier) {
    this.request.intent = this.app.IntentRegistry.get(identifier);
    this.request.action = 'response';
    return this.dispatch();
  }


}