/**
 * Reply Attachment
 */
const Attachment = require('./attachment.js');

module.exports = class ReplyAttachment extends Attachment {

  build(data) {
    return true;
  }

}