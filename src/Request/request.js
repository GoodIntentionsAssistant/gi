/**
 * Request
 */
const _ = require('underscore');
const extend = require('extend');
const Promise = require('promise');

const Parameters = require('./parameters.js');
const Expecting = require('./expecting.js');
const Attachment = require('./attachment.js');
const Response = require('./../Response/response.js');

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
		this.response.start();

		//Expecting
		this.expecting = new Expecting(this);

		//Attachment
		this.attachment = new Attachment(this);

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
		var that = this;
		this.promise = new Promise(function(resolve, reject){
			that.resolve = resolve;
			that.reject = reject;
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
		var result = this.process(this.input.text);
		if(!result) {
			this.resolve();
		}

		return false;
	}


/**
 * Process
 *
 * This method can be called directly from anywhere.
 * 
 * @param string text
 * @access public
 * @return boolean
 */
	process(text) {
		//Reset
		this.intent = null;
		this.confidence = 0;
		this.action = 'response';
		this.classifier = 'default';

		//Logs
		this.log('');
		this.log('Analyzing "'+text+'"');
		this.app.Log.write_log('incoming',text);

		//Expecting
		//If expecting is set then we're waiting for input. Could be a
		//simple question like what's your favorite colour or asking them to login
		//and we need their email and password. The previous intent sets expecting.
		if(this.expecting.has()) {
			this.expecting.load(this);
		}

		//Strict matching
		if(!this.intent) {
			let match = this.app.Train.find(text, 'strict');
			if(match) {
				this.intent = this.app.IntentRegistry.get(match.result);
				this.confidence = match.confidence;
				this.classifier = 'strict';
			}
		}

		//Load the intent from the inputted string if it's not already set
		if(!this.intent) {
			let match = this.app.Train.find(text, this.classifier);
			if(match) {
				this.intent = this.app.IntentRegistry.get(match.result);
				this.confidence = match.confidence;
			}
		}

		//Fall back classifiers if not found
		if(!this.intent) {
			let match = this.app.Train.find(text, 'fallback');
			if(match) {
				this.intent = this.app.IntentRegistry.get(match.result);
				this.confidence = 0;
				this.classifier = 'fallback';
				this.app.Log.write_log('unknown',text);
			}
		}

		//If intent not found then error
		if(!this.intent) {
			this.throw_error('NotFound');
			this.app.Log.write_log('unknown',text);
			return false;
		};

		//Intent requires authorized session
		//If not authorized then change the intent to an error asking them to login
		if(this.intent.auth && !this.session.authorized(this.intent.get_auth())) {
			this.log('No auth allowed for intent '+this.intent.name);
			this.throw_error('NoAuth');
			return false;
		}

		//Check parameters
		//Parse out the parameters out of the input if the intent has them
		//We need to catch the parameter errors quickly before firing, the intent
		//needs clean data to work. But not all parameters are required.
		//Parameter checking might require entities to fetch live remote data so we
		//need to create a promise and wait or the parsing to finish first.
		if(this.intent.parameters) {
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
 * @param string user_id
 * @return object Session
 */
	throw_error(error_name, options) {
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
 * @return boolean
 */
	call(options) {
		this.log('Calling '+this.intent.name+'::'+this.action);

		var promise = this.intent.fire(this);
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
		var _options = {
			messages: '',
			attachments:[],
			status: {
				code: 200,
				error_msg: ''
			}
		};
		options = extend(_options, options);

		if(text instanceof Array) {
			options.messages = [text.join("\n")];
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

		this.response.send(options);
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
		this.response.end();
		this.resolve();
	}

}
