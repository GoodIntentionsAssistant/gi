/**
 * Request
 */
const Parameters = girequire('src/Request/parameters');
const Expects = girequire('src/Request/expects');
const Dialog = girequire('src/Response/dialog');

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
      fast: false,
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
 * @todo Move to dispatcher
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

    //No result returned
    //Intent could have replied false to handle the response manually
    if(!result) {
      this.end();
      return;
    }

    //Empty array returned
    if(result instanceof Array && result.length == 0) {
      this.end();
      return;
    }

    //Result is a hash
    //An intent can return an object/hash instead of just a text result
    //{ "result": "hello", "options":{} }
    if(result instanceof Object) {
      var _temp = result;
      result = _temp.result;

      //If options have been passed
      if(_temp.options) {
        options = extend(options, _temp.options);
      }
    }

    //Listen for the sent event
    this.response.on('sent', () => {
      this.end();
    });
    
    //Send it back to the user
		this.response.send(result, options);
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
    catch(ex) {
      this.app.Error.warning(ex.toString());
      return false;
    }

    //False could be returned if there was an error
    if(!result) {
      return false;
    }

    return {
      result: result,
      options: {}
    };
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
