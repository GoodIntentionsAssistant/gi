/**
 * Image Attachment
 */
const Attachment = require('./attachment.js');

module.exports = class ImageAttachment extends Attachment {

  build(data) {
    return {
      url: data
    };
  }

}