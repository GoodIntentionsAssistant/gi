/**
 * Unit Intent
 */
const Intent = require('../../../../src/Intent/intent');
const natural = require('natural');
const convert = require('convert-units');
const _ = require('underscore');
_.mixin(require('underscore.inflections'));

module.exports = class UnitIntent extends Intent {

	setup() {
		this.train([
			'convert',
			'@App.Common.Entity.Unit'
		]);

		this.parameter('amount', {
      name: "Amount",
      entity: 'App.Common.Entity.Number',
      required: false,
      default: 1
    });

		this.parameter('unit_from', {
      name: "Unit From",
      entity: 'App.Common.Entity.Unit',
      required: true
    });

		this.parameter('unit_to', {
      name: "Unit To",
      entity: 'App.Common.Entity.Unit',
      required: true
    });

		this.tests = [
			{ input:'1 lb to kg' },
			{ input:'lb to kg' },
			{ input:'how many centimeters are in an inch' }
		];
	}


	response(request) {
		var amount = request.parameters.value('amount');
		var unit_from = request.parameters.value('unit_from');
		var unit_to = request.parameters.value('unit_to');
	
		var unit_from_label = request.parameters.get('unit_from.label');
		var unit_to_label = request.parameters.get('unit_to.label');

		//Check the units from and to are valid
		var possibilities = convert().from(unit_from).possibilities();

		//Make sure we can convert it
		if(_.indexOf(possibilities, unit_to) == -1) {
			
			return [
				'I cannot convert '+unit_from_label+' to '+unit_to_label,
				'Try converting '+amount+' '+unit_from_label+' to '+possibilities.join(', ')
			];
		}

		//Result and clean
		var result = convert(amount).from(unit_from).to(unit_to);
		result = parseFloat(result,2).toFixed(2);

		//Singular
		if(parseFloat(amount) == 1) {
			unit_from_label = _.singularize(unit_from_label);
		}
		if(parseFloat(result) == 1) {
			unit_to_label = _.singularize(unit_to_label);
		}

		return amount+' '+unit_from_label+' is '+result +' '+unit_to_label;
	}

}

