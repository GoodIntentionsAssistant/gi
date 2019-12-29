/**
 * History
 */
module.exports = class History {

/**
 * Constructor
 *
 * @param {Object} request Current request
 */
  constructor(request) {
    this.request = request;
  }


/**
 * Add utterance to users history
 *
 * @param {Object} utterance Add to users history
 * @returns {boolean}
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

    if(history.length === 0) {
      return false;
    }

    history.pop();
    return history[history.length-1];
  }


}