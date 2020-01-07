/**
 * Dispatcher
 */
const RequestMessage  = girequire('/src/Request/Type/request_message.js');
const RequestIntent   = girequire('/src/Request/Type/request_intent.js');
const RequestEvent    = girequire('/src/Request/Type/request_event.js');
const RequestPing     = girequire('/src/Request/Type/request_ping.js');

const Response = girequire('/src/Response/response.js');
const Logger = girequire('/src/Helpers/logger.js');

const _ = require('underscore');

module.exports = class Dispatcher {

/**
 * Constructor
 *
 * @constructor
 * @param {Object} app App instance
 */
  constructor(app) {
    this.app = app;
  }


/**
 * Dispatch
 * 
 * @param {Object} data Incoming request from queue
 * @returns {*} Either the request object or false if failed to dispatch
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

    if(!auth) {
      Logger.warn(`Failed to dispatch request ${data.input.type} because it failed auth`);
      return false;
    }

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

    //Process the request
    //For most cases this will run the entire flow and send the response back to the user
    var result;
    try {
      result = request.process();
    }
    catch(error) {
      Logger.warn(`Dispatch failed to process the request`, {
        error
      });
    }

    //If the process method returned false then resolve the request promise via abstracted ::end() method
    //This will restory the request from the queue
    //If the request doesn't get resolved it'll time out from the queue instance
    //If your config max_consecutive is 1 and request don't resolve quickly this could mean
    //your queue builds up and requests take longer to process.
    if(!result) {
      request.end();
    }

    return request;
  }


/**
 * Validate input
 * 
 * @todo Add more input validation
 * @param {Object} input Input from client
 * @returns {boolean} If the input is valid
 */
  validate_input(input) {
    //Input is empty
    if(!input || Object.keys(input).length === 0) {
      return false;
    }
    return true;
  }


/**
 * Validate type
 * 
 * @param {string} type Type of request, e.g. message
 * @returns {boolean} If the type is valid
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
 * @param {Object} data Incoming request data
 * @returns {*} Either false if auth failed or a collection of session, user and client objects
 */
  auth(data) {
    //Client id is passed in the request
    //Use this to find the correct client to send the response back to
    let client = this.app.Server.find_client(data.input.client_id);

    if(!client) {
      Logger.warn(`Dispatcher could not find the client for client id ${data.input.client_id}`);
      return false;
    }

    //Identify
    let auth = this.app.Auth.identify(data.input.session_id);

    if(!auth) {
      Logger.warn(`Dispatcher could not find the session for session id ${data.input.session_id}`);
      return false;
    }

    return {
      session: auth.session,
      user: auth.user,
      client
    }
  }



}