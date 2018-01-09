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
    this._collections = [
      'strict',
      'default',
      'fallback'
    ];
  }


/**
 * Process the text on all collections
 *
 * Check each training collection in order then call trainer to
 * find the intent.
 *
 * @param string text
 * @param array collections
 * @access public
 * @return mixed False or hash of the result
 */
  process(text, collections = []) {
    let result = {
      success: false,
      match: null,
      matches: []
    };

    //Match
    let matches = this.match(text, collections)

    if(matches) {
      result.success  = true;
      result.match    = matches;
      result.matches  = [matches];
    }

    return result;
  }


/**
 * Match the text on all collections
 *
 * Check each training collection in order then call trainer to
 * find the intent.
 *
 * @param string text
 * @param array collections
 * @access public
 * @return mixed False or hash of the result
 */
  match(text, collections = []) {
    let result = null;

    //Collections list
    //If collections has been passed in this method then use that
    //There might be collections that aren't used for general matching
    //like the cancel collection for cancelling expects.
    if(!collections.length) {
      collections = this._collections;
    }

    //Go through each training collection to try and find a match in order
    for(var key in collections) {
      let collection_name = collections[key];

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

    //console.log('Checking '+text+' on '+collection);

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