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
 * @access public
 * @return void
 */
  collections() {
    this._collections = [
      'strict',
      'default',
      'fallback'
    ];
  }


/**
 * Process the utterance on all collections
 *
 * Check each training collection in order then call trainer to
 * find the intent.
 *
 * @param object utterance
 * @param array collections
 * @access public
 * @return mixed False or hash of the result
 */
  process(utterance, collections = []) {
    let result = {
      success: false,
      matches: []
    };

    //Match
    let matches = this.match(utterance, collections);

    if(matches) {
      result.success  = true;
      result.matches  = [matches];
    }

    return result;
  }


/**
 * Match the utterance on all collections
 *
 * Check each training collection in order then call trainer to
 * find the intent.
 *
 * @param object utterance
 * @param array collections
 * @access public
 * @return mixed False or hash of the result
 */
  match(utterance, collections = []) {
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

      //Process the utterance on the collection
      result = this._match(utterance, collection_name);
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
 * Match utterance on individual collection
 *
 * @param object utterance
 * @param string collection
 * @access public
 * @return mixed False or hash of the result
 */
  _match(utterance, collection) {
    //Matches returns more than one result from Train / classifier
    let matches = this.App.Train.find(utterance, collection);

    //
    this.App.Event.emit('app.understand.match',{
      utterance: utterance,
      collection: collection,
      matches: matches
    });

    if(matches.length > 0) {
      //Loop through each match
      for(let mm=0; mm < matches.length; mm++) {
        let match = matches[mm];
        let check = this._check(match, utterance);

        //Check has not passed
        if(!check) {
          continue;
        }

        //Check has passed
        //This means explicit reject / must is fine
        let intent = this.App.IntentRegistry.get(match.result);

        return {
          intent: intent,
          confidence: match.confidence,
          collection: collection
        }
      }
    }

    return false;
  }


/**
 * Check matched
 *
 * @param hash match
 * @access public
 * @return bool
 */
  _check(match, utterance) {
    let result = this.App.Explicit.check(match, utterance);
    return result;
  }


}