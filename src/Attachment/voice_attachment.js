/**
 * Voice Attachment
 */
const Attachment = require('./attachment.js');

module.exports = class VoiceAttachment extends Attachment {

/**
 * Build
 * 
 * @param {*} data Data for attachment
 * @param {Template} Template Templating instance for compiling
 * @returns {Object}
 */
  build(text, Template) {
    return {
      text: Template.compile(text)
    };
  }

}