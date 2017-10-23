/**
 * Random picture Intent
 */
const Intent = require('../../../../src/Intent/intent');

module.exports = class RandomPictureIntent extends Intent {

	setup() {
    this.train(['random picture'], { classifier:'strict' });
	}

	response(request) {
    request.attachment.add_image('https://picsum.photos/300/300/?random');
    return true;
  }

}

