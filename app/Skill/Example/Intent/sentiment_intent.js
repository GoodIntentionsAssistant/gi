/**
 * Sentiment Intent
 */
const Intent = require('../../../../src/Intent/intent');

module.exports = class SentimentIntent extends Intent {

  setup() {
    this.train([
      new RegExp(/^sentiment/,'i')
    ]);
  }

  response(request) {
    let output = [];

    if(request.utterance.is_positive()) {
      output.push('Sentiment is positive!');
    }
    else if(request.utterance.is_negative()) {
      output.push('Sentiment is negative :(');
    }
    else {
      output.push('Sentiment is neutral');
    }

    return output;
  }

}

