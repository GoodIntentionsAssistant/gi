/**
 * Web based GI Client
 *
 * 
 */
const GiClient = require('./sdk/index.js');

//Configuration
let name  = 'test';                       // Must be a client name matched in app/Config/config.js
let token = 'NrCgyKqvyB';                 // The client token found in your config.js file
let host  = 'http://localhost:3000';      // Host name of the server, the GI server must be running to get a connection

//
let server_port = 7000;


//
var clients = {};



//Start the SDK
GiApp = new GiClient(name, token, host);
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

GiApp.on('error', (data) => {
  console.log('GI: Error, '+data.message);
});

GiApp.on('message', (data) => {
  var ident = data.user;
  console.log('Received data for', ident);
  clients[ident].emit('response', data);
});

GiApp.on('type_start', (data) => {
  var ident = data.user;
  clients[ident].emit('response', data);
});

GiApp.on('type_end', (data) => {
  var ident = data.user;
  clients[ident].emit('response', data);
});




//Start the socket
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

io.on('connection', (client) => {
  console.log('New connection');

  client.on('identify', (data) => {
    console.log('Client has identified', data.ident);
    clients[data.ident] = client;
  });

  client.on('request', (data) => {
    GiApp.send(data.ident, 'message', data.text);
  });
});
