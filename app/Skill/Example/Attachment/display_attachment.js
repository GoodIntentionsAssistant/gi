/**
 * Display Attachment
 */
const Attachment = require('../../../../src/Attachment/attachment.js');

module.exports = class DisplayAttachment extends Attachment {

  constructor(app) {
    super(app);
    this.multiple = false;
  }

  build(data) {
    return data ? 'true': 'false';
  }

}