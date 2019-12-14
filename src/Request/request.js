/**
 * Request
 */
const Parameters  = girequire('src/Request/parameters');
const Expects     = girequire('src/Request/expects');

const _ = require('underscore');
const extend = require('extend');
const Promise = require('promise');


module.exports = class Request {

/**
 * Constructor
 *
 * @param object app
 * @param string ident
 * @param hash data
 * @access public
 * @return void
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
 * @access public
 * @return void
 */
  set_input(input) {
    //Default
    let _input = {
      namespace: null
    };

    this.input = extend(_input, input);

    this._check_data_parameters();
  }


/**
 * Check data
 *
 * @access public
 * @return void
 */
  _check_data_parameters() {
    if(!this.input.data) {
      return false;
    }

    for(let key in this.input.data) {
      this.parameters.set(key, this.input.data[key]);
    }
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
 * Redirect
 *
 * Method must return a false otherwise the request will send "true"
 *
 * @param string intent identifier, e.g. App.Example.Intent.Ping
 * @access public
 * @return bool
 */
	redirect(identifier) {
    this.intent = this.app.IntentRegistry.get(identifier);
    this.action = 'response';
    this.call();
    return false;
	}


/**
 * Call the intent
 * 
 * @todo Replace reply message with a config message
 * @access public
 * @return bool
 */
  call() {
    //
    this.log('Calling ' + this.intent.identifier+'::' + this.action);

    //Emit event
    this.app.Event.emit('request.call',{
      ident: this.ident,
      identifier: this.intent.identifier,
      action: this.action,
      input: this.input
    });

    let promise = this.intent.fire(this);

    promise.then((result) => {
      this.result(result);
    });

    promise.catch((error) => {
      this.app.Error.warning(['Intent failed to call', error.message, error.stack]);
      this.result('Oops, looks like I have a problem doing that! I have reported it to my owner!');
    });

    return true;
  }


/**
 * Time out
 *
 * @todo Move to dispatcher and replace with config message
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
 * @param mixed result
 * @param hash options
 * @access public
 * @return boolean
 */
  result(result, options = {}) {
    //Default
    let _options = {
      type: 'message'
    };
    options = extend(_options, options);

    //Array returned
    if(result instanceof Array && result.length > 0) {
      for(let ii=0; ii<result.length; ii++) {
        this.attachment('message', result[ii]);
      }
    }
    else if(result && typeof result == 'string') {
      //Returned a string
      this.attachment('message', result);
    }

    //Count attachments, if no attachments then end
    //If the intent returned true keep the request and response active, it might have async methods
    if(this.attachment_count == 0 && result !== true) {
      this.end();
      return;
    }

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
 * @param string text
 * @access public
 * @return boolean
 */
	send(text) {
    //Cancelled request
    if(this.cancelled()) {
      return false;
    }

    this.attachment('message', text);
		this.response.send();
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
    this.attachment_count++;
		return this.response.attachment(type, data);
	}
	

/**
 * Canceled
 *
 * @access public
 * @return boolean
 */
  cancelled() {
    return this._cancelled;
  }
	

/**
 * Cancel request
 *
 * @access public
 * @return void
 */
  cancel() {
    this._cancelled = true;
    this.end();
    this.log('Request cancelled');
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
