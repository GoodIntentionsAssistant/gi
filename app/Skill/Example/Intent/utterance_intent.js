/**
 * Utterance Intent
 */
const Intent = require('../../../../src/Intent/intent');

module.exports = class UtteranceIntent extends Intent {

  setup() {
    this.train([
      new RegExp(/^the cat/,'i')
    ]);
  }

  response(request) {
    let output = [];

    output.push('Original: ' + request.utterance.original());
    output.push('Scrubbed: ' + request.utterance.text());
    output.push('Stop words: ' + request.utterance.scrubbed('stopwords'));

    return output;
  }

}

