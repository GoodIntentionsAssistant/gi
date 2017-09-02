const Promise = require('promise');
const fs = require('fs');
const moment = require('moment');
const extend = require('extend');
const util = require("util");
const EventEmitter = require('events').EventEmitter;

const Config = require('./config.js');
const Auth = require('./auth.js');
const Learn = require('./learn.js');
const Entities = require('./entities.js');
const Intents = require('./intents.js');
const Queue = require('./queue.js');
const Server = require('./server.js');


module.exports = class App extends EventEmitter {

/**
 * Constructor
 *
 * @access public
 * @return void
 */
	constructor() {
		super();

		this.apps = [];
		this.verbose = true;

		this.Config = new Config();
		this.Auth = new Auth();
		this.Learn = new Learn(this);
		this.Queue = new Queue(this);
		this.Entities = new Entities(this);
		this.Intents = new Intents(this);
		this.Server = new Server(this);
	}


/**
 * Start
 *
 * @access public
 * @return void
 */
	load(apps) {
		//Start the main loop
		this.timer = null;
		this.loop_speed = this.Config.read('app.loop_speed');
		this.loop();

		//Require app files
		this.load_apps(apps);

		//Load entity data
		this.load_entities();
	}
	
	
	/**
	 * Loop
	 *
	 * @access public
	 * @return void
	 */
		loop() {
			//Queue
			if(this.Queue.active) {
				this.Queue.check();
			}

			this.timer = setTimeout(() => {
				this.loop();
			}, this.loop_speed);
		}


/**
 * Load apps
 *
 * @access public
 * @return void
 */
	load_apps(apps) {
		for(var ii=0; ii<apps.length; ii++) {
			var app = require('../apps/'+apps[ii]+'/app');
			app.load(this);
			this.apps.push(app);
		}
	}


/**
 * Load entities
 * 
 * @access public
 * @return void
 */
	load_entities() {
		this.log('Loading Entities');
		for(var ii=0; ii<this.apps.length; ii++) {
			this.Entities.load_all(this.apps[ii].name);
		}

		var that = this;
		Promise.all(this.Entities.promises).then(function() {
			that.load_intents();
		});
	}


/**
 * Load intents
 * 
 * @access public
 * @return void
 */
	load_intents() {
		this.log('Loading Intents');
		for(var ii=0; ii<this.apps.length; ii++) {
			this.Intents.load_all(this.apps[ii].name);
		}

		var that = this;
		Promise.all(this.Intents.promises).then(function() {
			that.load_queue();
		});
	}


/**
 * Load queue
 * 
 * @access public
 * @return void
 */
	load_queue() {
		this.log('Starting Queue');
		this.Queue.start();
		this.load_server();
	}


/**
 * Load server
 * 
 * @access public
 * @return void
 */
	load_server() {
		if(!this.Config.read("server.enabled")) {
			return;
		}
		this.log('Starting Server');
		this.Server.start();

		var that = this;
		this.Server.on('listening', function() {
			that.emit('ready');
		});
	}


/**
 * Log
 * 
 * @param string msg
 * @access public
 * @return void
 */
	log(msg, ident) {
		if(ident) {
			msg = ident+': '+msg;
		}
		
		if(this.verbose) {
			console.log(msg);
		}

		//Write to file
		this.write_log('system',msg);
	}


/**
 * Error
 * 
 * @param string msg
 * @access public
 * @return void
 */
	error(msg, options) {
		if(options && options.ident) {
			msg = options.ident+': '+msg;
		}

		this.log(msg);
		this.write_log('error',msg);
	}


/**
 * Write to a log file
 * 
 * @param string type
 * @param string msg
 * @access public
 * @return void
 */
	write_log(type, text) {
		var filename = this.Config.read('root_dir')+'/logs/'+type+'/'+moment().format('MM-DD-YYYY')+'.txt'
		var line = moment().format('MM-DD-YYYY HH:mm:ss')+': '+text+"\n";

		fs.appendFile(filename, line, function (err) {
		});
	}


/**
 * Shutdown
 *
 * @access public
 * @return boolean
 */
	shutdown() {
		this.log('Shutting down');
		this.apps = [];
		this.Server.stop();
	}


/**
 * Request
 *
 * Take input and process it
 *
 * @param object client
 * @param string input
 * @return boolean
 */
	request(client, input) {
		this.Queue.add(client,input);
	}

}

