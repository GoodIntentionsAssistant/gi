---
layout: page
title: Client Request
---


After the client has identified requests can be sent to the app. Certain fields must be passed along with the input.

~~~javascript
var input = {
	client: 'facebook',
	session_token: 'm626NfP8jFYPAKNw',
	user: 'bob',
	text: 'hello to my new app!',
	fast: true
};
socket.emit('request',input);
~~~

Key | Required | Description
--- | --- | ---
client | yes | Whitelisted client name. Each client should have a unique name. This must be provided for every request.
token | yes | Secret agent token key. Must be provided when identifying. It is not required when making normal requests.
session_token | yes | Session token key provided by the app that must be used on all requests.
user | yes | User unique name or identifer for the user interfacing with the app.
text | yes | Raw text input from the user
fast | no | Response from the app has delays to simulate typing to make the bot experience more human-like. By default fast is false, changing it to true will stop the simulated delays. It's advisable to enable fast when debugging.
