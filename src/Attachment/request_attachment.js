/**
 * Field Attachment
 */
const Attachment = girequire('/src/Attachment/attachment');

module.exports = class FieldAttachment extends Attachment {


/**
 * Load
 * 
 * @returns {boolean} Success
 */
  load() {
    this.validate('name');
    this.validate('value');
    return true;
  }


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