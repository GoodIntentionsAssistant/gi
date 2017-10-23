---
layout: page
title: Loading entity data from JSON
---

Entity data can be stored in a `.json` file and loaded into the entity.

In this example the file is created, `app/Skill/Example/Data/animals.json`.

The file contents formatting should match exactly the same as if the data was defined within the exports.

~~~json
{
  "entries": {
    "dog": {},
    "cat": {}
  }
}
~~~


The entity can load this and other json compatible files using `this.import` and defining `file` and `type`.

~~~javascript
module.exports = class AnimalEntity extends Entity {

  setup() {
    this.import = {
      file: "App.Example.Data.animals",
      type: "json"
    };
  }

}
~~~

This example uses the `AnimalExample` intent.