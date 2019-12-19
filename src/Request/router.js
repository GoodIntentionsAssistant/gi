/**
 * Router
 */
module.exports = class Router {

/**
 * Constructor
 *
 * @param object response
 * @access public
 * @return void
 */
  constructor(request) {
    this.request    = request;
    this.app        = request.app;
  }


/**
 * Route
 * 
 * @param object utterance
 * @access public
 * @return hash
 */
  route(utterance) {
    let result = this.app.Understand.process(utterance);

    //Couldn't understand the utterance
    if(result.success === false) {
      return this.error('NotFound');
    }

    //Get top match
    let output = result.matches[0];
    output.success = true;

    //Check the user has the correct auth for the intent
    //Intent might have no auth requirements
    if(!this.check_auth(output.intent)) {
      return this._error('NoAuth');
    }

    return output;
  }


/**
 * Check auth
 *
 * @param object intent
 * @access private
 * @return bool
 */
  check_auth(intent) {
    //Intent requires no authorization
    if(!intent.auth) {
      return true;
    }

    //Get auth
    let auth = intent.get_auth();

    //Check auth
    if(!this.app.session.authorized(auth)) {
      return false;
    }

    return true;
  }


/**
 * Error
 *
 * Sets the routing information to an app error intent 
 *
 * @access public
 * @return hash
 */
  error(type) {
    let identifier = 'App.Basics.Intent.'+type;
    let intent = this.app.IntentRegistry.get(identifier);

    if(!intent) {
      this.app.Error.fatal('Error intent not found, '+identifier);
    }

    if(type === 'NotFound') {
      this.app.Event.emit('request.unknown',{
        ident: this.request.ident,
        input: this.request.input
      });
    }

    return {
      intent: intent,
      collection: null,
      confidence: 0
    };
  }


}