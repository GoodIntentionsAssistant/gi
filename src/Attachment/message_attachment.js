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
  _build(text, Template = null) {
    //If no template instance passed
    if(Template === null) {
      return {
        text: text
      };
    }

    return {
      text: Template.compile(text)
    };
  }

}