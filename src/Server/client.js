/**
 * Client
 */
const Randtoken = require('rand-token');

module.exports = class Client {

/**
 * Constructor
 *
 * @param object app
 * @param object server
 * @access public
 * @return void
 */
  constructor(app, server, client) {
		this.app = app;
		this.server = server;
		this.client = client;

		this.ident = null;
		this.created = null;
		this.name = null;
		this.identified = false;
		this.request_count = 0;

		//Vars
		this.name = 'Unknown Client';
		this.created = Date.now();

		//Client session token
		this.session_token = Randtoken.generate(16);
	}


/**
 * Load
 *
 * @access public
 * @return void
 */
	load() {
		this.app.Log.add('Client Connected');

		var that = this;

		this.client.on('request', function(input) {
			that.request(input);
		});

		this.client.on('identify', function(input) {
			that.identify(input);
		});

		this.client.on('disconnect', function(){
			that.disconnect();
		});
	}


/**
 * Emit data back to client
 *
 * @access public
 * @return void
 */
	emit(namespace, type, data) {
		data.ident = this.ident;
		data.type = type;
		this.client.emit(namespace,data);
	}


/**
 * Identify
 *
 * @param hash input
 * @access public
 * @return void
 */
	identify(input) {
		this.name = input.client;

		if(!this.validate_client_token(input.token)) {
			this.identified = false;
			this.app.Log.error('Client '+this.name+' failed token auth');
			this.emit('event', 'identify', {
				success: false,
				message: 'Client token is not correct'
			});
			return;
		}

		this.app.Log.add('Client identified '+this.name+' ('+this.ident+')');
		this.identified = true;
		
		this.emit('event','identify', {
			success: true,
			message: 'Successfully identified',
			session_token: this.session_token
		});

		this.ready();
	}


/**
 * Client has identified and is ready
 *
 * @param hash input
 * @access public
 * @return void
 */
	ready() {
		this.app.Event.emit('client.connected', this);
	}


/**
 * Request
 *
 * @param hash input
 * @access public
 * @return void
 */
	request(input) {
		this.request_count++;

		//Invalid request
		if(!this.validate_request(input)) {
			for(var ii = 0; ii < this.validation_errors.length; ii++) {
				this.app.Log.error('Request validation error: '+this.validation_errors[ii]);
			}
			this.emit('event', 'request', {
				success: false,
				message: this.validation_errors.join(', ')
			});
			return false;
		}

		this.app.request(this.client, input);
	}


/**
 * Validate request
 * 
 * @param hash data
 * @access public
 * @return boolean
 */
	validate_request(input) {
		this.validation_errors = [];

		//Identified
		if(!this.identified) {
			this.validation_errors.push('Client not identified');
		}

		//Session token is valid
		if(!this.validate_session_token(input.session_token)) {
			this.validation_errors.push('Session token is not valid');
		}

		//Client defined
		if(typeof input.client === 'undefined' || input.client == '') {
			this.validation_errors.push('Llient not defined');
		}

		//Text defined
		if(typeof input.text === 'undefined' || input.text == '') {
			this.validation_errors.push('Text not defined');
		}

		//User defined
		if(typeof input.user === 'undefined' || input.user == '') {
			this.validation_errors.push('User not defined');
		}

		return this.validation_errors.length > 0 ? false : true;
	}


/**
 * Validate client token
 *
 * @param hash input
 * @access public
 * @return void
 */
	validate_client_token(token) {
		var expecting = this.app.Config.read('clients.'+this.name+'.token');
		if(token != expecting) {
			return false;
		}
		return true;
	}


/**
 * Validate session token
 *
 * @param hash input
 * @access public
 * @return void
 */
	validate_session_token(token) {
		if(token != this.session_token) {
			return false;
		}
		return true;
	}


/**
 * Disconnect
 *
 * @access public
 * @return void
 */
	disconnect() {
		this.app.Log.add('Client '+this.name+' ('+this.ident+') Disconnected');
		this.server.remove_client(this.ident);
	}

}
