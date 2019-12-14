/**
 * Message Attachment
 */
const Attachment = require('./attachment.js');

module.exports = class MessageAttachment extends Attachment {

  build(text, Template) {
    return {
      text: Template.compile(text)
    };
  }

}