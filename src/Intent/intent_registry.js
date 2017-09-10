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
	}


/**
 * After load
 *
 * @access public
 * @return void
 */
  after_load(intent) {
		//Setup intent
		intent.setup();

		//Load the intent
		intent.load();

		//Once the intent has loaded then train
		intent.promise.then((result) => {
			this._train(intent);
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

}



