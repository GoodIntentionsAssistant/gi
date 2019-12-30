/**
 * Reply Attachment
 */
const Attachment = require('./attachment.js');

module.exports = class ReplyAttachment extends Attachment {

/**
 * Build
 * 
 * @param {*} data Data for attachment
 * @returns {Object}
 */
  build(data = {}) {
    return true;
  }

}