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
 * @access public
 * @return hash
 */
  route(text) {
    let result = this.app.Understand.process(text);

    //Couldn't understand the text
    if(result.success === false) {
      return this._error('NotFound');
    }

    //Get top match
    let output = result.matches[0];
    output.success = true;

    //Check the user has the correct auth for the intent
    //Intent might have no auth requirements
    if(!this._check_auth(output.intent)) {
      return this._error('NoAuth');
    }

    return output;
  }


/**
 * Check auth
 *
 * @access private
 * @return bool
 */
  _check_auth(intent) {
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
  _error(type) {
    let intent = this.app.IntentRegistry.get('App.Error.Intent.'+type);

    if(type == 'NotFound') {
      this.app.Event.emit('unknown',{
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