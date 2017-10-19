---
layout: page
title: Expects
---

Expects are useful in dialogs to users to capture the next input and force it to an intent.


~~~javascript
module.exports = class HowOldAreYouIntent extends Intent {

  setup() {
    this.name = 'How old are you';
    this.train([
      'how old are you',
      'what is your age'
    ]);
  }

  response(request) {
    request.expecting.set({
      action: 'reply',
      force: true
    });
    return [
      'I have no age, I am a bot!',
      'How old are you?'
    ];
  }

  reply(request) {
    return 'OK, you are '+request.input.text;
  }

}
~~~

<div class="chat" markdown="0">
  <div class="user"><span>How old are you?</span></div>
  <div class="bot"><span>I have no age, I am a bot!</span></div>
  <div class="bot"><span>How old are you?</span></div>
  <div class="user"><span>30</span></div>
  <div class="bot"><span>OK, you are 30</span></div>
</div>



Key | Required | Default | Description
--- | --- | --- | ---
action | No | response | Action to use when the expected input has been matched
force | No | false | If set to true what ever user input after will be directed to the same intent
save_answer | No | false | If set to true the users input will be stored to their session and could be used for slotfilling
entity | No | false | User input will be parsed to get entity data. The result if matched will be set to a parameter key called `expects`


## Expects with an entity

The above example won't check for a number so the following problem can happen...

<div class="chat" markdown="0">
  <div class="user"><span>How old are you?</span></div>
  <div class="bot"><span>I have no age, I am a bot!</span></div>
  <div class="bot"><span>How old are you?</span></div>
  <div class="user"><span>Apples</span></div>
  <div class="bot"><span>OK, you are Apples</span></div>
</div>

You could handle lots of different exceptions in your `reply` method but you could also make an entity to parse and check for the information creating a better flow.

~~~javascript
module.exports = class FavoriteNumberIntent extends Intent {

  setup() {
    this.name = 'Favorite number';
    this.train([
      'what is your favorite number'
    ]);
  }

  response(request) {
    request.expecting.set({
      action: 'reply',
      entity: 'Sys.Common.Entity.Number',
      force: true
    });
    return [
      'Not sure, what is your favorite number?'
    ];
  }

  reply(request) {
    var value = request.parameters.value('expects');
    if(value) {
      return 'I think '+value+' is a lucky number too!';
    }
    return 'That is not a number';
  }

}
~~~

<div class="chat" markdown="0">
  <div class="user"><span>What is your favorite number?</span></div>
  <div class="bot"><span>Not sure, what is your favorite number?</span></div>
  <div class="user"><span>I love 60</span></div>
  <div class="bot"><span>I think 60 is a lucky number too!</span></div>
</div>

<div class="chat" markdown="0">
  <div class="user"><span>What is your favorite number?</span></div>
  <div class="bot"><span>Not sure, what is your favorite number?</span></div>
  <div class="user"><span>Bananas</span></div>
  <div class="bot"><span>That is not a number</span></div>
</div>

If you had set `force` to false it would have only called the `reply` method if a match was found so it would have replied with.

<div class="chat" markdown="0">
  <div class="user"><span>What is your favorite number?</span></div>
  <div class="bot"><span>Not sure, what is your favorite number?</span></div>
  <div class="user"><span>Bananas</span></div>
  <div class="bot"><span>Sorry, I don't understand</span></div>
</div>



## Using save answer

