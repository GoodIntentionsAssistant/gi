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
    this.client_token = null;

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
      else if(data.type == 'handshake' && !data.success) {
        this.emit('error', data);
      }
      else if(data.type == 'identify' && data.success) {
        this.client_token = data.session_token;
        this.emit('identified', data);
      }
      else if(data.type == 'handshake' && data.success) {
        this.emit('handshaked', data);
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
 * If the identification is successful the GI server will return a client_session. This client_session
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
 * Handshake
 *
 * Handshake from the user using the client back to the server.
 * A handshake must happen before any data can be sent from this user.
 * 
 * @access public
 * @return void
 */
  handshake(user_token) {
    this.socket.emit('handshake',{
      client: this.name,
      token: user_token
    });
  }


/**
 * Send to GI
 * 
 * Raw text sent to GI server. The client and session token must match otherwise the 
 * server will reject the input. Identification is required before sending a message.
 * 
 * @param string user_session
 * @param string type
 * @param string text
 * @access public
 * @return void
 */
  send(session_id, type, text) {
    let input = {
      client: this.name,
      client_session_id: this.client_token,
      session_id: session_id,
      type: type,
      fast: true
    };

    if(text) {
      input.text = text;
    }

    this.socket.emit('request',input);
  }



}