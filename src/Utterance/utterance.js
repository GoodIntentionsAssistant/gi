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


/**
 * Utterance get
 *
 * Used to get all the data from the utterance so it can be loaded back in
 * This is used for session history.
 *
 * @access public
 * @return hash
 */
  get() {
    return {
      text: this.text,
      tags: this.tags,
      sentiments: this.sentiments
    }
  }


}