/**
 * Entity Registry
 */
const extend = require('extend');
const Promise = require('promise');
const fs = require('fs');
const _ = require('underscore');
_.mixin(require('underscore.inflections'));

const ObjectRegistry = girequire('/src/Core/object_registry');

module.exports = class EntityRegistry extends ObjectRegistry {

/**
 * Constructor
 *
 * @constructor
 * @param {Object} app App instance
 */
	constructor(app) {
		super(app);
		this.type = 'Entity';
	}


/**
 * After load
 *
 * @param {Object} entity Entity instance
 * @returns {boolean} Success
 */
  after_load(entity) {
		//Setup entity
		entity.setup();

		//Load the entity
		entity.load();

		return true;
	}



/**
 * Get entity
 * 
 * @param {string} identifier Identifier of the entity
 * @param {Object} options Optional for controlling getting the entity
 * @returns {Object} Entity object
 */
	get(identifier, options = {}) {
		//Options
		let _options = {
			cache: true
		};
		options = extend(_options, options);

		//Change identifier is config has remapped it
		identifier = this.identifier_mapping(identifier);

		//If the object doesn't exist already or caching if off
    if(!this.objects[identifier] || options.cache === false) {
			let entity = this.load(identifier, options);
			return entity;
		}
		
		let entity = this.objects[identifier];
		return entity;
	}

}




