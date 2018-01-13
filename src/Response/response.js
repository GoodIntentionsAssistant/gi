/**
 * Response
 */
const EventEmitter = require('events').EventEmitter;
const util = require('util');
const extend = require('extend');
const moment = require('moment');


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
		data.user       = this.request.input.user;

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
