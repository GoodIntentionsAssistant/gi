/**
 * Request Message
 */
const Request     = girequire('/src/Request/request.js');
const Logger      = girequire('/src/Helpers/logger.js');
const Prompt      = girequire('/src/Request/prompt.js');
const Dialog      = girequire('/src/Response/dialog');
const Router      = girequire('/src/Request/router.js');
const History     = girequire('/src/Auth/history.js');
const Utterance   = girequire('/src/Utterance/utterance.js');

module.exports = class RequestMessage extends Request {

/**
 * Constructor
 *
 * @constructor
 * @param {Object} app App instance
 * @param {string} ident Request identifier
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
 * @returns {boolean} Able to process the message
 */
  process() {
    //Utterance
    //Stores the text, scrubbed text, tagging and sentiments
    this.utterance = new Utterance(this.input.text);

    //Text
    let original = this.utterance.original();
    let text = this.utterance.text();

    //Logs
    Logger.info(`Analyzing... ${original}`, { prefix:this.ident, new_line: true });

    //Setup history
    this.history = new History(this);
    this.history.add(this.utterance);

    //Event
    this.app.Event.emit('request.incoming',{
      request: this
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

      //@todo Handle when no routing result found
      if(result) {
        this.intent     = result.intent;
        this.collection = result.collection;
        this.confidence = result.confidence;
      }
    }

    //Check parameters
    if(this.intent.has_parameters()) {
      this._check_parameter_input(text);
      return true;
    }

    //Fire the result
    return this.call();
  }


/**
 * Check parameters from input
 * 
 * Parse out the parameters out of the input if the intent has them
 * We need to catch the parameter errors quickly before firing, the intent
 * needs clean data to work. But not all parameters are required.
 * Parameter checking might require entities to fetch live remote data so we
 * need to create a promise and wait or the parsing to finish first.
 * 
 * @param {string} text Text input to extract parameters from
 * @returns {*} Either the object or boolean
 */
  _check_parameter_input(text) {
    //Check parameters for intent
    Logger.info(`Checking parameters for intent ${this.intent.identifier}`, { prefix:this.ident });

    //Create a new parameter object
    this.parameters.parse_from_intent(text, this.intent);

    this.parameters.promise.then(() => {

      if (this.parameters.prompt) {
        //Parameter requires a prompt
        let prompt = new Prompt(this);
        prompt.load(this.parameters.prompt);
      }
      else if (!this.parameters.validates) {
        //Parameters did not validate
        //Throw an error
        this._failed_intent = this.intent;

        let err = this.router.error('ParametersFailed');
        this.intent = err.intent;
        this.collection = err.collection;
        this.confidence = err.confidence;
      }

      return this.call();
    });

    return true;
  }


/**
 * Dialog
 * 
 * @todo Document this method more and clean up error
 * @param {string} name Name
 * @param {Object} options Options for dialog
 * @return {*} Either false if it failed or the object with result
 */
  dialog(name, options = {}) {
    //Set options for dialog to work
    options.request = this;
    options.skill = this.intent.skill;

    //Setup new dialog and process it
    let dialog = new Dialog();

    //Try to process the dialog
    let result = '';

    try {
      result = dialog.process(name, options);
    }
    catch (ex) {
      Logger.warn(ex.toString(), { prefix:this.ident });
      return false;
    }

    //False could be returned if there was an error
    if(!result) {
      return false;
    }

    return {
      options: {},
      result
    };
  }


/**
 * Set for templating
 * 
 * @param {string} key Key for setting
 * @param {*} value Values for key
 * @returns {boolean}
 */
  set(key, value = {}) {
    return this.response.set(key, value);
  }


}
