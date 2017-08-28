/**
 * Response
 */
const EventEmitter = require('events').EventEmitter;
const util = require('util');
const extend = require('extend');
const moment = require('moment');


var Response = function() {
	this.queue = [];
	this.namespace = 'request_result';
	this.sequence_count = 0;

	this.timer = null;
	this.min_reply_time = 500;
	this.letter_speed = 500;
	this.max_response = 2000;
}

//
util.inherits(Response, EventEmitter);


/**
 * Initialize
 *
 * @param object response
 * @access public
 * @return void
 */
Response.prototype.initialize = function(request) {
	//
	this.request = request;

	//Speed each letter takes to type
	this.min_reply_time = request.app.config.response.min_reply_time;
	this.letter_speed = request.app.config.response.letter_speed;
	this.max_response = request.app.config.response.max_response;

	//Fast?
	if(request.input.fast) {
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
Response.prototype.speed = function(message) {
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
Response.prototype.send = function(result, options) {
	for(var ii=0; ii<result.messages.length; ii++) {
		this.queue.push([ result, result.messages[ii] ]);
	}

	//Check if loop is already active
	if(this.timer) {
		return;
	}

	//Start loop with speed set so the user gets a realistic reply
	var that = this;
	this.timer = setTimeout(function() {
		that._send();
	}, this.speed(result.messages[0]));
}


/**
 * Send
 *
 * @param object response
 * @access public
 * @return void
 */
Response.prototype._send = function() {
	var queue_item = this.queue.shift();

	var result = queue_item[0];
	var message = queue_item[1];

	//
	this.request.log('Reply: '+message);

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
Response.prototype._emit = function(data) {
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
Response.prototype.build = function(data, message) {
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

	//Result
	var result = {
		type: 				'message',
		messages: 		[message],
		attachments: 	attachments,
		ident: 				this.request.ident,
		classifier:   this.request.classifier,
		intent: 			this.request.intent.name,
		action: 			this.request.action
	};

	return result;
}



/**
 * Start
 *
 * @access public
 * @return void
 */
Response.prototype.start = function() {
	var that = this;
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
Response.prototype.end = function() {
	var that = this;
	this._emit({
		type: 'end'
	});
}


module.exports = Response;

