/**
 * Client
 */
const Randtoken = require('rand-token');

var Client = function() {
	this.ident = null;
	this.client = null;
	this.created = null;
	this.name = null;
	this.identified = false;
	this.request_count = 0;
}


/**
 * Initialize
 *
 * @param object app
 * @param object server
 * @access public
 * @return void
 */
Client.prototype.initialize = function(app, server, client) {
	this.app = app;
	this.server = server;
	this.client = client;

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
Client.prototype.load = function() {
  this.app.log('Client Connected');

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
Client.prototype.emit = function(namespace, type, data) {
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
Client.prototype.identify = function(input) {
	this.name = input.client;

	if(!this.validate_client_token(input.token)) {
		this.identified = false;
		this.app.error('Client '+this.name+' failed token auth');
		this.emit('event', 'identify', {
			success: false,
			message: 'Client token is not correct'
		});
		return;
	}

  this.app.log('Client identified '+this.name+' ('+this.ident+')');
	this.identified = true;
	
	this.emit('event','identify', {
		success: true,
		message: 'Successfully identified',
		session_token: this.session_token
	});
}


/**
 * Request
 *
 * @param hash input
 * @access public
 * @return void
 */
Client.prototype.request = function(input) {
	if(!this.identified) {
		this.app.error('Request from '+this.name+' but client has not identified');
		this.emit('event', 'request', {
			success: false,
			message: 'You have not identified this client'
		});
		return;
	}

	if(!this.validate_session_token(input.session_token)) {
		this.app.error('Request from '+this.name+' but session token failed');
		this.emit('event', 'request', {
			success: false,
			message: 'Session token for the request is not valid'
		});
		return;
	}

	this.request_count++;
  this.app.request(this.client, input);
}


/**
 * Validate client token
 *
 * @param hash input
 * @access public
 * @return void
 */
Client.prototype.validate_client_token = function(token) {
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
Client.prototype.validate_session_token = function(token) {
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
Client.prototype.disconnect = function() {
  this.app.log('Client '+this.name+' ('+this.ident+') Disconnected');
  this.server.remove_client(this.ident);
}


module.exports = Client;
