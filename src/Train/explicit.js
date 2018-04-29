/**
 * Explicit
 */
const Config = require('../Core/config.js');

module.exports = class Explicit {

/**
 * Constructor
 *
 * @param object app
 * @access public
 * @return void
 */
  constructor(app) {
    this.explicits = {};
    this.app = app;

    this._reject = [];
    this._must = [];
  }


/**
 * Train
 *
 * @param string type 'must' or 'reject'
 * @param string intent
 * @param string keyword
 * @param hash options
 * @return boolean
 */
  train(type, intent, keyword, options) {
   if(type == 'reject') {
      this._reject.push({
        intent: intent,
        keyword: keyword,
        options: options
      });
    }
    else {
      this._must.push({
        intent: intent,
        keyword: keyword,
        options: options
      });
    }

    return true;
  }


/**
 * Check
 *
 * @param hash match
 * @param object utterance
 * @access public
 * @return bool
 */
  check(match, utterance) {
    //match.result is the intent identifier

    //Reject
    //If a keyword in the users utterance is found and should be
    //rejected then return false so the intent is not used.
    let rejected = this._findReject(match.result, utterance.text());
    if(rejected) {
      return false;
    }

    return true;
  }


/**
 * Check for rejected words
 *
 * @param string intent
 * @param string text From the user
 * @return bool
 */
  _findReject(intent, text) {
    for(let rr=0; rr<this._reject.length; rr++) {
      if(this._reject[rr].type != 'reject') {
        continue;
      }

      
    }

    return true;
  }


/**
 * Check for rejected words
 *
 * @param string intent
 * @param string text From the user
 * @return bool
 */
  _findMust(intent, text) {

  }


}