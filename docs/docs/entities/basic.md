---
layout: page
title: Basic entity
---

A basic entity can store the data inside the entity file.

This can be useful when you're quickly putting new intents together with a small amount of data.

If the data becomes large it's best to load the data from JSON or CSV.


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