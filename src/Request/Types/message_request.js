/**
 * Request
 */
const _ = require('underscore');
const extend = require('extend');
const Promise = require('promise');

const Request     = require('./../request.js');
const Parameters  = require('./../parameters.js');
const Expects     = require('./../expects.js');
const Router      = require('./../router.js');

const History     = require('./../Auth/history.js');
const Response    = require('./../Response/response.js');
const Utterance   = require('./../Utterance/utterance.js');

module.exports = class MessageRequest extends Request {

/**
 * Constructor
 *
 * @param object app
 * @param string ident
 * @access public
 * @return void
 */
  constructor(app, client, ident) {
    //
    this.app = app;
    this.ident = ident;
    this.client = client;

    //Vars
    this.session = null;
    this.intent = null;

    //Input default
    this.input = {
      fast: false,
      namespace: null
    };

    //Expects
    this.expects = new Expects(this);

    //Parameters
    this.parameters = new Parameters(this);

    //Router
    this.router = new Router(this);

    //Intent action / method to call
    this.action = 'response';

    super(app, client, ident);
  }


/**
 * Process Message
 * 
 * @param string text
 * @access public
 * @return boolean
 */
  process(text) {
    //Reset
    this.intent       = null;             //Intent to call if text matches
    this.collection   = null;             //Training collection intent match found in
    this.action       = 'response';       //Default intent action to call, can be overwritten

    //Logs
    this.log('Analyzing "'+text+'"');

    //Utterance
    this.utterance = new Utterance(text);

    //Setup history
    this.history = new History(this);
    this.history.add(this.utterance);

    //Event
    this.app.Event.emit('incoming',{
      ident: this.ident,
      input: this.input
    });

    //Expects
    //If expects is set then we're waiting for input. Could be a
    //simple question like what's your favorite colour or asking them to login
    //and we need their email and password. The previous intent sets expects.
    if(this.expects.has()) {
      this.expects.load(this);
    }

    //Understand input if expects didn't set it
    if(!this.intent) {
      let result = this.router.route(this.utterance.text);

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

        return this.dispatcher.dispatch();
      });

      return true;
    }

    //Fire the result
    return this.dispatcher.dispatch();
  }


/**
 * Redirect
 *
 * Method must return a false otherwise the request will send "true"
 *
 * @param string intent identifier, e.g. App.Example.Intent.Ping
 * @access public
 * @return bool
 */
  redirect(identifier) {
    this.redirect(identifier);
    return false;
  }


/**
 * Send
 * 
 * @param string text
 * @param object result
 * @access public
 * @return boolean
 */
  send(text, options) {
    let _options = {
      messages: '',
      attachments:[],
      status: {
        code: 200,
        error_msg: ''
      }
    };
    options = extend(_options, options);

    if(text instanceof Array) {
      //options.messages = [text.join("\n")];
      options.messages = text;
    }
    else if(text instanceof Object) {
      options = extend(_options, text);
    }
    else {
      options.messages = [text];
    }

    //@todo For now if the intent returns true then just send this as a message
    // else if(text instanceof String) {
    //  options.messages = [text];
    // }

    this.response.send('message', options);
  }


/**
 * Expect
 *
 * @param mixed data
 * @access public
 * @return boolean
 */
  expect(data) {
    return this.expects.set(data);
  }


/**
 * Attachment
 *
 * @param type Type of attachment, e.g. image, action, link
 * @param mixed data
 * @access public
 * @return boolean
 */
  attachment(type, data) {
    return this.response.attachment(type, data);
  }


/**
 * Result of request
 *
 * @param hash result
 * @access public
 * @return boolean
 */
  result(result) {
    //Result is array 
    //Listen for the sent event
    this.response.on('sent', () => {
      this.end();
    });

    if(!result) {
      return;
    }
    
    this.send(result);
  }

}
