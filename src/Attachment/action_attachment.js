/**
 * Image Attachment
 */
const Attachment = girequire('/src/Attachment/attachment');

module.exports = class ActionAttachment extends Attachment {
  
/**
 * Build
 * 
 * @param {*} data Data for attachment
 * @returns {Object} Attachment data
 */
  _build(data) {
    return {
      text: data
    };
  }

}