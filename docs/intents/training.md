---
layout: page
title: Intent Training
---

For intents to be called from user input they must train the app with keywords and phrases.


## Trigger and symnomns

The main trigger keyword can be defined to train the classifier to route to the correct intent. You can also use symnomns which are similar words you want to train the classifers with.

~~~javascript
var Intent = require('../../../../src/Intent/intent');

module.exports = class PingIntent extends Intent {

	setup() {
		this.name = 'Ping';
		this.trigger = 'ping';
		this.symnomns = ['pong'];
	}

	response() {
		return 'Pong';
	}

}
~~~


## Loading from entity data

To be written


## Classifiers

Triggers and symnomns train the default classifier. To change the classifer define it in your setup.


~~~javascript
var Intent = require('../../../../src/Intent/intent');

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

Regular expressions can also be added to the keywords. For example the following will match a basic calculation input.

~~~
/^(calc )?[\\d\\+\\/\\*\.\\-% \\(\\)=]*$/
~~~


### Fallback classifier

It's always nice to have fallback intents if the classifiers with trained data did not get a match.

GI has common fallback intents in `Common/Intent/Fallbacks` for How, What, When, Where, Who and Why.