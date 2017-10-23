---
layout: page
title: Intent Training
---

For intents to be called from user input they must train the app with keywords and phrases.

Using `this.train()` function you can train the bot to understand the intent.

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

When training GI the default classifier is using NLP to match the user input to an intent.

Triggers and symnomns train the default classifier. To change the classifer change it as an option when using the `train()` method.


~~~javascript
//Default NLP classifier
this.train(['kiss me'], { classifier: 'default' });

//Use the strict classifier
this.train(['kiss me'], { classifier: 'strict' });

//If nothing is found in default or strict then try the fall back
this.train(['kiss me'], { classifier: 'fallback' });
~~~

## Strict classifier

When the user input is received by the app the strict classifier will be checked for matches before the NLP classifier. This is useful when you're expecting exact input or input which can be matched with regular expressions. If a match is made the NLP classifier is not checked.

Adding a strict match for `kiss me` means the user will always go to that intent and the NLP default classifier is not checked.

Case is ignored.

~~~javascript

module.exports = class KissMeIntent extends Intent {

  setup() {
    this.train(['kiss me'], {
      classifier: 'strict'
    });
  }

  response() {
    return 'Muwah';
  }

}
~~~

<div class="chat" markdown="0">
  <div class="user"><span>Kiss me</span></div>
  <div class="bot"><span>Muwah</span></div>
  <div class="user"><span>Why not kiss me</span></div>
  <div class="bot"><span>I don't understand</span></div>
  <div class="user"><span>Kiss bob</span></div>
  <div class="bot"><span>I don't understand</span></div>
</div>


## Regular expression training

Regular expressions can be added to the training for matching. These will be added to the strict classifier for checking before the default NLP checking.

It's not really recommended to use regular expressions because an extact match is required but it can be useful for a calculator intent.

~~~javascript
this.train([
  new RegExp(/^.*[\d+] x [\d+].*$/,'g'),
  new RegExp(/^(calc )?[\d\+\/\*.\-% \(\)=]*$/,'g'),
  new RegExp(/^[\d+]*%( of)? [\d\+\/\*.\- \(\)=]*$/,'g')
]);
~~~


## Fallback classifier

It's always nice to have fallback intents if the classifiers with trained data did not get a match.

GI has common fallback intents in `Common/Intent/Fallbacks` for How, What, When, Where, Who and Why.
