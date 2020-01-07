/**
 * Ping Attachment
 */
const Attachment = girequire('/src/Attachment/attachment');

module.exports = class PingAttachment extends Attachment {

/**
 * Build
 * 
 * @param {*} data Data for attachment
 * @returns {string} Attachment data
 */
  _build(data = {}) {
    return 'pong';
  }

}