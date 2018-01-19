/**
 * Storage Registry
 */

const ObjectRegistry = require('../Core/object_registry.js');

module.exports = class StorageRegistry extends ObjectRegistry {

/**
 * Constructor
 *
 * @param object app
 * @access public
 * @return void
 */
  constructor(app) {
    super(app);
    this.type = 'Storage';
  }

}