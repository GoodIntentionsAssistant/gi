/**
 * Voice Attachment
 */
const Attachment = girequire('/src/Attachment/attachment');

module.exports = class VoiceAttachment extends Attachment {

/**
 * Build
 * 
 * @param {*} text Data for attachment
 * @param {Template} Template Templating instance for compiling
 * @returns {Object} Attachment data
 */
  _build(text, Template = null) {
    //If no template instance passed
    if(Template === null) {
      return {
        text
      };
    }

    return {
      text: Template.compile(text)
    };
  }

}