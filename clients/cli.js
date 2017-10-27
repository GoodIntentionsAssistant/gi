/**
 * CLI Test Client for Good Intentions
 * 
 * This is a test client for Good Intentions using Node.js
 * It is not designed to be used in production.
 */
const GiClient = require('./sdk/index.js');

//Configuration
let name  = 'test';                       // Must be a client name matched in app/Config/config.js
let token = 'NrCgyKqvyB';                 // The client token found in your config.js file
let host  = 'http://localhost:3000';      // Host name of the server, the GI server must be running to get a connection

let user  = 'good-intentions-user';

//Colours for terminal output
const colours = {
  'default':    ['\x1b[36m','\x1b[0m'],      //Blue
  'secondary':  ['\x1b[35m','\x1b[0m'],      //Purple
  'success':    ['\x1b[32m','\x1b[0m'],      //Green
  'warning':    ['\033[31m','\033[0m'],      //Red
  'error':      ['\033[31m','\033[0m'],      //Red
  'mute':       ['\x1b[90m','\x1b[0m'],      //Gray
};

//Output start message
output('Loading GI SDK and attemping connection');

//Prompt input
const prompt = require('prompt');
let prompt_loaded = false;

//Start the SDK
GiApp = new GiClient(name, token, host);
GiApp.connect();

GiApp.on('connect', () => {
	output('Connected to server', 'success');
});

GiApp.on('disconnect', () => {
	output('Disconnected', 'warning');
  //prompt.pause();
});

GiApp.on('identified', () => {
  output('Client identified', 'success');

  //Handshake for the user
  GiApp.send(user, 'handshake');

  prompt_me();
});

GiApp.on('error', (data) => {
	output('Error: '+data.message, 'error');
  prompt.resume();
});

GiApp.on('notice', (data) => {
  let message = data.messages.join(', '); 
	output('Notice: '+message, 'mute');
});

GiApp.on('type_start', () => {
	output('GI is typing', 'mute');
});

GiApp.on('type_end', () => {
	output('GI has finished typing', 'mute');
  prompt_me();
});

GiApp.on('message', (data) => {
  //Messages
  for(var ii=0; ii<data.messages.length; ii++) {
    output(data.messages[ii]);
  }

  //Attachments
  if(data.attachments.actions) {
    var actions = data.attachments.actions;
    var _data = []; 
    for(var ii=0; ii<actions.length; ii++) {
      _data.push(actions[ii].text);
    }
    output('Options: '+_data.join(', '), 'secondary');
  }

  if(data.attachments.images) {
    var images = data.attachments.images;
    for(var ii=0; ii<images.length; ii++) {
      output('Image: '+images[ii].url, 'secondary');
    }
  }

  if(data.attachments.shortcuts) {
    var shortcuts = data.attachments.shortcuts;
    for(var ii=0; ii<shortcuts.length; ii++) {
      output('Shortcut: '+shortcuts[ii].text, 'secondary');
    }
  }

  if(data.attachments.links) {
    var links = data.attachments.links;
    for(var ii=0; ii<links.length; ii++) {
      output('Link: '+links[ii].text+' ['+links[ii].url+']', 'secondary');
    }
  }

  if(data.attachments.fields) {
    var fields = data.attachments.fields;
    for(var ii=0; ii<fields.length; ii++) {
      output('Field: '+fields[ii].title+': '+fields[ii].value, 'secondary');
    }
  }

  //Debug information
  let debug = [];
  debug.push('Confidence: '+data.confidence);
  debug.push('Intent: '+data.intent);
  debug.push('Action: '+data.action);
  debug.push('Classifier: '+data.classifier);
  debug.push('Seq.: '+data.sequence);
  output(debug.join(' | '),'mute');
});


function output(string, colour = 'default') {
	console.log(colours[colour][0] + string + colours[colour][1]);
}

function prompt_me() {
	var schema = {
		properties: {
			input: {
				message: ' '
			}
		}
  };
  prompt.message = '';

  if(prompt.paused) {
    prompt.resume();
  }
  else {
    prompt.start();
  }

	prompt.get(schema, function (err, result) {
		GiApp.send(user, 'message', result.input);
    prompt.pause();
	});
}