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
    let re = new RegExp('([0-9]+)(\s|)' + word, 'g');
    let position = input.search(re);

    if(position === -1) {
      return false;
    }

    return {
      position: position
    };
  }

}

