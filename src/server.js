/**
 * Server
 */
const EventEmitter = require('events').EventEmitter;
const util = require('util');
const Agent = require('./agent.js');

var Server = function() {
	this.object = null;
	this.agents = [];
}


//
util.inherits(Server, EventEmitter);


/**
 * Initialize
 *
 * @param object app
 * @access public
 * @return void
 */
Server.prototype.initialize = function(app) {
	this.app = app;
}


/**
 * Load
 *
 * @access public
 * @return void
 */
Server.prototype.start = function() {
	var that = this;

	this.object = require('http').createServer();
	var io = require('socket.io')(this.object);

	io.on('connection', function(client){
		var agent = new Agent();
		agent.initialize(that.app, that, client);
		that.add_agent(agent);
		agent.load();
	});

	//Listen
	var port = this.app.config.server.port;

	try {
		this.object.listen(port, function() {
			that.app.log('Listening on port '+port);
			that.app.log('Ready to take agent connections and rock and roll!');
			that.emit('listening');
		});
	}
	catch(err) {
		this.app.error('Server Error: '+err);
	}

}


/**
 * Stop
 *
 * @access public
 * @return void
 */
Server.prototype.stop = function() {
	if(!this.object) {
		return false;
	}
	this.object.close();
	return true;
}


/**
 * Add Agent
 *
 * @param object agent
 * @access public
 * @return void
 */
Server.prototype.add_agent = function(agent) {
	var ident = Math.random().toString(36).substr(2, 8).toUpperCase();
	agent.ident = ident;
	this.agents.push({
		ident: ident,
		agent: agent
	});
	return ident;
}


/**
 * Remove Agent
 *
 * @param string ident
 * @access public
 * @return boolean
 */
Server.prototype.remove_agent = function(ident) {
	for(var ii=0; ii<this.agents.length; ii++) {
		if(this.agents[ii].ident == ident) {
			this.app.log('Agent removed');
			this.agents.splice(ii, 1);
			return true;
		}
	}
	return false;
}


module.exports = Server;
