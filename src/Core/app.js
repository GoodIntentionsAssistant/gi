/**
 * App
 */

//Require hack setup
//https://gist.github.com/branneman/8048520
global.girequire = name => {
	let path = __dirname + '/../..';
	return require(`${path}/${name}`);
};

const Promise = require('promise');
const fs = require('fs');
const moment = require('moment');
const extend = require('extend');
const util = require("util");
const EventEmitter = require('events').EventEmitter;

const Error = require('./../Error/error.js');

const Config = require('../Config/config.js');
const Log = require('./log.js');
const Event = require('./event.js');

const Auth = require('./../Auth/auth.js');
const Train = require('./../Train/train.js');
const Explicit = require('./../Train/explicit.js');
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

		//Make sure config exists
		let configFile = './app/Config/config.json';
		if (!fs.existsSync(configFile)) {
			this.Error.fatal([
				`Cannot start GI, your config file was not found`,
				`Make sure ${configFile} exists`,
				`Copy the existing config.example.json to config.json and make changes before running again`
			]);
		}

		this.Event = new Event(this);
		this.Log = new Log(this);
		
		this.Train = new Train(this);
		this.Explicit = new Explicit(this);
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
			this.Error.warning('No skills loaded. Check your config file and GI docs to get started');
		}

		//Promises
		let promises = [];

		for(var ii=0; ii<skills.length; ii++) {
			let skill = this.SkillRegistry.load(skills[ii]);
			promises.push(skill.promise);
		}

		Promise.all(promises).then(() => {
			this.load_queue();
		}).catch((err) => {
			//@todo Catch error
			console.log(err);
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
			this.Error.warning('Your server is not enabled. Check your config file');
			return;
		}
		this.Log.add('Starting Server');
		this.Server.start();

		this.Server.on('listening', () => {
			this.emit('ready');
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
 * Take input and add it to the queue.
 * All requests go through this method.
 *
 * @todo Change errors so they aren't fatal
 * @param string input
 * @access public
 * @return boolean
 */
	request(input) {

		//Validate
		if(!input.session_id) {
			this.Error.warning('Input had no session_id specified');
			return;
		}

		if(!input.client_id) {
			this.Error.warning('Input had no client_id specified');
			return;
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

