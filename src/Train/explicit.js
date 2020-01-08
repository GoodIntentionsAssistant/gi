/**
 * Explicit
 */
const Config = require('../Config/config.js');

module.exports = class Explicit {

/**
 * Constructor
 *
 * @constructor
 * @param {Object} app App instance
 */
  constructor(app) {
    this.app = app;
  }


/**
 * Train
 *
 * @param {string} type Type, 'must' or 'reject'
 * @param {string} intent Intent name
 * @param {string} keyword Keyword
 * @param {Object} options Options for training
 * @returns {boolean} Successfully trained
 */
  train(type, intent, keyword, options = {}) {
    //Default classifier is strict
    let classifier = 'strict';

    //Force to lowercase
    if(typeof keyword === 'string') {
      keyword = keyword.toLowerCase();
    }

    //If keyword starts with tilde, ~ then it's a utterance label match
    //Make sure the keyword is a string, it could be passed as a regular expression
    let label_search = false;
    if(typeof keyword === 'string' && keyword.substring(0,1) === '#') {
      label_search = true;
      classifier = 'label';
    }

    //Build the collection name
    let collection;
    if(type === 'reject') {
      collection = '_reject_'+intent;
    }
    else {
      collection = '_must_'+intent;
    }

    //Keyword force to a regular expression if it's not already
    if(classifier === 'strict' && typeof keyword === 'string') {
      keyword = new RegExp(keyword,'g');
    }

    //Train with the defined collection and keyword
    this.app.Train.train(intent, keyword, {
      collection,
      classifier
    });

    return true;
  }


/**
 * Check
 *
 * @todo Document this method
 * @param {Object} match Match object
 * @param {Object} utterance Utterance data
 * @returns {boolean} If match can be accepted
 */
  check(match, utterance) {
    //match.result is the intent identifier
    let valid;

    //Reject
    //If a keyword in the users utterance is found and should be
    //rejected then return false so the intent is not used.
    valid = this._findReject(match.result, utterance);
    if(!valid) {
      return false;
    }

    //Must
    //The words must be in the utterance
    valid = this._findMust(match.result, utterance);
    if(!valid) {
      return false;
    }

    return true;
  }


/**
 * Check for REJECT words
 *
 * @param {string} intent Intent name
 * @param {Object} utterance Utterance object
 * @returns {boolean} If the intent should be rejected
 */
  _findReject(intent, utterance) {
    //Collection does not exist
    if(!this.app.Train.has_collection('_reject_'+intent)) {
      return true;
    }

    //Use the trainer with a private collection to find the rejected words
    let results = this.app.Train.find(utterance, '_reject_'+intent);

    if(results.length > 0) {
      return false;
    }

    return true;
  }


/**
 * Check for MUST words
 *
 * The words must exist in the utterance
 *
 * @param {string} intent Intent name
 * @param {Object} utterance Utterance object
 * @returns {boolean} If the intent should be used
 */
  _findMust(intent, utterance) {
    //Collection does not exist
    if(!this.app.Train.has_collection('_must_'+intent)) {
      return true;
    }

    //Use the trainer with a private collection to find the must words
    let results = this.app.Train.find(utterance, '_must_'+intent);

    if(results.length > 0) {
      return true;
    }

    return false;
  }


}