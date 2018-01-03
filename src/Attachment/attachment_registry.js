/**
 * Attachment Registry
 */

const ObjectRegistry = require('../Core/object_registry.js');

module.exports = class AttachmentRegistry extends ObjectRegistry {

/**
 * Constructor
 *
 * @param object app
 * @access public
 * @return void
 */
  constructor(app) {
    super(app);
    this.type = 'Attachment';
  }

}