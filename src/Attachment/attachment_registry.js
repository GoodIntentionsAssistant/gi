/**
 * Attachment Registry
 */

const ObjectRegistry = require('../Core/object_registry.js');

module.exports = class AttachmentRegistry extends ObjectRegistry {

/**
 * Constructor
 *
 * @constructor
 * @param {Object} app App instance
 */
  constructor(app) {
    super(app);
    this.type = 'Attachment';
  }

}