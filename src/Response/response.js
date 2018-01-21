/**
 * Response
 */
const Config = require('../Core/config.js');

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

    //Speed each letter takes to type
    //@todo Move this so it doesn't need to be read in each time
    this.min_reply_time = Config.read('response.min_reply_time');
    this.letter_speed   = Config.read('response.letter_speed');
    this.max_response   = Config.read('response.max_response');

    //Fast response
    //If the original request had fast set the response time to instant
    if(this.request.input.fast) {
      this.min_reply_time = 0;
      this.letter_speed = 0;
    }
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


/**
 * Send
 *
 * @param string text
 * @param hash options
 * @access public
 * @return void
 */
  send(text, options) {
    let _options = {
      type: 'message',
      messages: []
    };
    let data = extend(_options, options);

    //Add the messages
    if(text instanceof Array) {
      data.messages = text;
    }
    else if(text instanceof Object) {
      data = extend(options, text);
    }
    else {
      data.messages = [text];
    }

    this._send(data);
  }


/**
 * Send messages
 *
 * @param hash data
 * @access public
 * @return void
 */
  _send(data) {
    //Add each message to the queue
    for(let ii=0; ii<data.messages.length; ii++) {
      this.queue.push([ data, data.messages[ii] ]);
    }

    //Check if loop is already active
    if(this.timer) {
      return;
    }

    //Start loop with speed set so the user gets a realistic reply
    this.timer = setTimeout(() => {
      this._send_loop();
    }, this.speed(data.messages[0]));
  }


/**
 * Send
 *
 * @access public
 * @return void
 */
  _send_loop() {
    var queue_item = this.queue.shift();

    var result = queue_item[0];
    var message = queue_item[1];

    //Log the outputted message
    if(message) {
      this.request.log('Reply: '+message);
    }

    //Build message
    var data = this.build(result, message);

    //Send to client
    this.send_to_client(data);

    //Update the request last activity
    //This stops the queue timing out the request if it's still doing something
    this.request.last_activity = Date.now();

    //Check for end of queue
    if(this.queue.length == 0) {
      this.timer = null;
      this.end_typing();
      this.emit('sent');
      return;
    }

    //Loop next
    this.timer = setTimeout(() => {
      this._send_loop();
    }, this.speed(this.queue[0][1]));
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
    let result = obj.build(data);

    //Multiple attachments or just one
    if(obj.multiple) {
      //Inflector, image -> images
      let key = _.pluralize(type);

      //Check if the attachment key has been added already
      if(!this.attachments[key]) {
        this.attachments[key] = [];
      }

      this.attachments[key].push(result);
    }
    else {
      //Single attachment
      this.attachments[type] = result;
    }

    return true;
  }


/**
 * Speed
 *
 * @param string message
 * @access public
 * @return int
 */
  speed(message) {
    //Speed is set to zero so instantly reply
    //For unit testing the speed should be 0 so there are no delays
    if(this._speed == 0) {
      return 0;
    }

    var speed = this.min_reply_time + (String(message).length * this.letter_speed);

    if(speed > this.max_response) {
      speed = this.max_response;
    }

    return speed;
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
    //Attachments
    var attachments = {};

    //Add attachments on last message
    if(this.queue.length == 0 && this.attachments) {
      attachments = this.attachments;
    }

    //Messages
    //Could be returned as true boolean when only an attachment is being sent
    //This should be cleaned up later and less about messages but more about packets of data
    let messages = [];
    if(message !== true) {
      messages.push(message);
    }

    //Result
    let result = {
      type:         'message',
      messages:     messages,
      attachments:  attachments,
      ident:        this.request.ident,
      user:         this.request.input.user
    };

    //Ident
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


}
