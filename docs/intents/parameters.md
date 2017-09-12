---
layout: page
title: Intent Parameters
---

Some intents require parameters to work.

The key of the parameter is used when fetching parameters in your intent.
If your key was 'date' in your intent you can call, `request.parameters.value('date');` for the value.

If a parameter is required and is not specified by the users input request.js will change the
intent to be `Errors/ParametersFailed` and an error message is displayed. This saves putting additional code into your intent to handle validation and exceptions.


~~~javascript
module.exports = class FoobarIntent extends Intent {

  setup() {
    this.parameters = {
      "number": {
        "name": "Number",
        "entity": "Common/Number",
        "required": false
      },
      "city": {
        "name": "City",
        "entity": "Common/City",
        "required": false,
        "action": 'city'
      }
    };
  }

  response(request) {
    return 'Number is ' + request.parameters.value('number');
  }

  city(request) {
    return 'City is ' + request.parameters.value('city');
  }

}
~~~


Key | Required | Description
--- | --- | ---
name | Yes | Nice friendly name for the parameter. This name is used if the parameter is required and not provided
entity | No | Parameters need to be extracted and they need something to match aganist. If you are matching a number set the entity to be number and Entity/Number will be used. If you want to detect a date then you can use the Entity/Date module. Sometimes you don't want to create a full entity to handle a small amount of data so you can use the 'data' attribute below. See the Entity section for more information.
data | No | You cannot use 'entity' and 'data' fields together. Data is a hash of data that is used for extracting parameters when you don't want to create an entity. All parameter extracting use entities, so when Parameter is trying to extract data from the user input and 'data' is set it will create Entity/Dummy and copy the data to the module. The data format is exactly the same as the data settings in entities.
required | No | Default is false. If the intent has been found the paramters are checked one by one before calling the action. But if a parameter is required and it's not found the intent will be set to Errors/ParametersFailed e.g. Currency conversion requires a number, currency from and currency to. If all three of these are not found in the users input then the intent cannot be called.
default | No | If no value was found in the users input the `value` of the data will be set to `default`. This is useful when you want user confirmation and you want the default to be no.
action | No | If the parameter is found the action will be changed from 'response' to this value
slotfill | No | Attempt to load the data from previously saved parameter information


## Slot Filling

To be documented