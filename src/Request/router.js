/**
 * Router
 */
const Logger = girequire('/src/Helpers/logger');

module.exports = class Router {

/**
 * Constructor
 *
 * @constructor
 * @param {Object} request Request instance
 */
  constructor(request) {
    this.request    = request;
    this.app        = request.app;
  }


/**
 * Route
 * 
 * @param {Object} utterance Utterance instance
 * @returns {Object} Object containing routing information such as intent to call
 */
  route(utterance) {
    let result = this.app.Understand.process(utterance);

    //Could not understand the utterance
    if(result.success === false) {
      return this.error('NotFound');
    }

    //Bad data returned from Understand
    if(!result || !result.matches || result.matches.length === 0) {
      throw new Error(`Understand returned no matches`);
    }

    //Get top match
    let output = result.matches[0];
    output.success = true;

    return output;
  }


/**
 * Error
 *
 * Sets the routing information to an app error intent 
 *
 * @param {string} type Type of error, e.g. NotFound
 * @returns {*} Routing information object or false if the error failed
 */
  error(type) {
    //Emit system event
    if(type === 'NotFound') {
      this.app.Event.emit('request.unknown',{
        request: this.request
      });
    }

    //Fetch error intent object
    let identifier = 'App.Basics.Intent.'+type;
    let intent = this.app.IntentRegistry.get(identifier);

    if(!intent) {
      Logger.error(`Router could not find an intent to call and the error intent "${identifier}" could not be loaded`);
      return false;
    }

    return {
      collection: null,
      confidence: -1,
      intent
    };
  }


}