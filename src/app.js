// brain.js
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


module.exports = {
	apps: [],
	verbose: true,

	
	load: function(apps) {
		const obj = new EventEmitter();
		this.__proto__ = obj;

		//Config
		this.Config = new Config();

		this.Auth = new Auth();
		this.Auth.initialize();

		this.Learn = new Learn();
		this.Learn.initialize(this);

		this.Queue = new Queue(this);

		this.Entities = new Entities();
		this.Entities.initialize(this);

		this.Intents = new Intents();
		this.Intents.initialize(this);

		this.Server = new Server(this);

		//Start
		this.start(apps);
	},


/**
 * Start
 *
 * @access public
 * @return void
 */
	start: function(apps) {
		this.load_apps(apps);
		this.load_entities();
	},


/**
 * Load apps
 *
 * @access public
 * @return void
 */
	load_apps: function(apps) {
		for(var ii=0; ii<apps.length; ii++) {
			var app = require('../apps/'+apps[ii]+'/app');
			app.load(this);
			this.apps.push(app);
		}
	},


/**
 * Load entities
 * 
 * @access public
 * @return void
 */
	load_entities: function() {
		this.log('Loading Entities');
		for(var ii=0; ii<this.apps.length; ii++) {
			this.Entities.load_all(this.apps[ii].name);
		}

		var that = this;
		Promise.all(this.Entities.promises).then(function() {
			that.load_intents();
		});
	},


/**
 * Load intents
 * 
 * @access public
 * @return void
 */
	load_intents: function() {
		this.log('Loading Intents');
		for(var ii=0; ii<this.apps.length; ii++) {
			this.Intents.load_all(this.apps[ii].name);
		}

		var that = this;
		Promise.all(this.Intents.promises).then(function() {
			that.load_queue();
		});
	},


/**
 * Load queue
 * 
 * @access public
 * @return void
 */
	load_queue: function() {
		this.log('Starting Queue');
		this.Queue.start();
		this.load_server();
	},


/**
 * Load server
 * 
 * @access public
 * @return void
 */
	load_server: function() {
		if(!this.Config.read("server.enabled")) {
			return;
		}
		this.log('Starting Server');
		this.Server.start();

		var that = this;
		this.Server.on('listening', function() {
			that.emit('ready');
		});
	},


/**
 * Log
 * 
 * @param string msg
 * @access public
 * @return void
 */
	log: function(msg, ident) {
		if(ident) {
			msg = ident+': '+msg;
		}
		
		if(this.verbose) {
			console.log(msg);
		}

		//Write to file
		this.write_log('system',msg);
	},


/**
 * Error
 * 
 * @param string msg
 * @access public
 * @return void
 */
	error: function(msg, options) {
		if(options && options.ident) {
			msg = options.ident+': '+msg;
		}

		this.log(msg);
		this.write_log('error',msg);
	},


/**
 * Write to a log file
 * 
 * @param string type
 * @param string msg
 * @access public
 * @return void
 */
	write_log: function(type, text) {
		var filename = this.Config.read('root_dir')+'/logs/'+type+'/'+moment().format('MM-DD-YYYY')+'.txt'
		var line = moment().format('MM-DD-YYYY HH:mm:ss')+': '+text+"\n";

		fs.appendFile(filename, line, function (err) {
		});
	},


/**
 * Shutdown
 *
 * @access public
 * @return boolean
 */
	shutdown: function() {
		this.log('Shutting down');
		this.apps = [];
		this.Server.stop();
	},


/**
 * Request
 *
 * Take input and process it
 *
 * @param object client
 * @param string input
 * @return boolean
 */
	request: function(client, input) {
		this.Queue.add(client,input);
	}

}

