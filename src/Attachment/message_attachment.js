/**
 * Message Attachment
 */
const Attachment = require('./attachment.js');

module.exports = class MessageAttachment extends Attachment {

/**
 * Build
 * 
 * @param {*} data Data for attachment
 * @param {Template} Template Templating instance for compiling
 * @returns {Object} Attachment data
 */
  build(text, Template) {
    return {
      text: Template.compile(text)
    };
  }

}