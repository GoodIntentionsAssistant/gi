/**
 * Utterance
 */
const Scrubber = girequire('src/Utterance/scrubber');
const Labeler = girequire('src/Utterance/labeler');

const _ = require('underscore');

module.exports = class Utterance {

/**
 * Constructor
 *
 * @constructor
 * @param {string} text Text input, optional
 */
  constructor(text = '') {
    if(text) {
      this.set(text);
    }
  }


/**
 * Utterance set
 *
 * @param {string} text Text input to convert to utterance
 * @returns {boolean} Success of setting and processing
 */
  set(text) {
    this.data = {
      original: text,
      text: null,
      scrubbed: {}
    };

    //Original text
    this.data.original = text.trim();

    //Break it up
    this._scrub();
    this._text();
    this._labels();

    return true;
  }


/**
 * Utterance get
 *
 * Used to get all the data from the utterance so it can be loaded back in
 * This is used for session history.
 *
 * @returns {object} Utterance data
 */
  get() {
    return this.data;
  }


/**
 * Text
 *
 * @returns {boolean} Success of storing text
 */
  _text() {
    let text = this.data.scrubbed.normal;
    this.data.text = text;
    return true;
  }


/**
 * Scrub
 *
 * Different versions of the inputted string for the classifiers to use.
 * Centralised in this Utterance so the strings don't need to be scrubbed multiple times
 *
 * @returns {boolean} Success of scrubbing text
 */
  _scrub() {
    let text = this.data.original;

    //Normal scrubbing
    //Make the text lower, contractions and grammar standardising
    let normal = text;
    normal = Scrubber.lower(normal);
    normal = Scrubber.substitutes(normal);
    normal = Scrubber.spelling(normal);
    normal = Scrubber.grammar(normal);
    normal = Scrubber.octal(normal);

    //Remove stop words
    //Use normal and additionally remove all stop words, like and, it, is, a...
    let stopwords = normal;
    stopwords = Scrubber.stop_words(stopwords);

    this.data.scrubbed = {
      normal,
      stopwords
    };

    return true;
  }


/**
 * Labels
 *
 * @returns {boolean} Success of labelling text
 */
  _labels() {
    this.Labeler = new Labeler();
    return this.Labeler.label(this.data.original);
  }


/**
 * Is
 * 
 * Checks if the text has a certain label or not.
 * e.g. is('positive')
 *
 * @param {string} label Label to check if it exists in utterance
 * @returns {boolean} If the label exists
 */
  is(label) {
    return this.Labeler.is(label);
  }


/**
 * Labels
 *
 * @returns {string[]} Array of labels from text
 */
  labels() {
    return this.Labeler.labels;
  }


/**
 * Original
 *
 * @returns {string} Original text
 */
  original() {
    return this.data.original;
  }


/**
 * Text
 *
 * @returns {string} Text but scrubbed
 */
  text() {
    return this.data.text;
  }


/**
 * Scrubbed text
 *
 * @param {string} type Type of scrubbed text
 * @returns {string}
 */
  scrubbed(type = 'normal') {
    return this.data.scrubbed[type];
  }


}