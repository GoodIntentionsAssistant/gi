---
layout: page
title: Client Response
---


The response from the app will return JSON formatted data. A response will come in multiple parts and have the same ident and an increasing sequence number.

Multipart sending can be useful when the result could be delayed by latency when calling a remote API, such as flight searches. It's possible to send the first message telling the user to wait a moment.

~~~json
{
  "type": "message",
  "messages": [ "Hi! I'm the Good Intentions bot!" ],
  "attachments": {},
  "intent": "Fun/Greeting",
  "action": "response",
  "namespace": "response",
  "confidence": 22.5646096341948,
  "sequence": 1,
  "microtime": 1503840844828
}
~~~

Key | Description
--- | ---
type | Currently supported types are "start", "end" and "message".
messages | If the `type` is message an array of messages will be returned.
attachments | Rich meta data including payload data for images, links, action buttons for the clients.
intent | The intent which was called.
action | The indents action which was called.
namespace | Return socket.io name space
confidence | Intent classifiers confidence
sequence | Incrementing number since the server was started
microtime | Server microtime when the data was sent


## Example of catching response

~~~javascript
socket.on('response', (data) => {
  if(data.type == 'message') {
    for(let ii=0; ii<data.messages.length; ii++) {
      console.log('Message:', data.messages[ii]);
    }
  }
});
~~~