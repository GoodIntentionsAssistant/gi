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
			});
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
		if(typeof this.intents != 'undefined') {
			options['only'] = this.intents;
		}

		this.app.Log.add('Loading Intents for '+this.name);
		return this.app.IntentRegistry.load_all(this.name, options);
	}


/**
 * Load skill entities
 *
 * @access public
 * @return void
 */
	load_entities() {
		this.app.Log.add('Loading Entities for '+this.name);
		return this.app.EntityRegistry.load_all(this.name);
	}

}
