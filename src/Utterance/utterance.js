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
    this.data = {
      text: text,
      tags: [],
      sentiments: {}
    };
  }


/**
 * Text
 *
 * @access public
 * @return hash
 */
  text() {
    return this.data.text;
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
    return this.data;
  }


}