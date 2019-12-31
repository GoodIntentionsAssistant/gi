/**
 * Field Attachment
 */
const Attachment = require('./attachment.js');

module.exports = class FieldAttachment extends Attachment {

/**
 * Build
 * 
 * @param {*} data Data for attachment
 * @returns {Object} Attachment data
 */
  _build(data) {
    return data;
  }

}