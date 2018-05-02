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

    this.app.Explicit.train('reject', 'App.Unit.Intent.Unit', 'bmi');

    this.parameter('height', {
      name: 'Height',
      entity: 'App.BmiReading.Entity.BmiHeight',
      required: false
    });

    this.parameter('weight', {
      name: 'Weight',
      entity: 'App.BmiReading.Entity.BmiWeight',
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

