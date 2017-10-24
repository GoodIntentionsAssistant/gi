---
layout: page
title: Entity data
---

An entity can store the data inside the entity file, from a JSON or CSV file or you can load the data manually.
Loading the data manually can be fetched asynchronously from a remote source. 

If the data becomes large it's best to load the data from JSON or CSV.

This is an example of storing the data within the entity.

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



## Synonyms

The json data can also include synonyms for similar words. This is an example from the `EmotionEntity`.

~~~javascript
this.data = {
  "happy": {
    "synonyms": ["great","delighted","overjoyed","thankful"]
  },
  "good": {
    "synonyms": ["calm","peaceful","comfortable","pleased"]
  }
};
~~~


## Additional meta data

Additional keys to the entity data which can be used for parameters to handle the data correctly.

This example is from `UnitEntity`.

~~~javascript
this.data = {
  "cm":{
    "label": "Centimeters",
    "measure": "length",
    "synonyms": [
      "Centimeters",
      "Centimeter",
      "cm"
    ]
  }
};
~~~

If you used `parameter('unit',{});` to your intent you could fetch `label` and `measure` with the `parameters.get()` method.

~~~javascript
//Label will be 'Centimeters'
let label = request.parameters.get('unit.label');

//Measure will be 'length'
let measure = request.parameters.get('unit.measure');

//Normal key value will be 'cm'
let value = request.parameters.value('unit');
~~~


## Accessing entity data from an intent

To load an entity from an intent use `EntityRegistry.get()`.

This example uses underscore to select a random sample from the `ColourEntity`.

~~~javascript
const _ = require('underscore');

module.exports = class RandomColourIntent extends Intent {

  setup() {
    this.train([
      'random colour'
    ]);
  }

  response(request) {
    let entity = request.app.EntityRegistry.get('App.Example.Entity.Colour');
    let data = entity.get_data();
    let output = _.sample(Object.keys(data));
    return 'Random colour is '+output;
  }

}
~~~