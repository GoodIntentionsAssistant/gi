/**
 * Cache
 */
var moment = require('moment');

module.exports = class Cache {

/**
 * Constructor
 */
	constructor() {
    this.data = {};
	}


/**
 * Read
 *
 * @param {string} key
 * @returns {*}
 */
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
  

/**
 * Write
 *
 * @param {string} key
 * @param {string} value
 * @param {number} expire Milliseconds for the cache to expire
 * @returns {*}
 */
  write(key, value, expire = null) {
    if(expire) {
      expire = moment().add(expire, 'ms').valueOf();
    }

    this.data[key] = {
      expire,
      value
    };
    return true;
  }


/**
 * Remove
 *
 * @param {string} key
 * @return {boolean}
 */
  remove(key) {
    delete this.data[key];
    return true;
  }
  

/**
 * Size of data
 *
 * @returns {int}
 */
  size() {
    return Object.keys(this.data).length;
  }

  
/**
 * Clear data
 *
 * @returns {int}
 */
  clear() {
    this.data = {};
  }

}
