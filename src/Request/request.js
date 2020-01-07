/**
 * Request
 */
const _ = require('underscore');
const extend = require('extend');
const Promise = require('promise');

const Parameters  = girequire('src/Request/parameters');
const Expects     = girequire('src/Request/expects');
const Logger      = girequire('/src/Helpers/logger');


module.exports = class Request {

/**
 * Constructor
 *
 * @constructor
 * @param {Object} app App instance
 * @param {string} ident Unique identifier for request
 */
	constructor(app, ident) {
		//
		this.app = app;

		//Request ident
		this.ident = ident;

		//Expects
		this.expects = new Expects(this);

		//Parameters
    this.parameters = new Parameters(this);

		//Update last activity
		//Used for the queue to time out requests. Response will keep this date up to date
    this.last_activity = Date.now();

    //Request has been cancelled
    this._cancelled = false;
    
    //Total number of attachments on response
    this.attachment_count = 0;

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
 * Set input
 *
 * @param {Object} input Input of the request
 * @returns {boolean}
 */
  set_input(input) {
    //Default
    let _input = {
      namespace: null
    };

    this.input = extend(_input, input);

    this._check_data_parameters();

    return true;
  }


/**
 * Check data
 *
 * @returns {boolean}
 */
  _check_data_parameters() {
    if(!this.input.data) {
      return false;
    }

    for(let key in this.input.data) {
      this.parameters.set(key, this.input.data[key]);
    }
    
    return true;
  }


/**
 * Redirect
 *
 * Method must return a false otherwise the request will send "true"
 *
 * @todo Centralise this call with request_intent.js
 * @param {string} identifier identifier, e.g. App.Example.Intent.Ping
 * @returns {boolean} Always false
 */
	redirect(identifier) {
    if(!this.app.IntentRegistry.exists(identifier)) {
      throw new Error(`Intent ${identifier} does not exist`);
    }

    this.intent = this.app.IntentRegistry.get(identifier);
    this.action = 'response';
    this.call();
    return false;
	}


/**
 * Call the intent
 * 
 * @todo Replace reply message with a config message or use router
 * @returns {boolean} Able to call the intent
 */
  call() {
    //
    Logger.info(`Calling ${this.intent.identifier}::${this.action}`, { prefix: this.ident });

    //Emit request.call
    this.app.Event.emit('request.call',{
      request: this
    });

    let promise = this.intent.fire(this);

    promise.then((result) => {
      this.result(result);
    });

    promise.catch((error) => {
      Logger.warn('Intent failed to call', { error:error, prefix: this.ident });
      this.result('Oops, looks like I have a problem doing that! I have reported it to my owner!');
    });

    return true;
  }


/**
 * Time out
 * 
 * This typically gets called from the queue.
 * The queue will check when the request was made, the last activity.
 * If the last activity of the intent is over a threshold (defined in config)
 * Then this method is called which will end the request and remove it from the queue
 *
 * @todo Move to dispatcher and replace with config message
 * @returns {boolean} If was able to resolve the promise for time out
 */
	timeout() {
		Logger.warn('Request timed out', { prefix:this.ident });
    this.result('Sorry, it took a while to try and do that. Try again later.');
    return true;
	}


/**
 * Result of request
 *
 * @param {*} result Result of the intent, can be a string or boolean
 * @returns {*}
 */
  result(result) {
    //Array returned
    if(result instanceof Array && result.length > 0) {
      for(let ii=0; ii<result.length; ii++) {
        this.attachment('message', result[ii]);
      }
    }
    else if(result && (typeof result === 'string' || typeof result === 'number')) {
      //Returned a string
      result = result.toString();
      this.attachment('message', result);
    }

    //Count attachments, if no attachments then end
    //If the intent returned true keep the request and response active, it might have async methods
    if(this.attachment_count === 0 && result !== true) {
      this.end();
      return;
    }

    //Emit request.result
    this.app.Event.emit('request.result',{
      request: this
    });

    //Listen for the sent event
    this.response.on('sent', () => {
      this.end();
    });

    //Send response
		this.response.send();
	}


/**
 * Send
 * 
 * @param {string} text String of text to return
 * @returns {boolean} Able to send the message to the client
 */
	send(text) {
    //Cancelled request
    if(this.cancelled()) {
      return false;
    }

    this.attachment('message', text);
		return this.response.send();
	}


/**
 * Expect
 *
 * @param {*} data Expected data for next call from same user
 * @returns {boolean} Able to set the expects
 */
	expect(data) {
		return this.expects.set(data);
	}


/**
 * Attachment
 *
 * @param {string} type Type of attachment, e.g. image, action, link
 * @param {*} data Data to be passed to attachment
 * @returns {boolean} Able to add attachment
 */
	attachment(type, data) {
    this.attachment_count++;
		return this.response.attachment(type, data);
	}
	

/**
 * Make another request
 *
 * @todo Requires basic validation
 * @param {object} data Request information
 * @returns {boolean} If successfully created another request at app level
 */
	request(data) {
    if(!data.client_id && this.client.client_id) {
      data.client_id = this.client.client_id;
    }

    if(!data.session_id && this.session.session_id) {
      data.session_id = this.session.session_id;
    }

    return this.app.request(data);
	}
	

/**
 * If intent call has been cancelled
 * 
 * The intent could be still running and it's possible to stop the intent from continuing.
 *
 * @returns {boolean} True or false if this request has been cancelled already
 */
  cancelled() {
    return this._cancelled;
  }
	

/**
 * Cancel request
 *
 * @returns {boolean} If request was cancelled
 */
  cancel() {
    this._cancelled = true;
    this.end();
    Logger.info('Request cancelled', { prefix:this.ident });
    return true;
  }
	

/**
 * End request manually
 * 
 * This will trigger back to the queue freeing up a consecutive call
 *
 * @returns {boolean} If able to resolve the promise
 */
	end() {
    this.resolve();
    return true;
	}

}
