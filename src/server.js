/**
 * Server
 */
const EventEmitter = require('events').EventEmitter;
const util = require('util');
const Client = require('./client.js');

var Server = function() {
	this.object = null;
	this.clients = [];
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

	io.on('connection', function(_client){
		var client = new Client();
		client.initialize(that.app, that, _client);
		that.add_client(client);
		client.load();
	});

	//Listen
	var port = this.app.Config.read('server.port');

	try {
		this.object.listen(port, function() {
			that.app.log('Listening on port '+port);
			that.app.log('Ready to take client connections and rock and roll!');
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
 * Add Client
 *
 * @param object client
 * @access public
 * @return void
 */
Server.prototype.add_client = function(client) {
	var ident = Math.random().toString(36).substr(2, 8).toUpperCase();
	client.ident = ident;
	this.clients.push({
		ident: ident,
		client: client
	});
	return ident;
}


/**
 * Remove Client
 *
 * @param string ident
 * @access public
 * @return boolean
 */
Server.prototype.remove_client = function(ident) {
	for(var ii=0; ii<this.clients.length; ii++) {
		if(this.clients[ii].ident == ident) {
			this.app.log('Client removed');
			this.clients.splice(ii, 1);
			return true;
		}
	}
	return false;
}


module.exports = Server;
