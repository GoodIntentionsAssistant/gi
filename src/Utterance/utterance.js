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
 * @param text string
 */
  constructor(text) {
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
  }


/**
 * Text
 *
 * @return void
 */
  _text() {
    let text = this.data.scrubbed.normal;

    this.data.text = text;
  }


/**
 * Scrub
 *
 * Different versions of the inputted string for the classifiers to use.
 * Centralised in this Utterance so the strings don't need to be scrubbed multiple times
 *
 * @return bool
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
 * @return bool
 */
  _labels() {
    this.Labeler = new Labeler();
    return this.Labeler.label(this.data.original);
  }


/**
 * Is
 *
 * @param string label
 * @return bool
 */
  is(label) {
    return this.Labeler.is(label);
  }


/**
 * Labels
 *
 * @return string
 */
  labels() {
    return this.Labeler.labels;
  }


/**
 * Original
 *
 * @return string
 */
  original() {
    return this.data.original;
  }


/**
 * Text
 *
 * @return string
 */
  text() {
    return this.data.text;
  }


/**
 * Scrubbed text
 *
 * @param type string
 * @return string
 */
  scrubbed(type = 'normal') {
    return this.data.scrubbed[type];
  }


/**
 * Utterance get
 *
 * Used to get all the data from the utterance so it can be loaded back in
 * This is used for session history.
 *
 * @return hash
 */
  get() {
    return this.data;
  }


}