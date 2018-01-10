/**
 * History
 */
module.exports = class History {

/**
 * Constructor
 *
 * @param object response
 * @access public
 * @return void
 */
  constructor(request) {
    this.request = request;
  }


/**
 * Add utterance to users history
 *
 * @param hash utterance
 * @access public
 * @return bool
 */
  add(utterance) {
    let history = this.get();
    history.push(utterance.get());

    return this.request.session.set('history', history);
  }


/**
 * Get history
 *
 * @access public
 * @return hash
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
 * @access public
 * @return hash
 */
  last() {
    let history = this.get();

    if(history.length == 0) {
      return false;
    }

    history.pop();
    return history[history.length-1];
  }


}