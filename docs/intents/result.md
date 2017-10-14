---
layout: page
title: Returning a result
---

Returning text back to the user can be done a few different ways.

Either via the `return` method or using the `request` parameter if there will be a delay with the response.


## Simple return example

~~~javascript
module.exports = class PingIntent extends Intent {

  setup() {
    this.name = 'Ping';
    this.train(['ping','pong']);
  }

  response() {
    return 'Pong';
  }

}
~~~

<div class="chat" markdown="0">
  <div class="user"><span>Ping</span></div>
  <div class="bot"><span>Pong</span></div>
</div>


## Returning an array

The return method can also return an array which will output to the user as multiple lines of chat.

~~~javascript
module.exports = class HelloIntent extends Intent {

  setup() {
    this.name = 'Ping';
    this.train(['hello']);
  }

  response() {
    return [
      'Hey!',
      'Very nice to meet you',
      'Let me know if you need any help'
    ];
  }

}
~~~

<div class="chat" markdown="0">
  <div class="user"><span>Hello</span></div>
  <div class="bot"><span>Hey!</span></div>
  <div class="bot"><span>Very nice to meet you</span></div>
  <div class="bot"><span>Let me know if you need any help</span></div>
</div>


## Delaying a response

If you need to fetch data from a remote source and you could have a delay a Javascript promise can be used.

~~~javascript
module.exports = class FiveSecondsIntent extends Intent {

  setup() {
    this.name = 'Five Seconds';
    this.train(['five seconds']);
  }

  response() {
    return new Promise(function(resolve, reject){
      setTimeout(() => {
        resolve('5 seconds are up');
      }, 5 * 1000);
    });
  }

}
~~~

<div class="chat" markdown="0">
  <div class="user"><span>Five seconds</span></div>
  <div class="info"><span>Five seconds later</span></div>
  <div class="bot"><span>5 seconds are up</span></div>
</div>

