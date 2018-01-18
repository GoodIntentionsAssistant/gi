/**
 * Utterance
 */
const Scrubber = require('../Utility/scrubber');

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
      scrubbed: null,
      tags: [],
      sentiments: {}
    };

    this.scrub();
  }


/**
 * Scrub
 *
 * @access public
 * @return void
 */
  scrub() {
    let text = this.text();

    text = Scrubber.lower(text);
    text = Scrubber.contractions(text);
    text = Scrubber.grammar(text);

    this.data.scrubbed = text;
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
 * Scrubbed text
 *
 * @access public
 * @return hash
 */
  scrubbed() {
    return this.data.scrubbed;
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