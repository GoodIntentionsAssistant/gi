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

You can also handle finishing the request manually using `request.end()` which is used in the CountSixSeconds example below.

~~~javascript
module.exports = class FiveSecondsIntent extends Intent {

  setup() {
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


## Multiple delayed responses

To send multiple responses from one intent the request must return `false` and the request must be ended manually using `request.end()`.

In this example the intent will count to six while keeping the individual session alive until it counts to 6 and then the request is manually ended.

If the request is not ended the queue timeout will be called.


~~~javascript
module.exports = class CountSixSecondsIntent extends Intent {

  setup() {
    this.train(['count to six']);
  }

  response(request) {
    setTimeout(() => { request.send('1'); }, 1 * 1000);
    setTimeout(() => { request.send('2'); }, 2 * 1000);
    setTimeout(() => { request.send('3'); }, 3 * 1000);
    setTimeout(() => { request.send('4'); }, 4 * 1000);
    setTimeout(() => { request.send('5'); }, 5 * 1000);
    setTimeout(() => {
      request.send('6');
      request.end();
    }, 6 * 1000);

    return false;
  }

}
~~~

<div class="chat" markdown="0">
  <div class="user"><span>Count to six</span></div>
  <div class="info"><span>1 second later</span></div>
  <div class="bot"><span>1</span></div>
  <div class="info"><span>1 second later</span></div>
  <div class="bot"><span>2</span></div>
  <div class="info"><span>1 second later</span></div>
  <div class="bot"><span>3</span></div>
  <div class="info"><span>1 second later</span></div>
  <div class="bot"><span>4</span></div>
  <div class="info"><span>1 second later</span></div>
  <div class="bot"><span>5</span></div>
  <div class="info"><span>1 second later</span></div>
  <div class="bot"><span>6</span></div>
  <div class="info"><span>Session ended</span></div>
</div>