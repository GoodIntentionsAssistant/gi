/**
 * Voice Attachment
 */
const Attachment = require('./attachment.js');

module.exports = class VoiceAttachment extends Attachment {

  build(text, Template) {
    return {
      text: Template.compile(text)
    };
  }

}