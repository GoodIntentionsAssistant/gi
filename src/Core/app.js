/**
 * App
 */

const Promise = require('promise');
const fs = require('fs');
const moment = require('moment');
const extend = require('extend');
const util = require("util");
const EventEmitter = require('events').EventEmitter;

const Error = require('./../Error/error.js');

const File = require('./../Filesystem/file.js');
const Folder = require('./../Filesystem/folder.js');
const Path = require('./../Filesystem/path.js');

const Config = require('./config.js');
const Log = require('./log.js');

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

		this.Error = new Error();

		this.File = new File();
		this.Folder = new Folder();

		this.Config = new Config(this);
		this.Path = new Path(this);
		this.Log = new Log(this);

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
		//Skills
		let skills = this.Config.read('skills');

		//Health check the skills
		if(!skills.length) {
			this.Error.fatal('No skills specified to load in your config file. You must have at least one skill to load.');
		}

		//Start the main loop
		this.timer = null;
		this.loop_speed = this.Config.read('app.loop_speed');
		this.loop();

		//Require skill files
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
		this.Log.add('Starting Queue');
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
		this.Log.add('Starting Server');
		this.Server.start();

		var that = this;
		this.Server.on('listening', function() {
			that.emit('ready');
		});
	}


/**
 * Shutdown
 *
 * @access public
 * @return boolean
 */
	shutdown() {
		this.Log.add('Shutting down');
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

