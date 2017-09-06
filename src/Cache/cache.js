/**
 * Cache
 */
var moment = require('moment');

module.exports = class Cache {

/**
 * Constructor
 *
 * @param object response
 * @access public
 * @return void
 */
	constructor(config = false) {
    this.data = {};
	}


/**
 * Read
 *
 * @param string key
 * @access public
 * @return mixed
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
 * @param string key
 * @param string value
 * @param int expire Milliseconds for the cache to expire
 * @access public
 * @return boolean
 */
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


/**
 * Remove
 *
 * @param string key
 * @access public
 * @return void
 */
  remove(key) {
    delete this.data[key];
  }
  

/**
 * Size of data
 *
 * @access public
 * @return int
 */
  size() {
    return Object.keys(this.data).length;
  }

  
/**
 * Clear data
 *
 * @access public
 * @return int
 */
  clear() {
    this.data = {};
  }

}
