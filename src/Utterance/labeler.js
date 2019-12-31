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
    this.text = null;
    this.labels = [];
    this.pos = [];
  }


/**
 * Label
 *
 * @param {string} text Text to start labeling
 * @returns {boolean} If able to label the text
 */
  label(text) {
    this.text = text;

    this._keywords();
    this._sentiment();
    this._pos();

    return true;
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
    let text = this.text;
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

    //Check if the first or second words in the string "is"
    //If the input is "is the light on" without a question mark it'll detect it
    //If the input is "the cat is in the hat" it'll ignore it - but this is not solid!
    //@todo Find an improvement, maying using POS
    for(let ii=0; ii<2; ii++) {
      if(words[ii] && words[ii] === 'is') {
        this.add('question');
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
    let result = sentiment.analyze(this.text);

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
 * POS
 *
 * https://github.com/Ulflander/compendium-js
 *
 * @returns {boolean} If able to analyse text
 */
  _pos() {
    let output = Compendium.analyse(this.text);
    
    if(!output) {
      return false;
    }

    //
    const tag_to_type = {
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
      if(!label) { continue; }

      //See if we can match it up with a type
      let type = tag_to_type[label];
      if(!type) { continue; }

      this.add(type);
      this.pos.push(type);
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
    if(_.indexOf(this.labels, keyword) !== -1) {
      return false;
    }

    this.labels.push(keyword);

    return true;
  }


/**
 * Is
 *
 * @param {string} label Label to check
 * @returns {boolean} If the label exists
 */
  is(label) {
    if(_.indexOf(this.labels, label) !== -1) {
      return true;
    }

    return false;
  }


}