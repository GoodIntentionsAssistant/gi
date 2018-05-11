/**
 * Utterance
 */
const Scrubber = require('../Utility/scrubber');

const pos = require('pos');
const Sentiment = require('sentiment');


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
      original: text,
      text: null,
      scrubbed: {},
      tags: [],
      sentiment: {}
    };

    this._scrub();
    this._text();
    this._sentiment();
    this._pos();
    this._tags();
  }


/**
 * Text
 *
 * @access public
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
 * @access public
 * @return bool
 */
  _scrub() {
    let text = this.data.original.trim();

    //Normal scrubbing
    //Make the text lower, contractions and grammar standardising
    let normal = text;
    normal = Scrubber.lower(normal);
    normal = Scrubber.contractions(normal);
    normal = Scrubber.grammar(normal);
    normal = Scrubber.octal(normal);

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
 * POS
 *
 * @access public
 * @return bool
 */
  _pos() {
    //Tokenize string
    let words   = new pos.Lexer().lex(this.scrubbed());

    //Setup tagger and build up tags
    let tagger  = new pos.Tagger();
    let tags    = tagger.tag(words);

    this.data.pos = tags;
  }


/**
 * Tags
 *
 * @access public
 * @return bool
 */
  _tags() {
    
  }


/**
 * Sentiment
 *
 * @access public
 * @return bool
 */
  _sentiment() {
    let sentiment = new Sentiment();
    let result = sentiment.analyze(this.scrubbed());

    this.data.sentiment = {
      score: result.score,
      positive: result.positive,
      negative: result.negative
    };
  }


/**
 * Sentiment
 *
 * @access public
 * @return hash
 */
  sentiment() {
    return this.data.sentiment;
  }


/**
 * Is positive
 *
 * @access public
 * @return bool
 */
  is_positive() {
    return this.data.sentiment.score > 0 ? true : false;
  }


/**
 * Is negative
 *
 * @access public
 * @return bool
 */
  is_negative() {
    return this.data.sentiment.score < 0 ? true : false;
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