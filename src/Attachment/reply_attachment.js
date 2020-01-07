/**
 * Reply Attachment
 */
const Attachment = girequire('/src/Attachment/attachment');

module.exports = class ReplyAttachment extends Attachment {

/**
 * Build
 * 
 * @param {*} data Data for attachment
 * @returns {Object} Attachment data
 */
  _build(data = {}) {
    return true;
  }

}