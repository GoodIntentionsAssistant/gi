---
layout: page
title: Client Authorization
---

## White listing a new client

Only clients that have been white listed can connect and send input to the framework. In the app config file are settings to define the name and the client token. If you create a new client you must add the key and token to the configuration file first.

~~~javascript
config.clients = {
  'facebook': { 
    'token': 'this-is-my-secret-token'
  }
};
~~~


## Client authorizing and identifying

On connecting the client must identify itself using its client name and `token` found in your config.js file.

~~~javascript
socket.emit('identify',{
  client: 'facebook',
  token: 'this-is-my-secret-token'
});
~~~

An event will be returned with the success and a ``session_token``.

~~~json
{
  "success": true,
  "message": "Successfully identified",
  "session_token": "m626NfP8jFYPAKNw",
  "ident": "ZNWXHXYT",
  "type": "identify"
}
~~~

This token must be made on all future requests. The client token is no longer needed.