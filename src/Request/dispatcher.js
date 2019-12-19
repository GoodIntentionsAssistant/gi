/**
 * Dispatcher
 */
const RequestMessage = require('./Type/request_message.js');
const RequestIntent = require('./Type/request_intent.js');
const RequestEvent = require('./Type/request_event.js');

const Response = require('./../Response/response.js');


module.exports = class Dispatcher {

/**
 * Constructor
 *
 * @param text string
 * @access public
 * @return void
 */
  constructor(queue) {
    this.queue = queue;
    this.app = queue.app;
  }


/**
 * Dispatch
 * 
 * @param hash data
 * @access public
 * @return object Request object
 */
  dispatch(data) {
    let request = null;

    //Check auth
    let auth = this.auth(data);

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

    //Unrecongised
    if(!request) {
      this.app.Error.warning('Unrecongised input type "'+data.input.type+'" from client');
      return false;
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
    try {
      var result = request.process();
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
 * Set auth details
 * 
 * @param string type
 * @access public
 * @return boolean
 */
  auth(data) {
    //Client id is passed in the request
    //Use this to find the correct client to send the response back to
    let client = this.app.Server.find_client(data.input.client_id);

    //Identify
    let auth = this.app.Auth.identify(data.input.session_id)

    return {
      client: client,
      session: auth.session,
      user: auth.user
    }
  }



}