---
layout: page
title: Client Authorization
---

## White listing a new client

For security only white listed clients can connect and send input to the framework. In the config file are settings to define the name and the client secret token. If you create a new client you must add the key and token to the configuration file first.

~~~javascript
this.clients = {
	'facebook': {
		'token': 'this-is-my-secret-token'
	}
};
~~~


## Client authorizing and identifying

On connecting the client must identify itself using the token.

~~~javascript
socket.emit('identify',{
	client: 'facebook',
	token: 'this-is-my-secret-token'
});
~~~

An event will be returned with a ``session_token``. This token must be made on all requests.

~~~json
{
  "success": true,
  "message": "Successfully identified",
  "session_token": "m626NfP8jFYPAKNw",
  "ident": "ZNWXHXYT",
  "type": "identify"
}
~~~