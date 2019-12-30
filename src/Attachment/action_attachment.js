/**
 * Image Attachment
 */
const Attachment = require('./attachment.js');

module.exports = class ActionAttachment extends Attachment {
  
/**
 * Build
 * 
 * @param {*} data Data for attachment
 * @returns {Object} Attachment data
 */
  build(data) {
    return {
      text: data
    };
  }

}