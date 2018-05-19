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
 * @access public
 * @return void
 */
  constructor() {
    this.text = null;
    this.labels = [];
  }


/**
 * Label
 *
 * @param string text
 * @access public
 * @return bool
 */
  label(text) {
    this.text = text;

    this._keywords();
    this._sentiment();
    this._pos();
  }


/**
 * Keywords
 *
 * @access public
 * @return bool
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
      '?': { labels: ['question'] },
    };

    //Get original text and tokenize
    let text = this.text;
    let words = new Pos.Lexer().lex(text);

    //
    for(let ii=0; ii<words.length; ii++) {
      //Not found in keywords
      if(!keywords[words[ii]]) {
        continue;
      }

      //Add each label
      for(let tt=0; tt<keywords[words[ii]].labels.length; tt++) {
        this.add(keywords[words[ii]].labels[tt]);
      }
    }

    //Check if the first or second words in the string "is"
    //If the input is "is the light on" without a question mark it'll detect it
    //If the input is "the cat is in the hat" it'll ignore it - but this is not solid!
    //@todo Find an improvement, maying using POS
    for(let ii=0; ii<2; ii++) {
      if(words[ii] && words[ii] == 'is') {
        this.add('question');
      }
    }
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
  }


/**
 * POS
 *
 * https://github.com/Ulflander/compendium-js
 *
 * @access public
 * @return bool
 */
  _pos() {
    let output = Compendium.analyse(this.text);
    
    if(!output) {
      return false;
    }

    for(let ii=0; ii<output[0].tags.length; ii++) {
      let label = output[0].tags[ii];

      if(!label) { continue; }

      this.add(label);
    }

    return true;
  }


/**
 * Add label
 *
 * @param string keyword
 * @access public
 * @return bool
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
 * @param string label
 * @access public
 * @return bool
 */
  is(label) {
    if(_.indexOf(this.labels, label) !== -1) {
      return true;
    }

    return false;
  }


}