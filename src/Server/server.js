/**
 * Server
 */
const EventEmitter = require('events').EventEmitter;
const util = require('util');
const Client = require('./client.js');
const Randtoken = require('rand-token');

module.exports = class Server extends EventEmitter {

/**
 * Constructor
 *
 * @access public
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
 * @access public
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
		let port = this.app.Config.read('server.port');
	
		try {
			this.object.listen(port, () => {
				this.app.Log.add('Listening on port '+port);
				this.app.Log.add('Ready to take client connections and rock and roll!');
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
 * @access public
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
 * Add client
 *
 * @param object client
 * @access public
 * @return void
 */
	add_client(client) {
		let ident = Randtoken.generate(16);
		client.ident = ident;
		this.clients.push({
			ident: ident,
			client: client
		});
		return ident;
	}


/**
 * Remove client
 *
 * @param string ident
 * @access public
 * @return void
 */
	remove_client(ident) {
		for(var ii=0; ii<this.clients.length; ii++) {
			if(this.clients[ii].ident == ident) {
				this.app.Log.add('Client removed');
				this.clients.splice(ii, 1);
				return true;
			}
		}
		return false;
	}

}
