/**
 * Server
 */
const EventEmitter = require('events').EventEmitter;
const Randtoken = require('rand-token');

const Logger = girequire('/src/Helpers/logger.js');
const Client = girequire('/src/Server/client.js');
const Config = girequire('src/Config/config.js');

module.exports = class Server extends EventEmitter {

/**
 * Constructor
 *
 * @param {Object} app App instance
 * @constructor
 */
	constructor(app) {
		super();

		this.app = app;

		this.object = null;
		this.clients = [];
	}


/**
 * Start server
 *
 * @returns {boolean} If server successfully loaded
 */
	start() {
		this.object = require('http').createServer();

		const io = require('socket.io')(this.object);
	
		io.on('connection', (_client) => {
			var client = new Client(this.app, this, _client);
			this.add_client(client);
			client.load();
		});
	
		//Listen
		const port = Config.read('server.port');

		//Assistant name
		const assistant_name = Config.read('name');
	
		try {
			this.object.listen(port, () => {
				Logger.success(`Server listening on port ${port}`);
				Logger.success(`Your assistant is ready and named "${assistant_name}"`);
				this.emit('listening');
			});
		}
		catch(err) {
			Logger.error('Server Error', { error: err });
			return false;
		}

		return true;
	}
	

/**
 * Stop
 *
 * @returns {boolean} Success of stopping the server
 */
	stop() {
		if(!this.object) {
			Logger.error('Failed to stop server, maybe it has not started?');
			return false;
		}

		this.object.close();
		Logger.success('Server has been stopped');

		return true;
	}


/**
 * Find client
 *
 * @param {string} client_id Client id to find
 * @returns {*} Either the client object or false
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
 * @param {Object} client Client object to store
 * @returns {string} Client id
 */
	add_client(client) {
		let client_id = Randtoken.generate(16);

		client.ident = client_id;
		client.client_id = client_id;

		this.clients.push({
			client_id,
			client
		});

		Logger.info(`Client "${client_id}" added to server`);

		return client_id;
	}


/**
 * Remove client
 *
 * @param {string} client_id Client id to find and remove
 * @returns {boolean} Success of removing client
 */
	remove_client(client_id) {
		for(let ii=0; ii<this.clients.length; ii++) {
			if(this.clients[ii].client_id === client_id) {
				Logger.info(`Client "${client_id}" removed from server`);
				this.clients.splice(ii, 1);
				return true;
			}
		}
		return false;
	}

}
