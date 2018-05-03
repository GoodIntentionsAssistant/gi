/**
 * BMI Height Entity
 */
const Entity = require('../../../../src/Entity/entity');

module.exports = class BmiHeightEntity extends Entity {

  setup() {
    this.data = {
      'centimeter': {
        'synonyms': ['cm']
      },
      'meter': {
        'synonyms': ['m', 'meters']
      },
      'foot': {
        'synonyms': ['ft', 'feet']
      }
    };
  }


  find_word(word, input, options = {}) {
    //Matching 50m, 50 m, abc 50m abc
    let re = new RegExp('([0-9]+)( |)' + word, 'g');
    let result = input.match(re);

    if(result === null) {
      return false;
    }

    //Remove anything that is numbers or spaces from the match
    //50 m -> m
    //150lb -> lb
    result = result[0].replace(/[0-9]+/g,'');
    result = result.trim();

    //Get the index of the result
    let position = input.indexOf(result);

    return {
      position: position
    };
  }

}

