/**
 * Navigation Attachment
 */
const Attachment = require('../../../../src/Attachment/attachment.js');

module.exports = class NavigationAttachment extends Attachment {

  constructor(app) {
    super(app);

    //Can't have more than one of these attachments
    this.multiple = false;
  }

  build(data) {
    return {
      name: data.name,
      url: data.url
    };
  }

}