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
 * @param {Request} Request Initial request
 * @constructor
 */
	constructor(Request) {
		super();

		//
		this.Request = Request;
    this.App = Request.app;

		//
		this.namespace = 'response';
		this.sequence_count = 0;

    //Attachments for the message
    this._attachments = {};

    //If GI is currently typing
    this.typing = false;

    //Template
    this.Template = new Template(this);
    this.Template.data_from_parameters(this.Request.parameters.get());
    this.Template.data_from_user(this.Request.user.get());
	}


/**
 * Load
 *
 * @returns {boolean}
 */
  load() {
    this.start_typing();
    return true;
  }


/**
 * Set for templating
 *
 * @param {*} key Key for templating 
 * @param {string} value Value for templating
 * @returns {boolean}
 */
  set(key, value = '') {
    return this.Template.set(key, value);
  }


/**
 * Send
 *
 * @param {Object} options Options for setting a response
 * @returns {boolean}
 */
  send(options) {
    let _options = {
    };
    let data = extend(_options, options);

    //If there are no attachments do not try to flush the buffer yet
    if(this._attachments.length === 0) {
      return true;
    }

    //Check client still exists
    if(!this.valid_client()) {
      return false;
    } 

    //
    if(!this.typing) {
      this.start_typing();
    }

    //Get current attachments
    let attachments = this.attachments();

    //Clear the attachments because we'll be sending them
    this.clearAttachments();

    //Send the attachments
    this._send(attachments);

    return true;
  }


/**
 * Send
 *
 * @param {Object} attachments Attachments to send
 * @returns {boolean}
 */
  _send(attachments) {
    //Build message
    var data = this.build(attachments);

    //Log output
    for(let key in attachments) {
      for(let ii=0; ii<attachments[key].length; ii++) {
        //If it has text
        let output = JSON.stringify(attachments[key][ii]);
        this.Request.log(`Reply ${key}: ${output}`);
      }
    }

    //console.log(util.inspect(data, {showHidden: false, depth: null}))

    //Send to client
    this.send_to_client(data);

    this.end_typing();
    this.emit('sent');

    //Update the request last activity
    //This stops the queue timing out the request if it's still doing something
    this.Request.last_activity = Date.now();

    return true;
  }


/**
 * Attachments
 *
 * @param {string} type Type of attachment, e.g. image, action, link
 * @param {*} data Data for attachment
 * @returns {boolean}
 */
  attachment(type, data) {
    //Identifier
    let identifier = type;

    //Get attachment object and build
    let obj = this.App.AttachmentRegistry.get(identifier);
    let result = obj.build(data, this.Template);

    //Check if the attachment key has been added already
    if(!this._attachments[type]) {
      this._attachments[type] = [];
    }

    this._attachments[type].push(result);

    return true;
  }


/**
 * Return a list of attachments
 * 
 * @returns {Object}
 */
  attachments() {
    return this._attachments;
  }


/**
 * Clear all attachments
 * 
 * @returns {boolean}
 */
  clearAttachments() {
    this._attachments = {};
    return true;
  }


/**
 * Build message
 *
 * @param {Object} attachments Attachments
 * @returns {Object}
 */
  build(attachments) {
    //Result
    let result = {
      type: 'message',
      ident:        this.Request.ident,
      user:         this.Request.input.user,
      attachments
    };

    //Intent information
    if(this.Request.intent) {
      result.collection   = this.Request.collection;
      result.intent       = this.Request.intent.identifier;
      result.action       = this.Request.action;
      result.confidence   = this.Request.confidence;
    }

    return result;
  }


/**
 * Start typing
 *
 * @returns {boolean}
 */
  start_typing() {
    if(this.typing) {
      return false;
    }

    this.typing = true;
    this.send_to_client({
      type: 'start'
    });

    return true;
  }


/**
 * End typing
 *
 * @returns {boolean}
 */
  end_typing() {
    this.typing = false;
    this.send_to_client({
      type: 'end'
    });
    return true;
  }


/**
 * Check client
 * 
 * @returns {boolean}
 */
  valid_client() {
    if(!this.Request.client) {
      this.Request.log(`Client was not found, it may have disconnected`);
      this.Request.cancel();
      return false;
    }
    return true;
  }


/**
 * Emit message
 *
 * @param {Object} data Data to send to client
 * @returns {boolean}
 */
	send_to_client(data) {
    //Check client still exists
    if(!this.valid_client()) {
      return false;
    } 

		//Name space
		let namespace = this.namespace;
		if(this.Request.input.namespace) {
			namespace += '::' + this.Request.input.namespace;
		}

		//Request identifier
		//Each request to the app has a unique identifier
		data.ident      = this.Request.ident;

		//User session data
		data.session_id = this.Request.session.session_id;

		//Name space used
		data.namespace 	= namespace;

		//Increasing number
		data.sequence 	= this.sequence_count++;

		//Time the message has been sent
		data.microtime 	= moment().valueOf();
		
		//Send data to the client connected
		//The client will send it back to the user
    this.Request.client.emit(this.namespace, data);
    
    return true;
	}


}
