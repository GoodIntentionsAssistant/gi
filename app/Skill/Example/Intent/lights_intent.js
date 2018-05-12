/**
 * Lights Intent
 */
const Intent = require('../../../../src/Intent/intent');

module.exports = class LightsIntent extends Intent {

  setup() {
    this.train([
      'lights',
      'light'
    ]);

    this.parameter('state', {
      data: {
        'on': {},
        'off': {
          'synonyms': 'of'
        }
      }
    });

    this.parameter('colour', {
      data: {
        'red': {},
        'green': {},
        'blue': {},
        'white': {}
      }
    });

    this.parameter('brightness', {
      data: {
        'dim': {},
        'brighten': {},
        'up': {},
        'down': {}
      }
    });

    this.parameter('brightness_percentage', {
      entity: 'App.Common.Entity.Percentage'
    });
  }

  response(request) {
    //Question
    if(request.utterance.is_question()) {
      return this.question(request);
    }

    //Get user options
    let state = request.parameters.value('state');
    let colour = request.parameters.value('colour');
    let brightness = request.parameters.value('brightness');
    let brightness_percentage = request.parameters.value('brightness_percentage');

    //No options?
    if(!state && !colour && !brightness && !brightness_percentage) {
      return 'What do you want to change for your light?';
    }

    //Current light state
    let light = this._getLight(request);

    //Turning it off, but off already
    if(state == 'off' && light.state == 'off') {
      return 'The light is already off';
    }

    //Turning it on, but light on already
    if(state == 'on' && light.state == 'on') {
      return 'The light is already on';
    }

    //Changed array
    let changes = [];

    //Change state
    if(state && state == 'on') {
      this._turnOn(request);
      changes.push('Turned lights on');
    }
    else if(state && state == 'off') {
      this._turnOff(request);
      changes.push('Turned lights off');
      return changes;
    }

    //Colour
    if(colour) {
      this._colour(request, colour);
      changes.push('Changed colour to '+colour);
    }

    //Brightness
    if(brightness) {
      var _brightness = light.brightness;

      if(brightness == 'dim') {
        _brightness = 20;
        this._brightness(request, 20);
      }
      else if(brightness == 'brighten') {
        _brightness = 80;
        this._brightness(request, _brightness);
      }
      else if(brightness == 'up') {
        _brightness = light.brightness + 20;
        if(_brightness > 100) { _brightness = 100; }
        this._brightness(request, _brightness);
      }
      else if(brightness == 'down') {
        _brightness = light.brightness + 20;
        if(_brightness < 20) { _brightness = 20; }
        this._brightness(request, _brightness);
      }
      changes.push('Brightness set to '+_brightness+'%');
    }

    //Brightness percentage
    if(!brightness && brightness_percentage && brightness_percentage <= 100) {
      this._brightness(request, brightness_percentage);
      changes.push('Brightness set to '+brightness_percentage+'%');
    }

    let output = changes.join(', ');

    return output;
  }


  question(request) {
    //Questions to match on
    let state = request.parameters.value('state');
    let colour = request.parameters.value('colour');

    //Current light state
    let light = this._getLight(request);

    //State of light
    if(state && state == light.state) {
      return 'Yes, the light is '+light.state;
    }
    else if(state && state != light.state) {
      return 'Yes, the light is '+light.state;
    }

    //Colour
    if(colour && colour != light.colour) {
      return 'No, the light colour is '+light.colour;
    }
    else if(colour && colour == light.colour) {
      return 'Yes, the light colour is '+light.colour;
    }

    return 'Sorry, I\'m not sure what you are asking';
  }


  _getLight(request) {
    if(!request.user.has('example.light')) {
      request.user.set('example.light', {
        state: 'on',
        colour: 'white',
        brightness: '100'
      });
    }
    return request.user.get('example.light');
  }

  _turnOn(request) {
    request.user.set('example.light.state', 'on');
  }

  _turnOff(request) {
    request.user.set('example.light.state', 'off');
  }

  _colour(request, colour) {
    request.user.set('example.light.colour', colour);
  }

  _brightness(request, brightness) {
    request.user.set('example.light.brightness', brightness);
  }


}

