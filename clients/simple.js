/**
 * Very Simple GI Client Test
 * 
 * This is a test client for Good Intentions using Node.js
 * It is not designed to be used in production.
 */
const GiClient = require('./sdk/index.js');

//Configuration
let name  = 'test';                       // Must be a client name matched in app/Config/config.js
let token = 'NrCgyKqvyB';                 // The client token found in your config.js file
let host  = 'http://localhost:3000';      // Host name of the server, the GI server must be running to get a connection

//Start the SDK
GiApp = new GiClient(name, token, host);
GiApp.connect();

GiApp.on('connect', () => {
	console.log('Connected to server');
});

GiApp.on('disconnect', () => {
	console.log('Disconnected');
});

GiApp.on('identified', () => {
	console.log('Identified');
	GiApp.send('hello');
});

GiApp.on('error', (data) => {
	console.log('Error: '+data.message);
  prompt.resume();
});

GiApp.on('message', (data) => {
  //Messages
  for(var ii=0; ii<data.messages.length; ii++) {
    console.log(data.messages[ii]);
  }

  GiApp.disconnect();
});