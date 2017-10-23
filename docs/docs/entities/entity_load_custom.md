---
layout: page
title: Loading custom entity data
---

Loading data into an entity using a custom method is useful for processing unformatted JSON and CSV data, data manipulation, fetching data from a database or a remote source.

The `Drink` Entity and Intent will load data from a .txt file into the entity data.

~~~javascript
module.exports = class DrinkEntity extends Entity {

  setup() {
    this.import = {
      type: 'custom'
    };
  }


  load_data(resolve, options) {
    let fs = require('fs');
    let filename = this.app.Path.get('skills.app') + '/Example/Data/drinks.txt';
    let output = {};

    let promise = new Promise((resolve, reject) => {
      fs.readFile(filename, 'utf8', function(err, data) {
        if (err) throw err;
        var lines = data.split(/\r?\n/);
        for(var ii=0; ii<lines.length; ii++) {
          if(!lines[ii]) { break; }
          output[lines[ii]] = {};
        }
        resolve(output);
      });
    });

    return promise;
  }

}
~~~

The data stored in `drinks.txt` is simply a new line list of different drinks.

~~~
water
sprite
7up
coke
pepsi
coffee
tea
beer
lager
~~~