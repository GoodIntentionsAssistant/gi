/**
 * Skill
 */
const Promise = require('promise');

module.exports = class Skill {

/**
 * Constructor
 *
 * @access public
 * @return void
 */
	constructor(app) {
		this.app = app;
	}


/**
 * Setup skill
 *
 * @access public
 * @return void
 */
	setup() {
	}

	
/**
 * Load skill
 *
 * @access public
 * @return void
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
	}


/**
 * Load skill intents
 *
 * @access public
 * @return void
 */
	load_intents() {
		let options = {};

		//
		if(typeof this.intents != 'undefined' && this.intents.length > 0) {
			options['only'] = this.intents;
		}

		this.app.Log.add('Loading Intents for '+this.identifier);
		return this.app.IntentRegistry.load_all(this.identifier, options);
	}


/**
 * Load skill entities
 *
 * @access public
 * @return void
 */
	load_entities() {
		this.app.Log.add('Loading Entities for '+this.identifier);
		return this.app.EntityRegistry.load_all(this.identifier);
	}

}
