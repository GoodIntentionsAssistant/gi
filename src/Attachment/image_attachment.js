/**
 * Image Attachment
 */
const Attachment = require('./attachment.js');

module.exports = class ImageAttachment extends Attachment {

  setup() {
    this.key('image');
  }

}