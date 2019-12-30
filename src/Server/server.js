/**
 * Server
 */
const EventEmitter = require('events').EventEmitter;
const util = require('util');
const Client = require('./client.js');
const Randtoken = require('rand-token');
const Config = require('../Config/config.js');

module.exports = class Server extends EventEmitter {

/**
 * Constructor
 *
 * @return void
 */
	constructor(app) {
		super();

		this.object = null;
		this.clients = [];
		this.app = app;
	}


/**
 * Start
 *
 * @return void
 */
	start() {
		this.object = require('http').createServer();
		let io = require('socket.io')(this.object);
	
		io.on('connection', (_client) => {
			var client = new Client(this.app, this, _client);
			this.add_client(client);
			client.load();
		});
	
		//Listen
		let port = Config.read('server.port');
	
		try {
			this.object.listen(port, () => {
				this.app.Log.add('Listening on port '+port);
				this.app.Log.add('Your assistant is ready and named "' + Config.read('name') + '"');
				this.emit('listening');
			});
		}
		catch(err) {
			this.app.Log.error('Server Error: '+err);
		}
	}
	

/**
 * Stop
 *
 * @return void
 */
	stop() {
		if(!this.object) {
			return false;
		}
		this.object.close();
		return true;
	}


/**
 * Find client
 *
 * @param client_id
 * @return object
 */
	find_client(client_id) {
		for(let ii=0; ii<this.clients.length; ii++) {
			if(this.clients[ii].client_id === client_id) {
				return this.clients[ii].client;
			}
		}
		return false;
	}


/**
 * Add client
 *
 * @param object client
 * @return void
 */
	add_client(client) {
		let client_id = Randtoken.generate(16);

		client.ident = client_id;
		client.client_id = client_id;

		this.clients.push({
			client_id,
			client
		});

		return client_id;
	}


/**
 * Remove client
 *
 * @param string ident
 * @return void
 */
	remove_client(client_id) {
		for(let ii=0; ii<this.clients.length; ii++) {
			if(this.clients[ii].client_id === client_id) {
				this.app.Log.add('Client removed');
				this.clients.splice(ii, 1);
				return true;
			}
		}
		return false;
	}

}
