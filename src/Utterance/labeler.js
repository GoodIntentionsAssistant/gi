/**
 * Labeler
 */
const _ = require('underscore');
const Sentiment = require('sentiment');
const Compendium = require('compendium-js');
const Pos = require('pos');

module.exports = class Labeler {

/**
 * Constructor
 * 
 * @constructor
 */
  constructor() {
    this._text = null;
    this._labels = [];
    this._pos = [];
  }


/**
 * Label
 *
 * @param {string} text Text to start labeling
 * @returns {boolean} If able to label the text
 */
  label(text) {
    if(!text) {
      return false;
    }

    this._text = text;

    this._keywords();
    this._sentiment();
    this._parts_of_speech();

    return true;
  }


/**
 * Labels
 * 
 * @returns {string[]} Array of labels
 */
  labels() {
    return this._labels;
  }


/**
 * Keywords
 *
 * @returns {boolean} If able to analyse text
 */
  _keywords() {
    //Keywords
    let keywords = {
      //'is': { labels: ['question'] }, "The cat is in the hat"
      'how': { labels: ['question', 'how'] },
      'who': { labels: ['question', 'who'] },
      'what': { labels: ['question', 'what'] },
      'which': { labels: ['question', 'which'] },
      'where': { labels: ['question', 'where'] },
      'why': { labels: ['question', 'why'] },
      'are': { labels: ['question', 'are'] },
      '?': { labels: ['question'] }
    };

    //Get original text and tokenize
    let text = this._text;
    let words = new Pos.Lexer().lex(text);

    //
    for(let ii=0; ii<words.length; ii++) {
      //Word
      let _word = words[ii].toLowerCase();

      //Not found in keywords
      if(!keywords[_word]) {
        continue;
      }

      //Add each label
      for(let tt=0; tt<keywords[_word].labels.length; tt++) {
        this.add(keywords[_word].labels[tt]);
      }
    }

    return true;
  }


/**
 * Sentiment
 *
 * A feeling of emotion, view of an attitude towards a situation, even or opinion.
 *
 * @returns {boolean} If able to analyse text
 */
  _sentiment() {
    let sentiment = new Sentiment();
    let result = sentiment.analyze(this._text);

    if(result.score > 0) {
      this.add('positive');
    }
    else if(result.score < 0) {
      this.add('negative');
    }
    else {
      this.add('neutral');
    }

    return true;
  }


/**
 * Parts of speech
 *
 * https://github.com/Ulflander/compendium-js
 *
 * @returns {boolean} If able to analyse text
 */
  _parts_of_speech() {
    let output = Compendium.analyse(this._text);

    //
    const tag_to_type = {
      'CD': 'number',
      'IN': 'preposition',
      'JJ': 'adjective',
      'JJR': 'adjective',
      'JJS': 'adjective',
      'NN': 'noun',
      'PP': 'pronoun',
      'PRP$': 'pronoun',
      'WP': 'pronoun',
      'RB': 'adverb',
      'RBR': 'adverb',
      'RBS': 'adverb',
      'RP': 'particle',
      'VB': 'verb',
      'VBD': 'verb',
      'VBG': 'verb',
      'VBN': 'verb',
      'VBP': 'verb',
      'VBZ': 'verb'
    };

    //Get each tag and match it with tag_to_type object
    for(let ii=0; ii<output[0].tags.length; ii++) {
      //Get the tag, e.g. JJ
      let label = output[0].tags[ii];

      //See if we can match it up with a type
      let type = tag_to_type[label];
      if(!type) { continue; }

      this.add(type);
      this._pos.push(type);
    }

    return true;
  }


/**
 * Add label
 *
 * @param {string} keyword Word to add to labels
 * @returns {boolean} Success of adding the label
 */
  add(keyword) {
    //Push to lower
    keyword = keyword.toLowerCase();

    //Already exists
    if(_.indexOf(this._labels, keyword) !== -1) {
      return false;
    }

    this._labels.push(keyword);

    return true;
  }


/**
 * Is
 *
 * @param {string} label Label to check
 * @returns {boolean} If the label exists
 */
  is(label) {
    if(_.indexOf(this._labels, label) !== -1) {
      return true;
    }

    return false;
  }


}