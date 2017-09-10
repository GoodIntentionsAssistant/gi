/**
 * App
 */

const Promise = require('promise');
const fs = require('fs');
const moment = require('moment');
const extend = require('extend');
const util = require("util");
const EventEmitter = require('events').EventEmitter;

const Config = require('./config.js');
const Path = require('./path.js');

const Auth = require('./../Auth/auth.js');
const Train = require('./../Train/train.js');
const Queue = require('./../Request/queue.js');
const Server = require('./../Server/server.js');

const SkillRegistry = require('./../Skill/skill_registry.js');
const EntityRegistry = require('./../Entity/entity_registry.js');
const IntentRegistry = require('./../Intent/intent_registry.js');


module.exports = class App extends EventEmitter {

/**
 * Constructor
 *
 * @access public
 * @return void
 */
	constructor() {
		super();

		this.skills = [];
		this.verbose = true;

		this.Config = new Config();
		this.Path = new Path(this);

		this.Auth = new Auth();
		this.Train = new Train(this);
		this.Queue = new Queue(this);
		this.Server = new Server(this);

		this.EntityRegistry = new EntityRegistry(this);
		this.IntentRegistry = new IntentRegistry(this);
		this.SkillRegistry = new SkillRegistry(this);
	}


/**
 * Start
 *
 * @access public
 * @return void
 */
	load() {
		//Start the main loop
		this.timer = null;
		this.loop_speed = this.Config.read('app.loop_speed');
		this.loop();

		//Require skill files
		let skills = this.Config.read('skills');
		this.load_skills(skills);
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
 * Load skills
 *
 * @access public
 * @return void
 */
	load_skills(skills) {
		let promises = [];

		for(var ii=0; ii<skills.length; ii++) {
			let skill = this.SkillRegistry.load(skills[ii]);
			promises.push(skill.promise);
		}

		Promise.all(promises).then(() => {
			this.load_queue();
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
		var filename = this.Path.get('logs')+'/'+type+'/'+moment().format('MM-DD-YYYY')+'.txt'
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
		this.skills = [];
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

