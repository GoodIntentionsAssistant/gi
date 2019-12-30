/**
 * Classifier
 */
module.exports = class Classifier {

/**
 * Constructor
 *
 * @return void
 */
  constructor() {
    this.data = [];
  }


/**
 * Train
 *
 * @param string intent
 * @param string keyword
 * @return void
 */
  train(intent, keyword) {
    this.data.push([keyword, intent]);
  }


/**
 * Untrain
 *
 * @param stirng intent
 * @return bool
 */
  untrain(intent) {
    for(var ii=0; ii<this.data.length; ii++) {
      var _keyword = this.data[ii][0];
      var _intent = this.data[ii][1];

      if(intent === _intent) {
        delete this.data[ii];
      }
    }

    return true;
  }

}
