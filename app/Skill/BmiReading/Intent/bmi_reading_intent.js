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

    this.parameter('height_unit', {
      name: 'Height',
      entity: 'App.BmiReading.Entity.BmiHeight',
      required: false
    });

    this.parameter('weight_unit', {
      name: 'Weight',
      entity: 'App.BmiReading.Entity.BmiWeight',
      required: false
    });

    this.parameter('value1',{
      entity: "App.Common.Entity.Decimal",
      required: false
    });

    this.parameter('value2',{
      entity: "App.Common.Entity.Decimal",
      required: false
    });
  }

  response(request) {
    let height_unit = request.parameters.value('height_unit');
    let weight_unit = request.parameters.value('weight_unit');

    let value1 = request.parameters.value('value1');
    let value2 = request.parameters.value('value2');

    let output = [];

    output.push('Height, '+height_unit);
    output.push('Weight, '+weight_unit);

    output.push('Value 1, '+value1);
    output.push('Value 2, '+value2);

    let aaa = request.parameters.get('value2');
    console.log(aaa);

    return output;
  }


  _calculate(request) {
    let height_unit = request.user.get('bmi.height_unit');
    let weight_unit = request.user.get('bmi.weight_unit');

    let height_value = request.user.get('bmi.height_value');
    let weight_value = request.user.get('bmi.weight_value');

  }


}

