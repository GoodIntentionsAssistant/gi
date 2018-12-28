/**
 * Package Manager
 */
const Config = require('../Config/config.js');
const fetch = require('node-fetch');
const fs = require('fs-extra');

module.exports = class PackageManager {

/**
 * Constructor
 *
 * @access public
 * @return void
 */
  constructor() {
    this.packages = {};
    this.load();
  }


/**
 * Load module
 *
 * @access public
 * @return void
 */
  load() {
    var filename = Config.path('package') + '/packages.json';

    var data = fs.readFileSync(filename, { encoding: 'utf-8' });
    var json = JSON.parse(data);

    if (!json || !json.packages) {
      return console.error('Data in packages.json could not be converted to JSON');
    }

    this.packages = json.packages;
  }


/**
 * Fetch latest packages file
 *
 * @access public
 * @return void
 */
  fetch() {
    var package_url = Config.read('packages.url');

    fetch(package_url)
      .catch(err => console.error(err))
      .then(res => res.text())
      .then(text => {
        this._writeToPackages(text);
      });
  }


/**
 * Write packages file to temp directory
 *
 * @access public
 * @return void
 */
  _writeToPackages(data) {
    var filename = Config.path('package')+'/packages.json';

    fs.writeFile(filename, data, (err) => {
      if(err) {
        return console.error(err);
      }
      console.log('Package file updated');
      this.load();
    }); 
  }


/**
 * Reinstall a packages
 *
 * @param string name
 * @access public
 * @return void
 */
  reinstall(name) {
    this.remove(name);
    this.install(name);
  }


/**
 * Install a package
 *
 * @param string name
 * @access public
 * @return void
 */
  install(name) {
    if(!this.packages[name]) {
      return console.error(name+' does not exist');
    }

    //Check directory
    console.log('Installing '+name);

    let exec = require('child_process').exec, child;
    child = exec('npm install '+name, (error, stdout, stderr) => {
      if(error == null) {
        console.log('Successfully installed '+name);
        this.enable(name);
      }
      else {
        console.log('There was an error installing '+name);
      }
    });
  }


/**
 * Remove a module
 *
 * @param string name
 * @access public
 * @return void
 */
  remove(name) {
    console.log('Removing ' + name);
    
    this.disable(name);

    let exec = require('child_process').exec, child;
    child = exec('npm uninstall ' + name, (error, stdout, stderr) => {
      if (error == null) {
        console.log('Successfully removed ' + name);
      }
      else {
        console.log('There was an error removing '+name);
      }
    });
  }


/**
 * List available packages
 *
 * @access public
 * @return void
 */
  list() {    
    console.log('Packages:');

    for(var key in this.packages) {
      console.log(this.packages[key].name);
      console.log(this.packages[key].description);
      console.log('');
    }
  }


/**
 * Enable a package
 *
 * @param string name
 * @access public
 * @return void
 */
  enable(name) {
    console.log('Enabling', name);

    var paths = this._getModulePaths(name);
    
    if(!paths) {
      console.log('Failed to fetch any paths for '+name);
      return;
    }

    paths.forEach((result) => {
      this._link(result.type, result.name, result.path);
    });
  }


/**
 * Disable a package
 *
 * @param string name
 * @access public
 * @return void
 */
  disable(name) {
    console.log('Disabling', name);

    var paths = this._getModulePaths(name);

    if (!paths) {
      console.log('Failed to fetch any paths for ' + name);
      return;
    }

    paths.forEach((result) => {
      this._unlink(result.type, result.name);
    });
  }


/**
 * Fetch paths for a node module
 *
 * @param string name
 * @access private
 * @return array
 */
  _getModulePaths(name) {
    var path = Config.path('root') + '/node_modules/' + name;

    if (!fs.existsSync(path)) {
      console.log('Path for ' + name + ' does not exist');
      return false;
    }

    var paths = [];

    //Check for skill directory
    if (fs.existsSync(path + '/Skill')) {
      fs.readdirSync(path + '/Skill').forEach(dir_name => {

        paths.push({
          type: 'skills',
          name: dir_name,
          path: path + '/Skill/' + dir_name
        });
      })
    }

    return paths;
  }


/**
 * Link a package directory
 *
 * @param string type
 * @param string directory
 * @param string pathFrom
 * @access private
 * @return bool
 */
  _link(type, directory, pathFrom) {
    var pathTo = Config.path(type+'.app') + '/' + directory;
    fs.symlink(pathFrom, pathTo);
    return true;
  }


/**
 * Remove link to a package directory
 *
 * @param string type
 * @param string directory
 * @access private
 * @return bool
 */
  _unlink(type, directory) {
    var path = Config.path(type + '.app') + '/' + directory;

    let exec = require('child_process').exec, child;
    child = exec('unlink ' + path);
    return true;
  }



}