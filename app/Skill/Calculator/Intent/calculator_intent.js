/**
 * Calculator
 */
//http://stackoverflow.com/questions/28198370/regex-for-validating-correct-input-for-calculator
	
const Intent = require('../../../../src/Intent/intent');
const wordsToNumbers = require('words-to-numbers');

module.exports = class CalculatorIntent extends Intent {

	setup() {
		this.train([
			new RegExp(/^.*[\d+] x [\d+].*$/,'g'),
			new RegExp(/^(calc )?[\d\+\/\*.\-% \(\)=]*$/,'g'),
			new RegExp(/^[\d+]*%( of)? [\d\+\/\*.\- \(\)=]*$/,'g')
		], {
			collection: 'strict'
		});

		this.train([
			'@App.Calculator.Entity.MathWord'
		]);

		this.reject([
			new RegExp(/^[0-9]*$/,'g'),			//Just number entered, e.g. '5' with no math
		]);

		this.parameter('math_word',{
			name: "Math word",
			entity: 'App.Calculator.Entity.MathWord'
		});
	}


	response(request) {
		//Clean up the string
		var input = this.clean_string(request, request.input.text);

		if(!input) {
			return 'Oops, there seemed to be a problem calculating that';
		}

		//Type of calculation
		var method = 'simple';
		if(input.indexOf('%') > -1) {
			method = 'percentage';
		}

		//Result
		var result = null;
		try {
			method = 'calc_'+method;
			var result = this[method](input);
		}
		catch(err) {
		}

		if(!result) {
			result = 'Sorry, I had a problem calculating '+input;
		}

		return result;
	}


	clean_string(request, input) {
		//Words to numbers
		//one -> 1
		input = wordsToNumbers.wordsToNumbers(input);

		//Replace math strings, e.g. times to *
		let math_string = request.parameters.get('math_word.string');
		if(math_string) {
			let math_value = request.parameters.get('math_word.matched.value');
			let rep = new RegExp(math_string,'ig');
			input = input.replace(rep, math_value);
		}

		//Remove chars that are not needed for math
		input = input.replace(/[a-z\!\?=]/ig,'');
		input = input.trim(input);

		return input;
	}


	calc_simple(input) {
		return eval(input);
	}

	calc_percentage(input) {
		//Find the percentage number we need
		var match = input.match(/[\d+]*%/);

		if(!match) {
			return false;
		}

		//Input
		input = input.trim();

		//Get percentage value
		var percentage = match[0];
		percentage = percentage.replace('%','');

		//Remaining
		var remaining = input;
		remaining = remaining.replace(match[0],'');
		remaining = remaining.trim();

		//Against
		var split = remaining.match(/^(\d+)/);
		var against = split[0];

		//What ever is left
		remaining = remaining.replace(/^(\d+)/,'');
		remaining = remaining.trim();

		//If no numerical remaining then clear
		if(!remaining.match(/\d+/)) {
			remaining = '';
		}

		//90% + 5?
		if(input.indexOf('+') != -1) {
			remaining += ' + '+against;
		}

		//5% of 400 = 20
		//5 / 100 * 400

		var cmd = '('+percentage+' / 100 * '+against+') '+remaining;

		return this.calc_simple(cmd)+'%';
	}
}
