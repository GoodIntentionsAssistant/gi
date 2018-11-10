/**
 * Package
 */
module.exports = class PrPackageompt {

/**
 * Constructor
 *
 * @access public
 * @return void
 */
  constructor() {
  }


  
  fetch() {
    console.log('fetch packages');
  }



  install(name) {
    console.log('install '+name);
  }



  remove(name) {
    console.log('remove ' + name);
  }



  list() {
    console.log('list packages');
  }




}