/**
 * Utterance
 */
module.exports = class Utterance {

/**
 * Constructor
 *
 * @param text string
 * @access public
 * @return void
 */
  constructor(text) {
    this.text = text;
    this.tags = [];
    this.sentiments = {};
  }


}