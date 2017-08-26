# Good Intentions Chat Bot


## Overview
GI is a chat bot framework.

It is very much experimental and in its infancy but I've been really interested to make it open source to see if the community can build, improve and provide feedback on the framework.

The bot server cannot just be run by itself, it requires clients (known as agents) to act as middleware.

The system has inspirations from Api.ai so some of their documentation found at
https://docs.api.ai/ can also be used to get an overview of some aspects of this system.



## Installation

GI uses NodeJS 8.x and the code has only been tested on Linux Mint.

To install NodeJs find the instructions from https://nodejs.org


## How to Run
Run the server and client in two terminals
```
node server.js
node client.js
```


## Key elements

These key elements are described in more detail in this documentation.

**Apps**
Collection of entities and intents

**Agents**
The interface between the brain and the end-point

**Queue**
Queues user input requests for memory and flood protection

**Request**
Handles the user input, finding which intent to use and calling the intent

**Auth and Session**
User pesistent sessions over multiple calls, with API token and context information

**Learn**
NLP interface for user input text to intent

**Entities**
Data source for training the system and parsing parameters from user input. Compares to a model.

**Intents**
Business logic for the users input. Compares to a controller.

**Parameters**
Parses user input text




## Unit Tests

Unit testing is split into two types. Firstly for the framework itself and secondly for acceptance testing of the intents. One of the trickiest parts of building a chat bot and building up intents is ensuring the expected intent is called. Unit test can be used to make sure sample input will call the correct intent.

The app uses Jasmine Node for unit testing

``jasmine-node --autotest --verbose spec/``


To check automatic intent tests run

``jasmine-node --autotest -m intent_auto_tests\. --verbose spec/``



To run unit tests for one spec use `-m` for matching

``jasmine-node --autotest -m intents\. --verbose spec/``



## Agents
Agents are not included in this repository but client.js acts as a simple test interface that
connects to the server and enables live input.

Agents would include bots that connect to Slack, Hipchat, Line, Facebook, etc...

Some platforms like Facebook currently only allow webhooks and not connected bots but it's possible to create an agent which will handle the webhooks. I may publish some agents that handle webhooks once the code is better.




## App (Brain)
The app will load what is required and handle incoming requests with queuing and basic flood protection.
See the queue section for more information about flood protection.

When loading the app you need to specify which apps you want to load.

```javascript
var App = require('./brain/app');
App.load(['Admin','Common','Devi']);
```

The app will load all entities and intents from each app directory before the queue is started.

To create a new set of Entities and Intents create a new directory in /apps/ directory.
App directory, it's intents and entities must use CamelCase directory names.



## Queuing / Flood Protection
Each request is added to the queue array and a loop in the app will call each queue_speed, it'll
check the queue and if not empty it'll take the next request and run it.

Each request is stored and only `max_consecutive` requests can be made at one time. When testing it's a good idea
to have max_consecutive set to 1 so it will do one request at a time.

The queueing also acts as basic flood protection. If a user is malicious they may try to send hundreds of lines
to the bot, or they may copy and paste hundreds of lines by mistake into a client.



## Request
Each input to the brain is handled by a new request object. It handles sessions, various errors, admin calls and calling the indent.
A request is initialised from the queue.

Request should be simple and minimal as possible to save memory on each user request.



## Auth and Sessions

To be written



## Learn

To be written

Multiple classifiers can be used for training and searching for intents based on user input.



## API

To be written



## Entities
Entities are used for training the system and parsing parameters.
They can almost be seen as a dictionary of words.

They are only used with intents to train the brain on a list of words.

Before an intent is called parameters are parsed using entity data.







## Intents
An intent is a mapping between what a user inputs and what action should be carried out.

Intents have the following sections:
* Training
* Action
* Response
* Context

### Settings for the intent

`name` **(required)**

Must be the same as the intent name
e.g. LeaveAddIntent the name will be LeaveAdd.

`trigger` *(optional)*

Main keyword for the intent. This will be used for training
It is a good idea to keep this value accurate to what the intent does, do not make it too generic
e.g. leave

`synonyms` *(optional)*

Optional trigger keywords for training
These are passed as an array
e.g. vacation, holiday

`parameters` *(optional)*

For more information see the parameters section.
This is a hash of parameters that might be included with the intention call.
e.g. Add vacation for tuesday
"Tuesday" will be a parameter called day and use the date entity

`auth` *(optional)*

Default it is false
If the intent needs authorisation to the remote API set this value to the authorisation required.

For example you may want to call the API for employee list, but this requires the user to be
authorised with the API server. If you set the Session.set_authorized('api_server'); and set `auth` to 'api_server' then the intent can be called. If the session has not authorized with 'api_server' then 'Errors/NoAuth' intent is called and the user is returned an error.



### Basic example

```javascript
var Intent = require('../../../../src/Intent/intent');

function HelpIntent() {
	var methods = {
		name: 'Help',
		trigger: 'help'
	}
	methods.__proto__ = Intent()

	methods.response = function() {
		return 'I will help you another time';
	}

	return methods
}

module.exports = HelpIntent;
```





## Parameters
Some intents require parameters to work.

The key of the parameter is used when fetching parameters in your intent.
If your key was 'date' in your intent you can call, `request.param('date');` and the value will be returned.

If a parameter is required and is not specified by the users input request.js will change the
intent to be Errors/ParametersFailed and an error message is displayed.

Parameters can use Entities that require live session data so delay in parsing might occur while it loads
that data. This is the reason Parameters uses Promise. An example would be trying to parse an employee name.
If we are trying to get an employee name then we need to have the session to do an API call to their account
and fetch the employee details. Also meaning we cannot reuse this Entity object for other users who might
be API users of a different account.


### Settings for parameters inside intents

`name` **required**

Nice friendly name for the parameter
This name is used if the parameter is required and not provided


`entity` *optional*

Parameters need to be extracted and they need something to match aganist.
If you are matching a number set the entity to be number and Entity/Number will be used.
If you want to detect a date then you can use the Entity/Date module.
Sometimes you don't want to create a full entity to handle a small amount of data so you can use the 'data' attribute below
See the Entity section for more information.


`data` *optional*

You cannot use 'entity' and 'data' fields together.
Data is a hash of data that is used for extracting parameters when you don't want to create an entity.
All parameter extracting use entities, so when Parameter is trying to extract data from the user input
and 'data' is set it will create Entity/Dummy and copy the data to the module.
The data format is exactly the same as the data settings in entities.


`required` *optional*

Default is false
If the intent has been found the paramters are checked one by one before calling the action.
But if a parameter is required and it's not found the intent will be set to Errors/ParametersFailed
e.g. Currency conversion requires a number, currency from and currency to. If all three of these
are not found in the users input then the intent cannot be called.


`default` *optional*

If no value was found in the users input the `value` of the data will be set to `default`. This is useful when you want user confirmation and you want the default to be no.

