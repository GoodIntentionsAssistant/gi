/**
 * Request
 */
const _ = require('underscore');
const extend = require('extend');
const Promise = require('promise');

const Parameters 	= require('./parameters.js');
const Expects 		= require('./expects.js');
const Router 			= require('./router.js');
const Response 		= require('./../Response/response.js');
const Utterance		= require('./../Utterance/utterance.js');

module.exports = class Request {

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

		//Response
		this.response = new Response(this);

		//Expects
		this.expects = new Expects(this);

		//Parameters
		this.parameters = new Parameters(this);

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
		//Validate incoming
		if(!this.client) {
			this.resolve();
			return false;
		}

		//Set input
		this.input = input;

		//Setup the response after the input has been set
		this.response.setup();

		//Auth
		//Session will be an object and store the bots user details
		//Some intents require to be identified
		this.session = this.app.Auth.identify(this.input.user, this.client);
		this.log('Session: '+this.session.data('ident'));

		//Add to history
		this.session.add_history(this.input);

		//Process the request
		var result = null;

		if(this.input.type == 'message') {
			result = this.process_message(this.input.text);
		}
		else if(this.input.type == 'handshake') {
			result = this.process_handshake();
		}

		if(!result) {
			this.resolve();
		}

		return false;
	}


/**
 * Process Handshake
 * 
 * @param string text
 * @access public
 * @return boolean
 */
	process_handshake() {
		let options = {
			messages: ['You are now identified'],
			status: {
				code: 200
			}
		};
		this.response.send('notice', options);
	}


/**
 * Process Message
 * 
 * @param string text
 * @access public
 * @return boolean
 */
  process_message(text) {
		//Reset
		this.intent 			= null;							//Intent to call if text matches
		this.collection 	= null;							//Training collection intent match found in
		this.action 			= 'response';				//Default intent action to call, can be overwritten

		//Logs
		this.log('');
		this.log('Analyzing "'+text+'"');

		//Utterance
		//Stores the text, tagging and sentiments
		this.utterance = new Utterance(text);

		//Router
		this.router = new Router(this);

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
					return this.throw_error('ParametersFailed');
				}

				return this.call();
			});

			return true;
		}

		//Fire the result
		return this.call();
	}


/**
 * Error
 *
 * @todo remove this when parameters has been removed from this file
 * @param string error_name
 * @return object Session
 */
	throw_error(error_name) {
		this.intent = this.app.IntentRegistry.get('App.Error.Intent.'+error_name);

		if(!this.intent) {
			this.app.Error.fatal('Intent ' + error_name + ' was not loaded. Make sure you include errors in your skills.');
		}

		this.call();
	}
	

/**
 * Call intent
 *
 * @param string user_id
 * @access public
 * @return boolean
 */
	call(options) {
		this.log('Calling ' + this.intent.identifier+'::' + this.action);

		this.app.Event.emit('intent',{
			ident: this.ident,
			identifier: this.intent.identifier,
			action: this.action,
			input: this.input
		});

		let promise = this.intent.fire(this);
		promise.then((result) => {
			this.result(result);
		});

		return true;
	}


/**
 * Redirect
 *
 * @param string intent
 * @access public
 * @return boolean
 */
	redirect(name) {
		this.intent = this.app.IntentRegistry.get(name);
		this.action = 'response';

		this.call();
		return false;
	}


/**
 * Time out
 *
 * @access public
 * @return boolean
 */
	timeout() {
		this.error('Request timed out');
		this.result('Sorry, it took a while to try and do that. Try again later.');
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
		// 	options.messages = [text];
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
