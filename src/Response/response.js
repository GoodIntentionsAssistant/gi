/**
 * Response
 */
const Template = girequire('src/Response/template');

const Config = girequire('src/Config/config');

const EventEmitter = require('events').EventEmitter;
const util = require('util');
const extend = require('extend');
const moment = require('moment');

const _ = require('underscore');
  _.mixin(require('underscore.inflections'));

module.exports = class Response extends EventEmitter {

/**
 * Constructor
 *
 * @param object response
 * @access public
 * @return void
 */
	constructor(request) {
		super();

		//
		this.request = request;
    this.app = request.app;

		//
		this.namespace = 'response';
		this.sequence_count = 0;

    //Attachments for the message
    this.attachments = {};

    //If GI is currently typing
    this.typing = false;

    //Queue for sending messages back to user
    this.queue = [];

    //Timer for the queue
    this.timer = null;

    //Template
    this.Template = new Template(this);
	}


/**
 * Load
 *
 * @access public
 * @return void
 */
  load() {
    this.start_typing();
  }


/**
 * Set for templating
 *
 * @param mixed key 
 * @param string value optional
 * @access public
 * @return bool
 */
  set(key, value = '') {
    this.Template.set(key, value);
  }


/**
 * Send
 *
 * @param Object options
 * @access public
 * @return Boolean
 */
  send(options) {
    let _options = {
    };
    let data = extend(_options, options);

    //If there are no attachments do not try to flush the buffer yet
    if(this.attachments.length == 0) {
      return true;
    }

    //Flush the buffer
    this._send();

    return true;
  }


/**
 * Send
 *
 * @access public
 * @return void
 */
  _send() {
    //Build message
    var data = this.build();

    //Log output
    for(let key in this.attachments) {
      for(let ii=0; ii<this.attachments[key].length; ii++) {
        //If it has text
        let output = JSON.stringify(this.attachments[key][ii]);
        this.request.log(`Reply ${key}: ${output}`);
      }
    }

    //console.log(util.inspect(data, {showHidden: false, depth: null}))

    //Send to client
    this.send_to_client(data);

    this.end_typing();
    this.emit('sent');

    //Update the request last activity
    //This stops the queue timing out the request if it's still doing something
    this.request.last_activity = Date.now();
  }


/**
 * Attachments
 *
 * @param type Type of attachment, e.g. image, action, link
 * @param mixed data
 * @access public
 * @return boolean
 */
  attachment(type, data) {
    //Identifier
    let identifier = type;

    //Get attachment object and build
    let obj = this.app.AttachmentRegistry.get(identifier);
    let result = obj.build(data, this.Template);

    //Multiple attachments or just one
    if(obj.multiple) {
      //Check if the attachment key has been added already
      if(!this.attachments[type]) {
        this.attachments[type] = [];
      }

      this.attachments[type].push(result);
    }
    else {
      //Single attachment
      this.attachments[type] = result;
    }

    return true;
  }


/**
 * Build message
 *
 * @param hash data
 * @param string message
 * @access public
 * @return hash
 */
  build(data, message) {
    //Add attachments
    var attachments = {};
    if(this.attachments) {
      attachments = this.attachments;
    }

    //Result
    let result = {
      type: 'message',
      attachments:  attachments,
      ident:        this.request.ident,
      user:         this.request.input.user
    };

    //Intent information
    if(this.request.intent) {
      result.collection   = this.request.collection;
      result.intent       = this.request.intent.identifier;
      result.action       = this.request.action;
      result.confidence   = this.request.confidence;
    }

    return result;
  }


/**
 * Start typing
 *
 * @access public
 * @return void
 */
  start_typing() {
    if(this.typing) {
      return;
    }

    this.typing = true;
    this.send_to_client({
      type: 'start'
    });
  }


/**
 * End typing
 *
 * @access public
 * @return void
 */
  end_typing() {
    this.typing = false;
    this.send_to_client({
      type: 'end'
    });
  }


/**
 * Emit message
 *
 * @param hash data
 * @access public
 * @return void
 */
	send_to_client(data) {
		//Name space
		let namespace = this.namespace;
		if(this.request.input.namespace) {
			namespace += '::' + this.request.input.namespace;
		}

		//Request identifier
		//Each request to the app has a unique identifier
		data.ident      = this.request.ident;

		//User session data
		data.session_id = this.request.session.session_id;

		//Name space used
		data.namespace 	= namespace;

		//Increasing number
		data.sequence 	= this.sequence_count++;

		//Time the message has been sent
		data.microtime 	= moment().valueOf();
		
		//Send data to the client connected
		//The client will send it back to the user
		this.request.client.emit(this.namespace, data);
	}


}
