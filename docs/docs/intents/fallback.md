---
layout: page
title: Fallbacks
---

Fallback intents are triggered is a users input is not matched by any other intents already trained with GI.

For a more genuine assistant and less annoying one fall backs can be used to give the user direction to using the chat bot.

GI has some system fallbacks you can use, make sure they are enabled in your `config.js` file.

~~~javascript
config.skills = [
  'App.Fallback'
];
~~~

These system fallbacks can be turned off and you could enhance them with your own skill to return random replies.

Example of the system `why` intent.

~~~javascript
module.exports = class WhyIntent extends Intent {

  setup() {
    this.train(['why'], {
      classifier: 'fallback'
    });
  }


  response() {
    return 'Everyone asks why';
  }

}
~~~


<div class="chat" markdown="0">
  <div class="user"><span>how so?</span></div>
  <div class="bot"><span>How does anything happen?</span></div>

  <div class="user"><span>what are you</span></div>
  <div class="bot"><span>Not sure, Google might know</span></div>

  <div class="user"><span>when is my birthday</span></div>
  <div class="bot"><span>I am not sure when</span></div>

  <div class="user"><span>where are my keys</span></div>
  <div class="bot"><span>Could be anywhere. I have no idea</span></div>

  <div class="user"><span>who ate my cake</span></div>
  <div class="bot"><span>No idea who!</span></div>

  <div class="user"><span>why do rainbows exist?</span></div>
  <div class="bot"><span>Everyone asks why</span></div>
</div>
