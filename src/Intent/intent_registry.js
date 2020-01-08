/**
 * Intent Registry
 */
const ObjectRegistry = girequire('/src/Core/object_registry');

module.exports = class IntentRegistry extends ObjectRegistry {

/**
 * Constructor
 *
 * @constructor
 * @param {Object} app App instance
 */
	constructor(app) {
		super(app);

		this.type = 'Intent';
		this.app = app;
	}


/**
 * After load
 *
 * @param {Object} intent Intent instance
 * @returns {boolean} Success
 */
  after_load(intent) {
		//Setup intent
		intent.setup(this.app);

		//Load the intent
		intent.load();

		//Once the intent has loaded
		intent.promise.then((result) => {
			//Train keywords
			this._train(intent);

			//Explicits
			this._explicits(intent);
		}).catch((error) => {
			//Error
			throw new Error(`Failed to train from intent`, { error });
		});

		return true;
	}


/**
 * Train
 *
 * @param {Object} intent Intent instance
 * @returns {boolean} If trained
 */
	_train(intent) {
		let keywords = intent.keywords();

		for(let tt=0; tt<keywords.length; tt++) {
			this.app.Train.train(keywords[tt].identifier, keywords[tt].keyword, keywords[tt].options);
		}

		return true;
	}


/**
 * Explicits
 *
 * @param {Object} intent Intent instance
 * @returns {boolean} If adding explicit
 */
	_explicits(intent) {
		let explicits = intent.explicits();

		for(let tt=0; tt<explicits.length; tt++) {
			this.app.Explicit.train(explicits[tt].type, explicits[tt].identifier, explicits[tt].keyword, explicits[tt].options);
		}

		return true;
	}


/**
 * Unload Intent
 *
 * @param {string} identifier Identifier
 * @returns {boolean} If unloaded
 */
	unload(identifier) {
		let check = this.remove(identifier);

		if(!check) {
			return false;
		}

		//Untrain
		this.app.Train.untrain(identifier);

		return true;
	}

}



