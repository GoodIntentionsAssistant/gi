/**
 * Voice Attachment
 */
const Attachment = require('./attachment.js');

module.exports = class VoiceAttachment extends Attachment {

  build(data) {
    return {
      text: data
    };
  }

}