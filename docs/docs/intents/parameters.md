---
layout: page
title: Intent Parameters
---

Some intents require parameters to work.

The key of the parameter is used when fetching parameters in your intent.
If your key was 'date' in your intent you can call, `request.parameters.value('date');` for the value.

If a parameter is required and is not specified by the users input request.js will change the
intent to be `App.Errors.ParametersFailed` and an error message is displayed. This saves putting additional code into your intent to handle validation and exceptions.


~~~javascript
module.exports = class OrderIntent extends Intent {

  setup() {
    this.train([
      'order',
      'order food'
    ]);

    this.parameter('choice', {
      name: "Choice",
      data: {
        "pizza": {},
        "burger": {},
        "fries": {}
      }
    });
  }

  response(request) {
    let choice = request.parameters.value('choice');

    if(choice) {
      return 'You chose '+choice;
    }
    else {
      return 'Pizza, burger or fries?';
    }
  }

}
~~~

Example input and output

<div class="chat" markdown="0">
  <div class="user"><span>Order food</span></div>
  <div class="bot"><span>Pizza, burger or fries?</span></div>
  <div class="user"><span>Order burger</span></div>
  <div class="bot"><span>You chose burger</span></div>
</div>


Key | Required | Description
--- | --- | ---
name | Yes | Nice friendly name for the parameter. This name is used if the parameter is required and not provided
entity | No | Parameters need to be extracted and they need something to match aganist. If you are matching a number set the entity to be number and Entity/Number will be used. If you want to detect a date then you can use the Entity/Date module. Sometimes you don't want to create a full entity to handle a small amount of data so you can use the 'data' attribute below. See the Entity section for more information.
data | No | You cannot use 'entity' and 'data' fields together. Data is a hash of data that is used for extracting parameters when you don't want to create an entity. All parameter extracting use entities, so when Parameter is trying to extract data from the user input and 'data' is set it will create Entity/Dummy and copy the data to the module. The data format is exactly the same as the data settings in entities.
required | No | Default is false. If the intent has been found the paramters are checked one by one before calling the action. But if a parameter is required and it's not found the intent will be set to Errors/ParametersFailed e.g. Currency conversion requires a number, currency from and currency to. If all three of these are not found in the users input then the intent cannot be called.
default | No | If no value was found in the users input the `value` of the data will be set to `default`. This is useful when you want user confirmation and you want the default to be no.
action | No | If the parameter is found the action will be changed from 'response' to this value
slotfill | No | Attempt to load the data from previously saved parameter information


## Parameters from an Entity

Parameter options can be loaded from an entity using the `entity` key.

Please read the guide on creating entities before using entities inside intents.

~~~javascript
module.exports = class AnimalIntent extends Intent {

	setup() {
		this.train([
			'cat','dog'
		]);

		this.parameter('choice', {
			name: "Choice",
			entity: "App.Example.Entity.Animal"
		});
	}

	response(request) {
		let choice = request.parameters.value('choice');

		if(choice) {
			return 'You chose '+choice;
		}
		else {
			return 'Dog or cat?';
		}
	}

}
~~~


## Redirection action

In the previous examples the initial intent and the response go to the same method.

By defining the action in `parameter` if the parameter is filled it will use a different method.

~~~javascript
module.exports = class SugarIntent extends Intent {

	setup() {
		this.train([
			'tea'
		]);

		this.parameter('choice', {
			name: "Choice",
			data: {
				"yes": {},
				"no": {}
			},
			action: 'answered'
		});
	}

	response(request) {
		return 'Do you want sugar in your tea?';
	}

	answered(request) {
		let choice = request.parameters.value('choice');
		return choice == 'yes' ? 'Sweet tooth' : 'Health option';
	}

}

~~~


## Slot Filling

To be documented