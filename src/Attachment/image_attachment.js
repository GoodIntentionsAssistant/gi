/**
 * Image Attachment
 */
const Attachment = require('./attachment.js');

module.exports = class ImageAttachment extends Attachment {
  
/**
 * Build
 * 
 * @param {*} data Data for attachment
 * @returns {Object}
 */
  build(data) {
    return {
      url: data
    };
  }

}