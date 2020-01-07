/**
 * Classifier
 */
module.exports = class Classifier {

/**
 * Constructor
 *
 * @constructor
 */
  constructor() {
    this.data = [];
  }


/**
 * Train
 *
 * @param {string} intent Intent identifier
 * @param {string} keyword Keyword for the intent
 * @returns {boolean} Success of adding
 */
  train(intent, keyword) {
    this.data.push([keyword, intent]);
    return true;
  }


/**
 * Untrain
 *
 * @param {string} intent Intent identifier to remove
 * @returns {boolean} Success of removing intent
 */
  untrain(intent) {
    for(let ii=0; ii<this.data.length; ii++) {
      let _intent = this.data[ii][1];

      if(intent === _intent) {
        delete this.data[ii];
      }
    }

    return true;
  }

}
