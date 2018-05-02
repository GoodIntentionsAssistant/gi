/**
 * BMI Weight Entity
 */
const Entity = require('../../../../src/Entity/entity');

module.exports = class BmiHeightEntity extends Entity {

  setup() {
    this.data = {
      'kg': {
        'synonyms': ['kilograms','kilogram','kg']
      },
      'lb': {
        'synonyms': ['pounds', 'pound']
      }
    };
  }


  find_word(word, input, options = {}) {
    //Matching 50lb, 50 lb, abc 50lb abc
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

