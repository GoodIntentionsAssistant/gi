/**
 * Response
 */
const EventEmitter = require('events').EventEmitter;
const util = require('util');
const extend = require('extend');
const moment = require('moment');
const Config = require('../Core/config.js');

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

		//
		this.typing = false;
		this.queue = [];
		this.namespace = 'response';
		this.sequence_count = 0;

		//Speed each letter takes to type
		this.min_reply_time = Config.read('response.min_reply_time');
		this.letter_speed 	= Config.read('response.letter_speed');
		this.max_response 	= Config.read('response.max_response');
	}


/**
 * Setup
 * 
 * Setup the response based on the request input.
 * 
 * @access public
 * @return void
 */
  setup() {
		//Fast?
		if(this.request.input.fast) {
			this.min_reply_time = 0;
			this.letter_speed = 0;
		}

		//Name space
		if(this.request.input.namespace) {
			this.namespace += '::' + this.request.input.namespace;
		}
	}


/**
 * Speed
 *
 * @param object response
 * @access public
 * @return void
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
 * Send
 *
 * @param object response
 * @access public
 * @return void
 */
	send(type, result) {
		//If the response has messages then queue them and send
		//Otherwise just sent the meta data
		if(type == 'message') {
			this._send_messages(result);
		}
		else {
			this._send_notice(result);
		}

	}


/**
 * Send Messages
 *
 * @param object response
 * @access public
 * @return void
 */
	_send_messages(result) {
		this.start_typing();

		for(var ii=0; ii<result.messages.length; ii++) {
			this.queue.push([ result, result.messages[ii] ]);
		}

		//Check if loop is already active
		if(this.timer) {
			return;
		}

		//Start loop with speed set so the user gets a realistic reply
		this.timer = setTimeout(() => {
			this._send();
		}, this.speed(result.messages[0]));
	}


/**
 * Send just notice
 *
 * @param object result
 * @access public
 * @return void
 */
  _send_notice(result) {
		let data = {
			type:   	'notice',
			ident: 		this.request.ident,
			messages: result.messages
		};
		this._emit(data);
		this.emit('sent');
		return;
	}


/**
 * Send
 *
 * @param object response
 * @access public
 * @return void
 */
	_send() {
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
		this._emit(data);

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
		var that = this;
		this.timer = setTimeout(function() {
			that._send();
		}, this.speed(this.queue[0][1]));
	}


/**
 * Emit message
 *
 * @access public
 * @return void
 */
	_emit(data) {
		data.ident 			= this.ident;
		data.namespace 	= this.namespace;
		data.sequence 	= this.sequence_count++;
		data.microtime 	= moment().valueOf();
		this.request.client.emit(this.namespace, data);
	}


/**
 * Build message
 *
 * @access public
 * @return object
 */
	build(data, message) {
		//Attachments
		var attachments = {};

		//Add attachments on last message
		if(this.queue.length == 0) {
			//Actions
			if(this.request.attachment.attachments.actions.length > 0) {
				attachments.actions = this.request.attachment.attachments.actions;
			}

			//Images
			if(this.request.attachment.attachments.images.length > 0) {
				attachments.images = this.request.attachment.attachments.images;
			}

			//Shortcuts
			if(this.request.attachment.attachments.shortcuts.length > 0) {
				attachments.shortcuts = this.request.attachment.attachments.shortcuts;
			}

			//Fields
			if(this.request.attachment.attachments.fields.length > 0) {
				attachments.fields = this.request.attachment.attachments.fields;
			}

			//Links
			if(this.request.attachment.attachments.links.length > 0) {
				attachments.links = this.request.attachment.attachments.links;
			}
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
			type: 				'message',
			messages: 		messages,
			attachments: 	attachments,
			ident: 				this.request.ident,
			user: 				this.request.input.user
		};

		//Ident
		if(this.request.intent) {
			result.collection 	= this.request.collection;
			result.intent 			= this.request.intent.identifier;
			result.action 			= this.request.action;
			result.confidence 	= this.request.confidence;
		}

		return result;
	}


/**
 * Start
 *
 * @access public
 * @return void
 */
	start_typing() {
		if(this.typing) {
			return;
		}

		this.typing = true;
		this._emit({
			type: 'start'
		});
	}


/**
 * End
 *
 * @access public
 * @return void
 */
	end_typing() {
		this.typing = false;
		this._emit({
			type: 'end'
		});
	}

}
