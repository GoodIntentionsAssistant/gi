---
layout: page
title: Intent Training
---

For intents to be called from user input they must train the app with keywords and phrases.

Using `this.train()` function you can train the bot to understand the intent.

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


## Loading from an entity

Using entities rather than manually entering the training data into the intent seperates logic and means entities can be shared across different intents.

An entity can store and load data a number of different ways. In the example we are just storing the data directly within the entity. To learn more about different ways to use entities see the Entity documentation section.

Using the `this.train()` method any value starting with the @ symbol will be recognised as an entity to be loaded.

~~~javascript
module.exports = class ColourIntent extends Intent {

  setup() {
    this.train([
      '@App.Example.Entity.Colour'
    ]);
  }

  response() {
    return 'You mentioned a colour';
  }

}
~~~

The entity file is stored in `app/Skills/Example/Entity/colour_entity.js`.

~~~javascript
module.exports = class ColourEntity extends Entity {

  setup() {
    this.name = "Colour";
    this.data = {
      'red': {},
      'blue': {},
      'green': {},
      'white': {},
      'black': {}
    };
  }

}
~~~

See the Entity documentation for more information on ways to store data.

<div class="chat" markdown="0">
  <div class="user"><span>Red</span></div>
  <div class="bot"><span>You mentioned a colour</span></div>
  <div class="user"><span>I like green</span></div>
  <div class="bot"><span>You mentioned a colour</span></div>
  <div class="user"><span>Purple</span></div>
  <div class="bot"><span>I don't understand</span></div>
</div>



## Classifiers

Triggers and symnomns train the default classifier. To change the classifer define it in your setup.


~~~javascript
module.exports = class PingIntent extends Intent {

  setup() {
    this.name = 'Ping';
    this.trigger = 'ping';
    this.classifier = 'strict';
  }

  response() {
    return 'Pong';
  }

}
~~~


### Default classifier

The default classifier uses NLP (natural language processing) to match the user input to an intent. By default all intents will use the NLP classifier, but it's also possible to change the classifier for an entire intent or for individual keywords.


### Strict classifier

When the user input is received by the app the strict classifier will be checked for matches before the NLP classifier. This is useful when you're expecting exact input or input which can be matched with regular expressions. If a match is made the NLP classifier is not checked.

Adding a strict match for `how are you` means the user will always go to that intent and the NLP default classifier is not checked.

Regular expressions can also be added to the keywords.

~~~javascript
module.exports = class PingIntent extends Intent {

  setup() {
    this.name = 'Ping';
    this.trigger = 'ping';
    this.classifier = 'strict';
    this.symnomns = [
      new RegExp(/^.*[\d+] x [\d+].*$/,'g')
    ];
  }

  response() {
    return 'Pong';
  }

}
~~~


### Fallback classifier

It's always nice to have fallback intents if the classifiers with trained data did not get a match.

GI has common fallback intents in `Common/Intent/Fallbacks` for How, What, When, Where, Who and Why.
