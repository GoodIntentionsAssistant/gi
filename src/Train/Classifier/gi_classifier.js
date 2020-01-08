/**
 * GI Classifier
 */
const Classifier = require('./classifier.js');
const Labeler = require('../../Utterance/labeler');

module.exports = class GiClassifier extends Classifier {

/**
 * Constructor
 *
 * @constructor
 */
  constructor() {
    super();

    this.groupWords = [];
    this.groupPos = [];
  }


/**
 * Populate POS
 * 
 * @returns {boolean} If set POS keys
 */
  _populatePos() {
    let keys = [
      ',',     //Comma                     ,
      ':',     // Mid-sent punct.           : ;
      '.',     // Sent-final punct          . ! ?
      '"',     // quote                     "
      '(',     // Left paren                (
      ')',     // Right paren               )
      '#',     // Pound sign                #
      'CC',     // Coord Conjuncn           and,but,or
      'CD',     // Cardinal number          one,two,1,2
      'DT',     // Determiner               the,some
      'EX',     // Existential there        there
      'FW',     // Foreign Word             mon dieu
      'IN',     // Preposition              of,in,by
      'JJ',     // Adjective                big
      'JJR',     // Adj., comparative       bigger
      'JJS',     // Adj., superlative       biggest
      'LS',     // List item marker         1,One
      'MD',     // Modal                    can,should
      'NN',     // Noun, sing. or mass      dog
      'NNP',     // Proper noun, sing.      Edinburgh
      'NNPS',     // Proper noun, plural    Smiths
      'NNS',     // Noun, plural            dogs
      'PDT',     // Predeterminer           all, both
      'POS',     // Possessive ending       's
      'PP',     // Personal pronoun         I,you,she
      'PRP$',     // Possessive pronoun     my,one's
      'RB',     // Adverb                   quickly, not
      'RBR',     // Adverb, comparative     faster
      'RBS',     // Adverb, superlative     fastest
      'RP',     // Particle                 up,off
      'SYM',     // Symbol                  +,%,&
      'TO',     // 'to'                     to
      'UH',     // Interjection             oh, oops
      'VB',     // verb, base form          eat
      'VBD',     // verb, past tense        ate
      'VBG',     // verb, gerund            eating
      'VBN',     // verb, past part         eaten
      'VBP',     // Verb, present           eat
      'VBZ',     // Verb, present           eats
      'WDT',     // Wh-determiner           which,that
      'WP',     // Wh pronoun               who,what
      'WP$',     // Possessive-Wh           whose
      'WRB'      // Wh-adverb               how,where
    ];

    return true;
  }


/**
 * Train
 *
 * @param {string} intent Intent identifier
 * @param {string} keyword Keyword for the intent
 * @returns {boolean} Success of adding
 */
  train(intent, keyword) {  
    let labeler = new Labeler();
    labeler.label(keyword);

    this.data.push({
      pos: labeler.pos,
      intent,
      keyword
    });

    return true;
  }


/**
 * Untrain
 *
 * @param {string} intent Intent identifier to remove
 * @returns {boolean} Success of removing intent
 */
  untrain(intent) {
    return false;
  }


/**
 * Find
 *
 * @param {Object} utterance Utterance object
 * @returns {*} Classifier result or false if nothing found
 */
  find(utterance) {
    return false;
  }

}