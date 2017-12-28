/**
 * Repeat Intent
 */
const Intent = require('../../../../src/Intent/intent');

module.exports = class RepeatIntent extends Intent {

	setup() {
    this.train([
      new RegExp(/^repeat/,'i'),
      new RegExp(/^say/,'i')
    ], {
      classifier: 'strict'
    });
	}

	response(request) {
    let result = request.input.text;

    result = result.replace(/^repeat/i,'').trim();
    result = result.replace(/^say/i,'').trim();
    result = result.replace(/^after me/i,'').trim();

    return result;
	}

}

