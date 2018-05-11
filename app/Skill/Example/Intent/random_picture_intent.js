/**
 * Random picture Intent
 */
const Intent = require('../../../../src/Intent/intent');

module.exports = class RandomPictureIntent extends Intent {

	setup() {
    this.train([
      'random picture'
    ]);
	}

	response(request) {
    request.attachment('image','https://picsum.photos/300/300/?random');

    request.attachment('voice','I can\'t show you a picture');

    return true;
  }

}

