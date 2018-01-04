/**
 * Flower Menu Example
 */
const Intent = require('../../../../src/Intent/intent');

module.exports = class FlowerMenuIntent extends Intent {

	setup() {
		this.train([
      'flowers'
    ]);

    this.menu = {
      1: 'Order flowers',
      2: 'Check your status',
      3: 'Contact us',
      4: 'Exit'
    };

    this.stop = false;
	}

  after_request(request) {
    if(this.stop) {
      return false;
    }

    request.expecting.set({
      force: true,
      action: 'chosen',
      fail: 'incorrect',
      data: {
        "1": {},
        "2": {},
        "3": {},
        "4": {
          "synonyms": ["exit"]
        }
      }
    });
  }

	response(request) {
    let output = [];
    for(var key in this.menu) {
      output.push(key+'. '+this.menu[key]);
    }
    return output;
	}

  chosen(request) {
    let val = request.parameters.value('expects');

    if(val == '4') {
      this.stop = true;
      return 'Thanks for shopping with us!';
    }

    return 'You chose "'+this.menu[val]+'"';
  }

  incorrect(request) {
    return 'Sorry, there is no menu option ' + request.input.text;
  }

}

