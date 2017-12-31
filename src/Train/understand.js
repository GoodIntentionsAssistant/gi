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

    this.collections = {
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
 * @param string text
 * @access public
 * @return mixed False or hash of the result
 */
  process(text) {
    var result = null;

    //Go through each training collection to try and find a match in order
    for(var collection_name in this.collections) {
      //Check if collection exists
      if(!this.App.Train.has_collection(collection_name)) {
        continue;
      }

      //Process the text on the collection
      result = this._process(text, collection_name);
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
 * Process individual collection
 *
 * @param string text
 * @param string collection
 * @access public
 * @return mixed False or hash of the result
 */
  _process(text, collection) {
    //console.log('Checking '+collection+' for "'+text+'"');
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