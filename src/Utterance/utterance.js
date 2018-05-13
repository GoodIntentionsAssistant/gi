/**
 * Utterance
 */
const Scrubber = require('../Utility/scrubber');

const _ = require('underscore');
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

    //Original text
    this.data.original = text.trim();

    //Break it up
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
    let text = this.data.original;

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
 * https://www.npmjs.com/package/pos
 *
 * @access public
 * @return bool
 */
  _pos() {
    //Get original text and tokenize
    let text = this.data.original;
    let words = new pos.Lexer().lex(text);

    //Setup tagger and build up tags
    let tagger  = new pos.Tagger();
    let tags    = tagger.tag(words);

    this.data.pos = tags;
  }


/**
 * Tags
 *
 * @todo Break this into a new method to support languages
 * @access public
 * @return bool
 */
  _tags() {
    //Keywords
    let keywords = {
      //'is': { tags: ['question'] }, "The cat is in the hat"
      'how': { tags: ['question', 'how'] },
      'who': { tags: ['question', 'who'] },
      'what': { tags: ['question', 'what'] },
      'which': { tags: ['question', 'which'] },
      'where': { tags: ['question', 'where'] },
      'why': { tags: ['question', 'why'] },
      'are': { tags: ['question', 'are'] },
      '?': { tags: ['question'] },
    };

    //Get original text and tokenize
    let text = this.data.original;
    text = Scrubber.lower(text);

    let words = new pos.Lexer().lex(text);

    //
    for(let ii=0; ii<words.length; ii++) {
      //Not found in keywords
      if(!keywords[words[ii]]) {
        continue;
      }

      //Add each tag
      for(let tt=0; tt<keywords[words[ii]].tags.length; tt++) {
        this.add_tag(keywords[words[ii]].tags[tt]);
      }
    }

    //Check if the first or second words in the string "is"
    //If the input is "is the light on" without a question mark it'll detect it
    //If the input is "the cat is in the hat" it'll ignore it - but this is not solid!
    //@todo Find an improvement, maying using POS
    for(let ii=0; ii<2; ii++) {
      if(words[ii] && words[ii] == 'is') {
        this.add_tag('question');
      }
    }

    return true;
  }


/**
 * Add tag keyword
 *
 * @param string keyword
 * @access public
 * @return bool
 */
  add_tag(keyword) {
    //Already exists
    if(_.indexOf(this.data.tags,keyword) !== -1) {
      return false;
    }

    this.data.tags.push(keyword);
    return true;
  }


/**
 * Sentiment
 *
 * A feeling of emotion, view of an attitude towards a situation, even or opinion.
 *
 * @access public
 * @return bool
 */
  _sentiment() {
    let sentiment = new Sentiment();
    let result = sentiment.analyze(this.scrubbed());

    if(result.score > 0) {
      this.add_tag('positive');
    }
    else if(result.score < 0) {
      this.add_tag('negative');
    }
    else {
      this.add_tag('neutral');
    }

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
 * Is
 *
 * @param string tag
 * @access public
 * @return bool
 */
  is(tag) {
    if(_.indexOf(this.data.tags, tag) !== -1) {
      return true;
    }

    return false;
  }


/**
 * Tags
 *
 * @access public
 * @return string
 */
  tags() {
    return this.data.tags;
  }


/**
 * Original
 *
 * @access public
 * @return string
 */
  original() {
    return this.data.original;
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