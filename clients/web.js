/**
 * Web based GI Client
 *
 * 
 */
const GiClient = require('./sdk/index.js');

//Configuration
let name   = 'test';                       // Must be a client name matched in app/Config/config.js
let secret = 'NrCgyKqvyB';                 // The client secret found in your config.js file
let host   = 'http://localhost:3000';      // Host name of the server, the GI server must be running to get a connection

//
let server_port = 7000;


//
var tokens = {};
var sessions = {};



//Start the SDK
GiApp = new GiClient(name, secret, host);
GiApp.connect();

GiApp.on('connect', () => {
  console.log('GI: Connected');
});

GiApp.on('disconnect', () => {
  console.log('GI: Disconnected');
});

GiApp.on('identified', () => {
  console.log('GI: Identified');
});

GiApp.on('handshaked', (data) => {
  let token = data.token;
  let session_id = data.session_id
  console.log('Handshaked token', token);
  console.log('Session id', session_id);

  //Move client to live sessions
  sessions[session_id] = tokens[token];
  sessions[session_id].emit('handshake', data);

  //Remove old
  delete tokens[token];
});

GiApp.on('error', (data) => {
  console.log('GI: Error, '+data.message);
});

GiApp.on('message', (data) => {
  console.log('Received data for', data.session_id);
  sessions[data.session_id].emit('response', data);
});

GiApp.on('type_start', (data) => {
  sessions[data.session_id].emit('response', data);
});

GiApp.on('type_end', (data) => {
  sessions[data.session_id].emit('response', data);
});




/**
 * Start listening for web connections
 */
this.object = require('http').createServer();
let io = require('socket.io')(this.object);

try {
  this.object.listen(server_port, () => {
    console.log('Listening to port', server_port);
  });
}
catch(err) {
  console.log('error', err);
}


/**
 * New web connection
 */
io.on('connection', (client) => {
  console.log('New user connection');

  client.on('handshake', (data) => {
    console.log('Handshake for token', data.token);
    GiApp.handshake(data.token);
    tokens[data.token] = client;
  });

  //User sending data to GI
  client.on('request', (request) => {
    if(!request.type) {
      request.type = 'message';
    }

    GiApp.send(request.session_id, request.type, request.text, request.data);
  });
});
