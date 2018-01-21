/**
 * Request Intent
 */
const Request = require('../request.js');

module.exports = class RequestIntent extends Request {

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
    let intent = this.app.IntentRegistry.get(this.input.intent);

    this.intent     = intent;
    this.action     = 'response';
    this.confidence = 1;

    //Check if action was specified
    if(this.input.action) {
      this.action = this.input.action;
    }

    //Dispatch intent call
    let result = this.call();

    if(!result) {
      this.resolve();
    }

    return false;
  }


}
