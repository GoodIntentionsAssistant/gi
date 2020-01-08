/**
 * Client
 */
const Randtoken = require('rand-token');

const Logger = girequire('/src/Helpers/logger.js');
const Config = girequire('/src/Config/config.js');

module.exports = class Client {

/**
 * Constructor
 *
 * @constructor
 * @param {Object} app App instance
 * @param {Object} server Server instance, where the client connection came from
 * @param {Object} client Socket client instance
 */
  constructor(app, server, client) {
		this.app = app;
		this.server = server;
		this.client = client;

		this.ident = null;
		this.client_id = null;

		this.created = null;
		this.name = null;
		this.identified = false;
		this.request_count = 0;

		//Vars
		this.name = 'Unknown Client';
		this.created = Date.now();
	}


/**
 * Load
 *
 * @returns {boolean} Success of loading object
 */
	load() {
		Logger.info('New client connected');

		this.client.on('request', (input) => {
			this.request(input);
		});

		this.client.on('identify', (input) => {
			this.identify(input);
		});

		this.client.on('handshake', (input) => {
			this.handshake(input);
		});

		this.client.on('disconnect', () => {
			this.disconnect();
		});

		return true;
	}


/**
 * Emit data back to client
 *
 * @param {string} namespace Socket namespace
 * @param {data} data Json data to send
 * @returns {boolean} Success of sending the data
 */
	emit(namespace, data) {
		data.ident = this.ident;
		return this.client.emit(namespace, data);
	}


/**
 * Identify
 *
 * @param {Object} input Input from the client
 * @returns {boolean} Success of identifying the client
 */
	identify(input) {
		this.name = input.client;

		if(!this.validate_client_secret(input.secret)) {
			this.identified = false;
			Logger.warn(`Client "${this.name}" secret key does not match in config file`);
			this.emit('event', {
				type: 'identify',
				success: false,
				message: 'Client secret is not correct'
			});
			return false;
		}

		//Create auth token
		this.auth_token = Randtoken.generate(16);

		Logger.success(`Client identified "${this.name}" secret (${this.ident})`);
		this.identified = true;
		
		this.emit('event', {
			type: 'identify',
			success: true,
			message: 'Successfully identified',
			auth_token: this.auth_token
		});

		this.app.Event.emit('client.identified', {
			client: this
		});

		return true;
	}


/**
 * Handshake from user
 *
 * @param {Object} input Input from the client
 * @returns {boolean} Success of handshake the client
 */
	handshake(input) {
		Logger.info(`Handshake from ${input.token} (${this.ident})`);

		//Identify this user
		//This will create them a new session and trigger an onboarding
		//event if this is a new session. e.g. Welcome to GI!
		let session = this.app.Auth.authenticate(input.token, this);

		//Handshake from user via client
		this.app.Event.emit('client.handshake', {
			client: this,
			token: input.token,
			session_id: session.session_id
		});

		//Send data back to client for the user
		return this.emit('event', {
			type: 'handshake',
			success: true,
			message: 'Successfully handshaked',
			session_id: session.session_id,
			token: input.token
		});
	}


/**
 * Request
 *
 * @param {Object} input Input from the client
 * @returns {boolean} Success of handling the request
 */
	request(input) {
		this.request_count++;

		//Invalid request
		if(!this.validate_request(input)) {
			for(let ii = 0; ii < this.validation_errors.length; ii++) {
				Logger.warn(`Request validation error: ${this.validation_errors[ii]}`);
			}
			this.emit('event', {
				type: 'request',
				success: false,
				message: this.validation_errors.join(', ')
			});
			return false;
		}

		//Users auth session
		let _auth = this.user_auth(input);

		if(!_auth) {
			Logger.warn('User session does not exist');
			this.emit('event', {
				type: 'request',
				success: false,
				message: ['User session does not exist']
			});
			return false;
		}

		//Session id to input
		input.session_id = _auth.session.session_id;

		//Client identifier
		input.client_id = this.ident;

		return this.app.request(input);
	}


/**
 * User session
 *
 * @param {Object} input Input from the client
 * @returns {Object} Auth object, user and session
 */
  user_auth(input) {
		return this.app.Auth.identify(input.session_id);
  }


/**
 * Validate request
 * 
 * @param {Object} input Input from the client
 * @returns {boolean} If the incoming is valid
 */
	validate_request(input) {
		let type = input.type;
		this.validation_errors = [];

		//Identified
		if(!this.identified) {
			this.validation_errors.push('Client not identified with secret');
		}

		//Client auth is valid
		if(!this.validate_auth_token(input.auth_token)) {
			this.validation_errors.push('Client token is not valid');
		}

		//Client defined
		if(typeof input.client === 'undefined' || input.client === '') {
			this.validation_errors.push('Client not defined');
		}

		//Session id defined
		if(typeof input.session_id === 'undefined' || input.session_id === '') {
			this.validation_errors.push('User session id not defined');
		}

		//Text defined
		//If the type is message
		if(type === 'message' && (typeof input.text === 'undefined' || input.text === '')) {
			this.validation_errors.push('Text not defined');
		}

		return this.validation_errors.length > 0 ? false : true;
	}


/**
 * Validate client secret
 *
 * @param {string} secret Secret to check
 * @returns {boolean} If the secret is correct and matches in the config file
 */
	validate_client_secret(secret) {
		var expecting = Config.read('clients.'+this.name+'.secret');
		if(secret !== expecting) {
			return false;
		}
		return true;
	}


/**
 * Validate session token
 *
 * @param {string} token Token to validate
 * @returns {boolean} If the token is valid
 */
	validate_auth_token(token) {
		if(token !== this.auth_token) {
			return false;
		}
		return true;
	}


/**
 * Disconnect
 *
 * @returns {boolean} If disconnected
 */
	disconnect() {
		Logger.info(`Client ${this.name} (${this.ident}) Disconnected`);
		return this.server.remove_client(this.ident);
	}

}
