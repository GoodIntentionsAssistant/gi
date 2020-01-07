/**
 * Intent Registry
 */
const ObjectRegistry = girequire('/src/Core/object_registry');

module.exports = class IntentRegistry extends ObjectRegistry {

/**
 * Constructor
 *
 * @param object app
 * @return void
 */
	constructor(app) {
		super(app);

		this.type = 'Intent';
		this.app = app;
	}


/**
 * After load
 *
 * @return void
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
	}


/**
 * Train
 *
 * @param object intent
 * @return void
 */
	_train(intent) {
		let keywords = intent.keywords();

		for(let tt=0; tt<keywords.length; tt++) {
			this.app.Train.train(keywords[tt].identifier, keywords[tt].keyword, keywords[tt].options);
		}
	}


/**
 * Explicits
 *
 * @param object intent
 * @return void
 */
	_explicits(intent) {
		let explicits = intent.explicits();

		for(let tt=0; tt<explicits.length; tt++) {
			this.app.Explicit.train(explicits[tt].type, explicits[tt].identifier, explicits[tt].keyword, explicits[tt].options);
		}
	}


/**
 * Unload Intent
 *
 * @param string intent
 * @return bool
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



