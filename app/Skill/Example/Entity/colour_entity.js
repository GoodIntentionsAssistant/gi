/**
 * Colour Entity
 */	
const Entity = require('../../../../src/Entity/entity');

module.exports = class ColourEntity extends Entity {

  setup() {
    this.name = "Colour";
    this.data = {
      'red': {},
      'blue': {},
      'green': {},
      'white': {},
      'black': {}
    };
  }

}