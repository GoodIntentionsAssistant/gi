/**
 * Client
 */

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
 * Identify
 *
 * @param hash input
 * @access public
 * @return void
 */
Client.prototype.identify = function(input) {
	this.name = input.client;

	if(!this.validate_token(input.token)) {
		this.identified = false;
		this.app.error('Client '+this.name+' failed token auth');
		return;
	}

  this.app.log('Client identified '+this.name+' ('+this.ident+')');
  this.identified = true;
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
		return;
	}

	if(!this.validate_token(input.token)) {
		this.app.error('Request from '+this.name+' but passed token failed');
		return;
	}

	this.request_count++;
  this.app.request(this.client, input);
}


/**
 * Validate token
 *
 * @param hash input
 * @access public
 * @return void
 */
Client.prototype.validate_token = function(token) {
	var expecting = this.app.Config.read('clients.'+this.name+'.token');
	if(token != expecting) {
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
