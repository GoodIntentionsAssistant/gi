/**
 * Request Message
 */
const Request = require('../request.js');
const Router      = require('./../router.js');
const History     = require('./../../Auth/history.js');
const Utterance   = require('./../../Utterance/utterance.js');

module.exports = class RequestMessage extends Request {

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

    //Intent to call if text matches
    this.intent = null;

    //Training collection intent match found in
    this.collection = null;

    //Default intent action to call
    this.action = 'response';

    //Router
    this.router = new Router(this);
  }


/**
 * Process Message
 * 
 * @param string text
 * @access public
 * @return boolean
 */
  process() {
    //Utterance
    //Stores the text, scrubbed text, tagging and sentiments
    this.utterance = new Utterance(this.input.text);

    //Text
    let text = this.utterance.text();

    //Logs
    this.log('');
    this.log('Analyzing "'+text+'"');

    //Setup history
    this.history = new History(this);
    this.history.add(this.utterance);

    //Event
    this.app.Event.emit('request.incoming',{
      ident: this.ident,
      input: this.input
    });

    //Expects
    //If expects is set then we're waiting for input. Could be a
    //simple question like what's your favorite colour or asking them to login
    //and we need their email and password. The previous intent sets expects.
    if(this.expects.has()) {
      this.expects.check(this);
    }

    //Understand input if expects didn't set it
    if(!this.intent) {
      let result = this.router.route(this.utterance);

      if(result) {
        this.intent     = result.intent;
        this.collection = result.collection;
        this.confidence = result.confidence;
      }
    }

    //Check parameters
    //Parse out the parameters out of the input if the intent has them
    //We need to catch the parameter errors quickly before firing, the intent
    //needs clean data to work. But not all parameters are required.
    //Parameter checking might require entities to fetch live remote data so we
    //need to create a promise and wait or the parsing to finish first.
    //@todo Move this to Router
    if(this.intent.has_parameters()) {
      //Check parameters for intent
      this.log('Checking parameters for intent '+this.intent.identifier);

      //Create a new parameter object
      this.parameters.parse_from_intent(text, this.intent);

      this.parameters.promise.then(() => {
        if(!this.parameters.validates) {
          this._failed_intent = this.intent;

          let err = this.router.error('ParametersFailed');
          this.intent     = err.intent;
          this.collection = err.collection;
          this.confidence = err.confidence;
        }

        return this.call();
      });

      //Keep the process running
      //Returning true here is returned to the dispatcher which won't finish the queue request
      return true;
    }

    //Fire the result
    return this.call();
  }


}
