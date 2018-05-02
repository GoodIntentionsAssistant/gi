/**
 * Bmi Reading Intent
 */
const Intent = require('../../../../src/Intent/intent');

module.exports = class BmiReadingIntent extends Intent {

  setup() {
    this.train([
      'bmi reading',
      'body mass index'
    ]);

    this.parameter('height', {
      name: 'Height',
      entity: 'App.Common.Entity.UnitHeight',
      required: false
    });

    this.parameter('weight', {
      name: 'Weight',
      entity: 'App.Common.Entity.UnitWeight',
      required: false
    });
  }

  response(request) {
    let height = request.parameters.value('height');
    let weight = request.parameters.value('weight');

    let output = [];

    output.push('Height, '+height);
    output.push('Weight, '+weight);

    return output;
  }

}

