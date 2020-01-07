/**
 * Skill
 */
const Promise = require('promise');

const Logger = girequire('/src/Helpers/logger.js');

module.exports = class Skill {

/**
 * Constructor
 *
 * @constructor
 * @param {Object} app App instance
 */
	constructor(app) {
		this.app = app;
	}


/**
 * Setup skill
 *
 */
	setup() {
	}

	
/**
 * Load skill
 *
 * @todo Clean this method up and remove console logs
 * @returns {boolean}
 */
	load() {
		//Load
		this.promise = new Promise((resolve, reject) => {
			//Load intents
			let intent_promises = this.load_intents();

			//Load entities
			let entity_promises = this.load_entities();

			Promise.all([intent_promises, entity_promises]).then(() => {
				resolve();
			}).catch((err) => {
				//@todo Catch error
				console.log(err);
			});

		}).catch((err) => {
			//@todo Catch error
			console.log(err);
		});

		return true;
	}


/**
 * Load skill intents
 *
 * @returns {*}
 */
	load_intents() {
		let options = {};

		//
		if(typeof this.intents !== 'undefined' && this.intents.length > 0) {
			options['only'] = this.intents;
		}

		Logger.info(`Loading Intents for ${this.identifier}`);

		return this.app.IntentRegistry.load_all(this.identifier, options);
	}


/**
 * Load skill entities
 *
 * @returns {*}
 */
	load_entities() {
		Logger.info(`Loading Entities for ${this.identifier}`);
		return this.app.EntityRegistry.load_all(this.identifier);
	}

}
