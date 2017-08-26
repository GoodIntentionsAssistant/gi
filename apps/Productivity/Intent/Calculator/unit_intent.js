// Unit
// https://www.npmjs.com/package/convert-units
	
var Intent = require('../../../../src/Intent/intent');
var _ = require('underscore');
var natural = require('natural');
var convert = require('convert-units');


function UnitIntent() {
	var methods = {
		name: 'Unit Converter',
		trigger: 'convert',
		entities: {
			'Common/Unit': {}
		},
		parameters: {
			"amount": {
				name: "Amount",
				entity: "Common/Number",
				required: false,
				default: 1
			},
			"unit_from": {
				name: "Unit From",
				entity: "Common/Unit",
				required: true
			},
			"unit_to": {
				name: "Unit To",
				entity: "Common/Unit",
				required: true
			}
		},
		tests: [
			{ input:'1 lb to kg' },
			{ input:'lb to kg' }
		]
	}
	methods.__proto__ = Intent()


	methods.response = function(request) {
		var amount = request.param('amount');
		var unit_from = request.param('unit_from');
		var unit_to = request.param('unit_to');
	
		var unit_from_label = request.param_label('unit_from');
		var unit_to_label = request.param_label('unit_to');

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

		return amount+' '+unit_from_label+' is '+result +' '+unit_to_label;
	}

	return methods
}


module.exports = UnitIntent;
