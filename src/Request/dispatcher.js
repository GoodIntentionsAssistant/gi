/**
 * Dispatcher
 */
const RequestMessage = require('./Type/request_message.js');
const RequestIntent = require('./Type/request_intent.js');
const RequestEvent = require('./Type/request_event.js');
const RequestPing = require('./Type/request_ping.js');

const Response = require('./../Response/response.js');

const Logger = girequire('/src/Helpers/logger.js');

const _ = require('underscore');

module.exports = class Dispatcher {

/**
 * Constructor
 *
 * @constructor
 * @param {Object} queue Queue instance
 */
  constructor(queue) {
    this.queue = queue;
    this.app = queue.app;
  }


/**
 * Dispatch
 * 
 * @param {Object} data Incoming request from queue
 * @return {*} Either the request object or false if failed to dispatch
 */
  dispatch(data) {
    //Validate input
    if(!this.validate_input(data.input)) {
      Logger.warn(`Invalid input sent to dispatcher`);
      return false;
    }

    //Unrecognised type
    if(!this.validate_type(data.input.type)) {
      Logger.warn(`Unrecognised input type "${data.input.type}" from client so it cannot be dispatched`);
      return false;
    }

    //Load and set auth
    let auth = this.auth(data);

    //Request instance
    let request = null;

    if(data.input.type === 'message') {
      //User input text
      request = new RequestMessage(this.app, data.ident);
    }
    else if(data.input.type === 'intent') {
      //Direct call to an intent, no need to do NLP
      request = new RequestIntent(this.app, data.ident);
    }
    else if(data.input.type === 'event') {
      //Custom client event
      request = new RequestEvent(this.app, data.ident);
    }
    else if(data.input.type === 'ping') {
      //Ping, keep alive
      request = new RequestPing(this.app, data.ident);
    }

    //Set request auth
    request.client = auth.client;
    request.session = auth.session;
    request.user = auth.user;

    //Set input
    request.set_input(data.input);

    //Response
    request.response = new Response(request);
    request.response.load();

    //Load request
    var result;
    try {
      result = request.process();
    }
    catch(error) {
      this.app.Error.warning([
        error.message,
        error.stack
      ]);
    }

    if(!result) {
      request.resolve();
    }

    return request;
  }


/**
 * Validate input
 * 
 * @param {Object} input Input from client
 * @returns boolean
 */
  validate_input(input) {
    if(!input) {
      return false;
    }
    return true;
  }


/**
 * Validate type
 * 
 * @param {string} type Type of request, e.g. message
 * @returns boolean
 */
  validate_type(type) {
    let result = _.indexOf(['message', 'intent', 'event', 'ping'], type);
    if(result === -1) {
      return false;
    }
    return true;
  }


/**
 * Set auth details
 * 
 * @param string type
 * @return boolean
 */
  auth(data) {
    //Client id is passed in the request
    //Use this to find the correct client to send the response back to
    let client = this.app.Server.find_client(data.input.client_id);

    //Identify
    let auth = this.app.Auth.identify(data.input.session_id);

    return {
      session: auth.session,
      user: auth.user,
      client
    }
  }



}