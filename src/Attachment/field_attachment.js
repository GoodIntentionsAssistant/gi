/**
 * Field Attachment
 */
const Attachment = require('./attachment.js');

module.exports = class FieldAttachment extends Attachment {

  build(data) {
    return data;
  }

}