/**
 * Understand
 */

module.exports = class Understand {

/**
 * Constructor
 *
 * @constructor
 * @param {Object} App App instance
 */
  constructor(App) {
    this.App = App;
    this.collections();
  }


/**
 * Load collections
 *
 * @todo Rename to something else? This doesn't look right here.
 * @returns {boolean} Collections set
 */
  collections() {
    this._collections = [
      'strict',
      'default',
      'fallback'
    ];
    return true;
  }


/**
 * Process the utterance on all collections
 *
 * Check each training collection in order then call trainer to
 * find the intent.
 *
 * @param {Object} utterance Utterance instance from user input
 * @param {string[]} collections Collection string array
 * @returns {*} False or hash of the result
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
 * @param {Object} utterance Utterance instance from user input
 * @param {string[]} collections Collection string array
 * @returns {*} False or hash of the result
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
 * @param {Object} utterance Utterance instance from user input
 * @param {string[]} collection Collection string array
 * @returns {*} False or hash of the result
 */
  _match(utterance, collection) {
    //Matches returns more than one result from Train / classifier
    let matches = this.App.Train.find(utterance, collection);

    //
    this.App.Event.emit('app.understand.match',{
      utterance,
      collection,
      matches
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
          confidence: match.confidence,
          intent,
          collection
        }
      }
    }

    return false;
  }


/**
 * Check matched instance with explicits
 *
 * @param {Object} match Matched result from classifiers
 * @param {Object} utterance Utterance instance
 * @returns {boolean} If false then the match will be rejected
 */
  _check(match, utterance) {
    let result = this.App.Explicit.check(match, utterance);
    return result;
  }


}