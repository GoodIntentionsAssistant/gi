/**
 * Server
 */
const EventEmitter = require('events').EventEmitter;
const util = require('util');
const Client = require('./client.js');
const Randtoken = require('rand-token');


module.exports = class Server extends EventEmitter {

	constructor(app) {
		super();

		this.object = null;
		this.clients = [];
		this.app = app;
	}

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
				this.app.log('Listening on port '+port);
				this.app.log('Ready to take client connections and rock and roll!');
				this.emit('listening');
			});
		}
		catch(err) {
			this.app.error('Server Error: '+err);
		}
	}


	stop() {
		if(!this.object) {
			return false;
		}
		this.object.close();
		return true;
	}


	add_client(client) {
		let ident = Randtoken.generate(16);
		client.ident = ident;
		this.clients.push({
			ident: ident,
			client: client
		});
		return ident;
	}


	remove_client(ident) {
		for(var ii=0; ii<this.clients.length; ii++) {
			if(this.clients[ii].ident == ident) {
				this.app.log('Client removed');
				this.clients.splice(ii, 1);
				return true;
			}
		}
		return false;
	}

}
