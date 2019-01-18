/**
 * Request Message
 */
const Template    = girequire('src/Response/template');
const Dialog      = girequire('src/Response/dialog');

const Request     = require('../request.js');
const Prompt      = require('../prompt.js');
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

    //Template
    this.template = new Template(this);
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
    let original = this.utterance.original();
    let text = this.utterance.text();

    //Logs
    this.log('');
    this.log('Analyzing... "' + original+'"');
    this.log('Scrubbed: "'+this.utterance.scrubbed('stopwords')+'"');

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
 * @param string text
 * @access private
 * @return mixed
 */
  _check_parameter_input(text) {
    //Check parameters for intent
    this.log('Checking parameters for intent ' + this.intent.identifier);

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
 * @param string name
 * @param hash options
 * @access public
 * @return Object
 */
  dialog(name, options = {}) {
    //Set options for dialog to work
    options.request = this;
    options.skill = this.intent.skill;

    //Setup new dialog and process it
    let dialog = new Dialog();

    try {
      var result = dialog.process(name, options);
    }
    catch (ex) {
      this.app.Error.warning(ex.toString());
      return false;
    }

    //False could be returned if there was an error
    if (!result) {
      return false;
    }

    return {
      result: result,
      options: {}
    };
  }


/**
 * Set something for templating
 * 
 * @param mixed key 
 * @param string value optional
 * @access public
 * @return bool
 */
  set(key, value = {}) {
    this.template.set(key, value);
    return true;
  }


}
