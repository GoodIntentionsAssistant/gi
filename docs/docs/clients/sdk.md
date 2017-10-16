---
layout: page
title: Good Intentions Client SDK
---

The client SDK is under development but is used for the "CLI" test client.

The Node.js SDK will provide a quick route to building your own clients and will handle identification handshakes.

### Example Client

~~~javascript
/**
 * Very Simple GI Client Test
 * 
 * This is a test client for Good Intentions using Node.js
 * It is not designed to be used in production.
 */
const GiClient = require('./sdk/index.js');

//Configuration
let name  = 'test';                       // Must be a client name matched in app/Config/config.js
let token = 'TrCgyKqVtY';                 // The client token found in your config.js file
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
  for(var ii=0; ii<data.messages.length; ii++) {
    console.log(data.messages[ii]);
  }
  GiApp.disconnect();
});
~~~

After running the script you will get a similar output to this.

~~~
> /GI/App/clients $ node simple.js
Connected to server
Identified
Hi! I'm the Good Intentions bot!
I'm all about productivity and getting things done!
Disconnected
~~~