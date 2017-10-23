---
layout: page
title: Loading entity data from CSV
---

Entity data stored in a `.csv` format can be useful if you have a large dataset which you don't want to convert to JSON.

The first value is the key and all columns after will be used as synonyms.

~~~
"EUR","Euro"
"FJD","Fijian Dollar"
"FKP","Falkland Islands Pound"
"GBP","British Pound Sterling","Sterling"
~~~

If you was going to convert this data to a standard GI json file it would look like...


~~~json
{
  "entries": {
    "EUR": { "synonyms":["Euro"] },
    "FJD": { "synonyms":["Fijian Dollar"] },
    "FKP": { "synonyms":["Falkland Islands Pound"] },
    "GBP": { "synonyms":["British Pound Sterling","Sterling"] }
  }
}
~~~


Using `this.import` and defining `file` and `type` the CSV file can be imports to the entity.

~~~javascript
module.exports = class CurrencyEntity extends Entity {

  setup() {
    this.import = {
      file: "Data.Common.currencies",
      type: "csv"
    };
  }

}
~~~

This example uses the `CurrencyIntent` intent.