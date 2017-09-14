/**
 * Good Intentions Client SDK
 */
const EventEmitter = require('events').EventEmitter;
const io = require('socket.io-client');


module.exports = class GiClient extends EventEmitter {

  constructor(name, token, host) {
    super();

    this.name   = name;
    this.token  = token;
    this.host   = host;

    this.socket = null;
    this.session_token = null;
  }


  events() {
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
    });
  }


  connect() {
    this.socket = io.connect(this.host, {
      reconnect: true
    });

    this.socket.on('connect', () => {
      this.emit('connect');
      this.events();
      this.identify();
    });
  }


  disconnect() {

  }


  identify() {
    this.socket.emit('identify',{
      client: this.name,
      token: this.token
    });
  }


  send(text) {
    let input = {
      client: this.name,
      session_token: this.session_token,
      text: text,
      type: 'message',
      user: 'good-intentions-user',
      fast: true
    };
    this.socket.emit('request',input);
  }



}