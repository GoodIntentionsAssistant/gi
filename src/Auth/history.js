/**
 * History
 */
module.exports = class History {

/**
 * Constructor
 *
 * @constructor
 * @param {Object} request Current request
 */
  constructor(request) {
    this.request = request;
  }


/**
 * Add utterance to users history
 *
 * @param {Object} utterance Add to users history
 * @returns {boolean} Success of adding history
 */
  add(utterance) {
    let history = this.get();
    history.push(utterance.get());

    return this.request.session.set('history', history);
  }


/**
 * Get history
 *
 * @returns {Object} Get full history for user
 */
  get() {
    let history = this.request.session.get('history');
    if(!history) {
      history = [];
    }
    return history;
  }


/**
 * Get last history
 *
 * @returns {Object} Previous historic request
 */
  last() {
    let history = this.get();

    //If has one history then that'll be the current utterance incoming, this can be ignored
    if(history.length <= 1) {
      return false;
    }

    //Pop the array because we don't want the current request utterance history
    history.pop();

    return history[history.length-1];
  }


}