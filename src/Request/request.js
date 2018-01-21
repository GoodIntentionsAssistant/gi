/**
 * Request
 */
const _ = require('underscore');
const extend = require('extend');
const Promise = require('promise');

const Parameters 	= require('./parameters.js');
const Expects 		= require('./expects.js');
const Router 			= require('./router.js');
const Dispatcher	= require('./dispatcher.js');
const History  		= require('./../Auth/history.js');
const Utterance		= require('./../Utterance/utterance.js');

const MessageResponse = require('./../Response/message_response.js');
const NoticeResponse = require('./../Response/notice_response.js');

module.exports = class Request {

/**
 * Constructor
 *
 * @param object app
 * @param string ident
 * @access public
 * @return void
 */
	constructor(app, ident) {
		//
		this.app = app;
		this.ident = ident;

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

		//Dispatcher
		this.dispatcher = new Dispatcher(this);

		//Intent action / method to call
		this.action = 'response';

		//Update last activity
		//Used for the queue to time out requests. Response will keep this date up to date
		this.last_activity = Date.now();

		//Promise to call back to Queue to say we are done so request can be taken out
		//of the queue. But I'm not sure if this is correctly done. I couldn't figure out how to
		//this.promise = new Promise(); then resolve it.
		this.promise = new Promise((resolve, reject) => {
			this.resolve = resolve;
			this.reject = reject;
			return null;
		});
	}


/**
 * Log
 *
 * Alias for App::log which passes the request ident
 *
 * @param string str
 * @access public
 * @return void
 */
	log(str) {
		if(!str) {
			this.app.Log.add('');
			return;
		}
		this.app.Log.add(str, this.ident);
	}


/**
 * Error
 *
 * Alias for App::error which passes the request ident
 *
 * @param string str
 * @access public
 * @return void
 */
	error(str) {
		this.app.Log.error(str, {
			ident: this.ident
		});
	}


/**
 * Process wrapper
 *
 * Used if the main process returns false so we can resolve the Promise
 *
 * @param object client Socket connection
 * @param hash input Input from user
 * @access public
 * @return boolean
 */
	incoming(input) {
		//Set input
		this.input 		= input;

		//Setup auth
		//Client, session and user
		this.auth();

		//Reset
		this.intent 			= null;							//Intent to call if text matches
		this.collection 	= null;							//Training collection intent match found in
		this.action 			= 'response';				//Default intent action to call, can be overwritten

		//Action
		if(input.action) {
			this.action = input.action;
		}

		//Process the request
		//@todo Flip request and dispatch the other way around so dispatch calls a request type
		var result = null;

		if(this.input.type == 'message') {
			this.setup_response('message');
			result = this.process_message(this.input.text);
		}
		else if(this.input.type == 'intent') {
			//@todo Remove this, it's horrible!
			let intent = this.app.IntentRegistry.get(this.input.intent);

			this.intent 		= intent;
			this.confidence = 1;

			this.setup_response('message');
			result = this.dispatcher.dispatch();
		}

		if(!result) {
			this.resolve();
		}

		return false;
	}


/**
 * Set auth details
 * 
 * @param string type
 * @access public
 * @return boolean
 */
  auth() {
		//Client id is passed in the request
		//Use this to find the correct client to send the response back to
		this.client = this.app.Server.find_client(this.input.client_id);

		//Identify
		let auth = this.app.Auth.identify(this.input.session_id)

		//Session
		this.session = auth.session;

		//User from the session data
		this.user = auth.user;
  }


/**
 * Setup response
 * 
 * @param string type
 * @access public
 * @return boolean
 */
  setup_response(type) {
		this.response = new MessageResponse(this);
		this.response.load();
		return true;
  }


/**
 * Process Message
 * 
 * @param string text
 * @access public
 * @return boolean
 */
  process_message(text) {
		//Logs
		this.log('');
		this.log('Analyzing "'+text+'"');

		//Utterance
		//Stores the text, scrubbed text, tagging and sentiments
		this.utterance = new Utterance(text);

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
			this.expects.load(this);
		}

		//Understand input if expects didn't set it
		if(!this.intent) {
			let result = this.router.route(this.utterance);

			if(result) {
				this.intent 		= result.intent;
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
					this.intent 		= err.intent;
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
		this.dispatcher.redirect(identifier);
		return false;
	}


/**
 * Time out
 *
 * @access public
 * @return bool
 */
	timeout() {
		this.error('Request timed out');
		this.result('Sorry, it took a while to try and do that. Try again later.');
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
		
		this.response.send(result, {
			type: 'message'
		});
	}


/**
 * Send
 * 
 * @param string text
 * @param object options
 * @access public
 * @return boolean
 */
	send(text, options = {}) {
		this.response.send(text, options);
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
 * End request
 *
 * @access public
 * @return void
 */
	end() {
		this.resolve();
	}

}
