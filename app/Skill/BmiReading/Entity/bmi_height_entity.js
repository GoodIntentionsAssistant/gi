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
      }
    };
  }

}

