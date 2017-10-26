/**
 * Good Intentions Client SDK
 */
const EventEmitter = require('events').EventEmitter;
const io = require('socket.io-client');


module.exports = class GiClient extends EventEmitter {

/**
 * Constructor 
 * 
 * @param string name Client name found in your config.js file
 * @param string token Token found in your config.js file with the client name
 * @param string host Host name for connecting to the GI server, may require http:// and defining the port number
 * @access publuc
 * @return void
 */
  constructor(name, token, host) {
    super();

    this.name   = name;
    this.token  = token;
    this.host   = host;

    this.socket = null;
    this.session_token = null;

    this.setup_socket();
  }


/**
 * Setup socket
 * 
 * @access public
 * @return void
 */
  setup_socket() {
    this.socket = io.connect(this.host, {
      reconnect: true
    });
    this.events();
  }


/**
 * Bind Events
 * 
 * For socket.io responses handle them and use the EventEmitter so clients can
 * observe the emits.
 * 
 * @access public
 * @return void
 */
  events() {
    this.socket.on('connect', () => {
      this.identify();
      this.emit('connect');
    });
    
    this.socket.on('disconnect', () => {
      this.emit('disconnect');
    });
    
    this.socket.on('event', (data) => {
      if(data.type == 'error') {
        this.emit('error', data);
      }
      else if(data.type == 'request' && !data.success) {
        this.emit('error', data);
      }
      else if(data.type == 'identify' && !data.success) {
        this.emit('error', data);
      }
      else if(data.type == 'identify' && data.success) {
        this.session_token = data.session_token;
        this.emit('identified', data);
      }
    });

    this.socket.on('response', (data) => {
      if(data.type == 'message') {
        //Sending message
        this.emit('message', data);
      }
      else if(data.type == 'start') {
        //Started to type
        this.emit('type_start', data);
      }
      else if(data.type == 'end') {
        //Finished typing
        this.emit('type_end', data);
      }
      else if(data.type == 'notice') {
        //Server notice
        this.emit('notice', data);
      }
    });
  }


/**
 * Connect
 * 
 * Method to connect using Socket.io to the host.
 * Once connected it will bind the events and identify itself to the server
 * 
 * @access public
 * @return void
 */
  connect() {
  }


/**
 * Disconnect from the GI server
 * 
 * @access public
 * @return void
 */
  disconnect() {
    this.socket.disconnect();
  }


/**
 * Identify to the GI server
 * 
 * Part of the handshake with the GI server is sending identification details to the server.
 * These details must match what is stored in the app/Config/config.js file.
 * If the client does not identify then no other messages can be sent to the server.
 * 
 * If the identification is successful the GI server will return a session_token. This session_token
 * is then used on all future calls. This identification token is only required once.
 * 
 * @access public
 * @return void
 */
  identify() {
    this.socket.emit('identify',{
      client: this.name,
      token: this.token
    });
  }


/**
 * Send to GI
 * 
 * Raw text sent to GI server. The client and session token must match otherwise the 
 * server will reject the input. Identification is required before sending a message.
 * 
 * @param string text
 * @access public
 * @return void
 */
  send(user, type, text) {
    let input = {
      client: this.name,
      session_token: this.session_token,
      type: type,
      user: user,
      fast: true
    };
    if(text) {
      input.text = text;
    }
    this.socket.emit('request',input);
  }



}