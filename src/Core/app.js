/**
 * App
 */

const Promise = require('promise');
const fs = require('fs');
const EventEmitter = require('events').EventEmitter;

//
require('../Helpers/gi_require');

//
const Logger = girequire('/src/Helpers/logger.js');

const Config = require('../Config/config.js');
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

		//Checks to make sure the system is configured correctly
		this.initChecks();

		this.Event = new Event(this);
		
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
 * Initalizing server checks
 * 
 * @access public
 * @return void
 */
	initChecks() {
		//Make sure config exists
		let configFile = './app/Config/config.json';
		if(!fs.existsSync(configFile)) {
			Logger.fatal([
				`Cannot start GI, your config file was not found`,
				`Make sure ${configFile} exists`,
				`Copy the existing config.example.json to config.json and make changes before running again`
			]);
		}

		//Make sure test secret has been changed
		if(Config.read('clients.test.secret') === 'changeme') {
			Logger.fatal([
				`Change the test secret in your ${configFile} file before continuing`
			]);
		}

		//Make sure there are skills added
		if(Config.read('skills').length === 0) {
			Logger.fatal([
				`You need to add at least one skill before loading the server`,
				`Otherwise the bot won't do anything!`,
				`First run, node gi fetch`,
				`Then install a basic package, node gi install gi-skill-basics`,
				`Then install some example packages, node gi install gi-skill-examples`
			]);
		}
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
			Logger.warn(`No skills loaded. Check your config file and GI docs to get started`);
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
		Logger.info(`Starting Queue`);
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
			Logger.warn(`Your server is not enabled. Check your config file`);
			return;
		}

		Logger.info('Starting Server');
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
		Logger.info('Shutting down');
		this.skills = [];
		this.Server.stop();
	}


/**
 * Request
 *
 * Take input and add it to the queue.
 * All requests go through this method.
 *
 * @param {object} input
 * @returns {boolean}
 */
	request(input) {
		//Scheduler request
		//When the scheduler is emitted an intent will have a listener
		//This listener will typically generate a request to an intent
		if(input.scheduler) {
			input.client_id 		= input.scheduler.client_id;
			input.session_id 		= input.scheduler.session_id;
			input.schedule_data = input.scheduler;
			input.skip_queue 		= true;
		}

		//Validate session_id exists
		if(!input.session_id) {
			Logger.warn('Input had no session_id specified');
			return false;
		}

		//Validate client_id exists
		if(!input.client_id) {
			Logger.warn('Input had no client_id specified');
			return false;
		}

		//Default type will be message
		if(!input.type) {
			input.type = 'message';
		}

		//Intent has been defined, no text will be passed
		//The request wants to go directly to an intent
		if(input.intent) {
			input.type = 'intent';
		}

		this.Queue.add(input);

		return true;
	}

}

