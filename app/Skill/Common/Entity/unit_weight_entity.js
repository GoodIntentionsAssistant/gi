/**
 * Weight
 */
const Entity = require('../../../../src/Entity/entity');

module.exports = class WeightEntity extends Entity {

  setup() {
    this.data = {};
    this.import = {
      type: "custom"
    };
  }

  load_data(resolve, request) {
    let promise = this.app.Data.load('Data.Common.units', 'json');

    promise.then((json) => {
      for(let key in json.entries) {
        if(json.entries[key].measure != 'weight') {
          continue;
        }

        this.data[key] = {
          label: json.entries[key].label,
          synonyms: json.entries[key].synonyms
        };
      }

      resolve();
    });

  }


  parse(string) {
    var result = this.find(string, {
      use_key: false
    });
    return result;
  }

}

