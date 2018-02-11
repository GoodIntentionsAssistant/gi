/**
 * Utterance
 */
const Scrubber = require('../Utility/scrubber');

const pos = require('pos');

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
      scrubbed: {},
      tags: [],
      sentiments: {}
    };

    this.scrub();
    this.tags();
  }


/**
 * Scrub
 *
 * Different versions of the inputted string for the classifiers to use.
 * Centralised in this Utterance so the strings don't need to be scrubbed multiple times
 *
 * @access public
 * @return bool
 */
  scrub() {
    let text = this.text();

    //Normal scrubbing
    //Make the text lower, contractions and grammar standardising
    let normal = text;
    normal = Scrubber.lower(normal);
    normal = Scrubber.contractions(normal);
    normal = Scrubber.grammar(normal);

    //Remove stop words
    //Use normal and additionally remove all stop words, like and, it, is, a...
    let stopwords = normal;
    stopwords = Scrubber.stop_words(stopwords);

    this.data.scrubbed = {
      'normal': normal,
      'stopwords': stopwords
    };

    return true;
  }


/**
 * Tags
 *
 * @access public
 * @return bool
 */
  tags() {
    let words = new pos.Lexer().lex(this.scrubbed());
    let tagger = new pos.Tagger();
    let taggedWords = tagger.tag(words);

    //@todo Add this in
  }


/**
 * Text
 *
 * @access public
 * @return string
 */
  text() {
    return this.data.text;
  }


/**
 * Scrubbed text
 *
 * @param type string
 * @access public
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
 * @access public
 * @return hash
 */
  get() {
    return this.data;
  }


}