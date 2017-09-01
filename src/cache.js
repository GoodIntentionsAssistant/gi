/**
 * Cache
 */
var moment = require('moment');

module.exports = class Cache {

	constructor(config = false) {
    this.data = {};
	}

	read(key) {
    if(!(key in this.data)) {
      return false;
    }

    let record = this.data[key];

    //Check if it's expired
    if(record.expire) {
      if(moment().valueOf() > record.expire) {
        this.remove(key);
        return false;
      }
    }

    return record.value;
  }
  
  write(key, value, expire = null) {
    if(expire) {
      expire = moment().add(expire, 'ms').valueOf();
    }

    this.data[key] = {
      expire: expire,
      value: value
    };
    return true;
  }

  remove(key) {
    delete this.data[key];
  }

  size() {
    return Object.keys(this.data).length;
  }

  clear() {
    this.data = {};
  }

}
