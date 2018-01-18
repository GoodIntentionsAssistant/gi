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
const Event = require('./event.js');

const Auth = require('./../Auth/auth.js');
const Train = require('./../Train/train.js');
const Understand = require('./../Train/understand.js');
const Queue = require('./../Request/queue.js');
const Server = require('./../Server/server.js');

const Scheduler = require('./../Scheduler/scheduler.js');

const Data = require('./../Data/data.js');

const SkillRegistry = require('./../Skill/skill_registry.js');
const EntityRegistry = require('./../Entity/entity_registry.js');
const IntentRegistry = require('./../Intent/intent_registry.js');
const AttachmentRegistry = require('./../Attachment/attachment_registry.js');


module.exports = class App extends EventEmitter {

/**
 * Constructor
 *
 * @access public
 * @return void
 */
	constructor() {
		super();

		this.skills 	= [];
		this.verbose 	= true;
		this.timer 		= null;

		this.Error = new Error();

		this.File = new File();
		this.Folder = new Folder();

		this.Event = new Event(this);
		this.Path = new Path(this);
		this.Log = new Log(this);
		
		this.Train = new Train(this);
		this.Understand = new Understand(this);

		this.Auth = new Auth(this);
		this.Queue = new Queue(this);
		this.Server = new Server(this);

		this.Scheduler = new Scheduler(this);

		this.Data = new Data(this);

		this.SkillRegistry 			= new SkillRegistry(this);
		this.EntityRegistry 		= new EntityRegistry(this);
		this.IntentRegistry 		= new IntentRegistry(this);
		this.AttachmentRegistry = new AttachmentRegistry(this);
	}


/**
 * Start
 *
 * @access public
 * @return void
 */
	load() {
		//Start the main loop
		this.loop_speed = Config.read('app.loop_speed');
		this.loop();

		//Load attachments
		this.load_attachments();

		//Require skill files
		this.load_skills();
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

		//Event
		this.Event.emit('app.loop');

		//Loop again
		this.timer = setTimeout(() => {
			this.loop();
		}, this.loop_speed);
	}


/**
 * Load attachments
 *
 * @access public
 * @return void
 */
	load_attachments() {
		let attachments = Config.read('attachments');

		for(var ii=0; ii<attachments.length; ii++) {
			this.AttachmentRegistry.load(attachments[ii]);
		}
	}


/**
 * Load skills
 *
 * @access public
 * @return void
 */
	load_skills() {
		//Skills
		let skills = Config.read('skills');

		//Health check the skills
		if(!skills.length) {
			this.Error.fatal('No skills specified to load in your config file. You must have at least one skill to load.');
		}

		//Promises
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
		if(!Config.read("server.enabled")) {
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
 * @param string input
 * @return boolean
 */
	request(input) {
		//Validate
		if(!input.session) {
			App.Error.fatal('Input had no session specified');
		}

		if(!input.client_id) {
			App.Error.fatal('Input had no client_id specified');
		}

		//Default type will be message
		if(!input.type) {
			input.type = 'message';
		}

		//Intent has been defined, no text will be passed
		//The user wants to go directly to an intent
		if(input.intent) {
			input.type = 'intent';
		}

		this.Queue.add(input);
	}

}

