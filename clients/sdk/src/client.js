/**
 * Good Intentions Client SDK
 */
const EventEmitter = require('events').EventEmitter;
const io = require('socket.io-client');


module.exports = class GiClient {

  constructor(name, token, host) {
    this.name   = name;
    this.token  = token;
    this.host   = host;

    this.socket = null;
    this.session_token = null;

    //Events
    events();
  }


  events() {
    socket.on('connect', () => {
      this.emit('connected');
      this.ident();
    });

    socket.on('disconnect', () => {
      this.emit('disconnected');
    });
    
    socket.on('event', function(data){
      if(data.type == 'error') {
        this.emit('error', data);
      }
      else if(data.type == 'request' && !data.success) {
        this.emit('error', data);
      }
      else if(data.type == 'identify' && data.success) {
        this.emit('identified', data);
        this.session_token = data.session_token;
      }
    });

    socket.on('response', (data) => {
      if(data.type == 'message') {
        //Sending message
        this.emit('response', data);
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
  }


  disconnect() {

  }


  ident() {
    socket.emit('identify',{
      client: this.client,
      token: this.token
    });
  }


  request() {
    let input = {
      client: 'test',
      session_token: session_token,
      text: input,
      type: 'message',
      user: 'good-intentions-user',
      fast: true
    };
    this.socket.emit('request',input);
  }



}