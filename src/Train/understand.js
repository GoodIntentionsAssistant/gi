/**
 * Understand
 */

module.exports = class Understand {

/**
 * Constructor
 *
 * @param object App
 * @access public
 * @return void
 */
  constructor(App) {
    this.App = App;
    this.collections();
  }


/**
 * Load collections
 *
 * @param string text
 * @access public
 * @return mixed False or hash of the result
 */
  collections(text) {
    this._collections = {
      'strict': {
      },
      'default': {
      },
      'fallback': {
      }
    };
  }


/**
 * Process the text on all collections
 *
 * Check each training collection in order then call trainer to
 * find the intent.
 *
 * @param object request object
 * @param string text
 * @access public
 * @return mixed False or hash of the result
 */
  process(text) {
    let result = this.match(text);
    return result
  }


/**
 * Match the text on all collections
 *
 * Check each training collection in order then call trainer to
 * find the intent.
 *
 * @param object request object
 * @param string text
 * @access public
 * @return mixed False or hash of the result
 */
  match(text) {
    let result = null;

    //Go through each training collection to try and find a match in order
    for(var collection_name in this._collections) {
      //Check if collection exists
      if(!this.App.Train.has_collection(collection_name)) {
        continue;
      }

      //Process the text on the collection
      result = this._match(text, collection_name);
      if(result) {
        break;
      }
    }

    //Nothing matched
    if(!result) {
      return false;
    }

    return result;
  }


/**
 * Match text on individual collection
 *
 * @param string text
 * @param string collection
 * @access public
 * @return mixed False or hash of the result
 */
  _match(text, collection) {
    let match = this.App.Train.find(text, collection);

    if(match) {
      let intent = this.App.IntentRegistry.get(match.result);

      return {
        intent: intent,
        confidence: match.confidence,
        collection: collection
      }
    }

    return false;
  }

}