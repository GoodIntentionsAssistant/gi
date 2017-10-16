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
  text: 'hello to my new app!'
};
socket.emit('request',input);
~~~

Key | Required | Description
--- | --- | ---
client | yes | Whitelisted client name. Each client should have a unique name. This must be provided for every request.
session_token | yes | Session token key provided by the app that must be used on all requests. The session_token is provided when the client identifies with the server after connection.
user | yes | Unique name or identifer for the user interfacing with the app. For example this could be their facebook graph user id. For testing any value can be used.
text | yes | Raw text input from the user, e.g. "Good Morning"
fast | no | Response from the app has delays to simulate typing to make the bot experience more human-like. By default fast is false, changing it to true will stop the simulated delays. It's advisable to enable fast when debugging.


## Speeding up the request

When the request is passed to GI it will have a delay to simulate the bot typing. There are three methods to remove this delay.

### Fast Parameter

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

### Response Simulated Typing

In the `config.js` file change the `response` settings to `0`;

~~~javascript
config.response = {
  min_reply_time: 0,
  letter_speed: 0,
  max_response: 0
};
~~~

### Queue Speed

In the `config.js` file change the loop speed. By default we recommend this value to be 500ms.

~~~javascript
config.app = {
  loop_speed: 10
}
~~~