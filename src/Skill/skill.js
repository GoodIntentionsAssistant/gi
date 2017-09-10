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

	
	setup() {
	}


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


	load_intents() {
		this.app.log('Loading Intents for '+this.name);
		return this.app.IntentRegistry.load_all(this.name);
	}


	load_entities() {
		this.app.log('Loading Entities for '+this.name);
		return this.app.EntityRegistry.load_all(this.name);
	}

}
