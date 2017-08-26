/**
 * Agent
 */

var Agent = function() {
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
Agent.prototype.initialize = function(app, server, client) {
	this.app = app;
	this.server = server;
	this.client = client;

	//Vars
	this.name = 'Unknown Agent';
	this.created = Date.now();
}


/**
 * Load
 *
 * @access public
 * @return void
 */
Agent.prototype.load = function() {
  this.app.log('Agent Connected');

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
Agent.prototype.identify = function(input) {
	this.name = input.agent;

	if(!this.validate_token(input.token)) {
		this.identified = false;
		this.app.error('Agent '+this.name+' failed token auth');
		return;
	}

  this.app.log('Agent identified '+this.name+' ('+this.ident+')');
  this.identified = true;
}


/**
 * Request
 *
 * @param hash input
 * @access public
 * @return void
 */
Agent.prototype.request = function(input) {
	if(!this.identified) {
		this.app.error('Request from '+this.name+' but agent has not identified');
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
Agent.prototype.validate_token = function(token) {
	var expecting = this.app.config.agents[this.name].token;
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
Agent.prototype.disconnect = function() {
  this.app.log('Agent '+this.name+' ('+this.ident+') Disconnected');
  this.server.remove_agent(this.ident);
}


module.exports = Agent;
