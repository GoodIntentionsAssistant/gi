/**
 * Image Attachment
 */
const Attachment = require('./attachment.js');

module.exports = class ActionAttachment extends Attachment {

  build(data) {
    return {
      text: data
    };
  }

}