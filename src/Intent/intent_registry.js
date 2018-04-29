/**
 * Intent Registry
 */
const extend = require('extend');
const Promise = require('promise');
const fs = require('fs');
const _ = require('underscore');
_.mixin(require('underscore.inflections'));

const ObjectRegistry = require('../Core/object_registry.js');

module.exports = class IntentRegistry extends ObjectRegistry {

/**
 * Constructor
 *
 * @param object app
 * @access public
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
 * @access public
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
		});
	}


/**
 * Train
 *
 * @param object intent
 * @access public
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
 * @access public
 * @return void
 */
	_explicits(intent) {
		let explicits = intent.explicits();

		for(let tt=0; tt<explicits.length; tt++) {
			this.app.Explicit.train(explicits[tt].type, explicits[tt].identifier, explicits[tt].keyword, explicits[tt].options);
		}
	}

}



