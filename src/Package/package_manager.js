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
 * @constructor
 */
  constructor() {
    this.packages = {};
    this.load();
  }


/**
 * Load module
 *
 * @returns {boolean} Success of loading
 */
  load() {
    var packagesFile = Config.path('package') + '/packages.json';

    //Packages file does not exist
    //No need to error, the user might be trying to fetch packages
		if(!fs.existsSync(packagesFile)) {
      return false;
    }

    var data = fs.readFileSync(packagesFile, { encoding: 'utf-8' });
    var json = JSON.parse(data);

    if (!json || !json.packages) {
      console.error('Data in packages.json could not be converted to JSON');
      return false;
    }

    this.packages = json.packages;

    return true;
  }


/**
 * Fetch latest packages file
 *
 * @returns {boolean} Success
 */
  fetch() {
    var package_url = Config.read('packages.url');

    fetch(package_url)
      .catch((err) => console.error(err))
      .then((res) => res.text())
      .then((text) => {
        this._writeToPackages(text);
      });

    return true;
  }


/**
 * Write packages file to temp directory
 *
 * @param {string} data Data to write
 * @returns {boolean} Success of writing to file
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

    return true;
  }


/**
 * Reinstall a packages
 *
 * @param {string} name Name of package
 * @returns {boolean} Success of reinstalling
 */
  reinstall(name) {
    this.remove(name);
    return this.install(name);
  }


/**
 * Install a package
 *
 * @param {string} name Name of module
 * @param {Object} options Install options
 * @returns {boolean} Success of installing
 */
  install(name, options = {}) {
    //Installing a package from local for development
    if(options.dev) {
      this._install_from_dev(name);
      return;
    }

    if(!this.packages[name]) {
      return console.error(name+' does not exist');
    }

    //Check directory
    console.log('Installing '+name);

    let exec = require('child_process').exec, child;
    child = exec('npm install '+name, (error, stdout, stderr) => {
      if(error === null) {
        console.log('Successfully installed '+name);
        this.enable(name);
      }
      else {
        console.log('There was an error installing '+name);
        console.log(error);
      }
    });

    return true;
  }


/**
 * Install a package from dev
 *
 * @param {string} name Name of module to install
 * @returns {boolean} Installed successfully
 */
  _install_from_dev(name) {
    console.log('Installing dev version of ' + name);

    let pathDev = Config.path('dev_packages');
    let path = pathDev+'/'+name;

    if(!pathDev) {
      console.log('dev_packages path not defined');
      return false;
    }

    if(!fs.existsSync(path)) {
      console.log('Package directory does not exist ' + path);
      return false;
    }

    //Paths
    let paths = [];
    if (fs.existsSync(path + '/Skill')) {
      fs.readdirSync(path + '/Skill').forEach((dir_name) => {

        paths.push({
          type: 'skills',
          name: dir_name,
          path: path + '/Skill/' + dir_name
        });
      })
    }
    else {
      console.log('No skill paths ' + path);
      return false;
    }

    paths.forEach((result) => {
      var pathFrom = result.path;
      var pathTo = Config.path('app')+'/Skill/' + result.name;
      fs.symlink(pathFrom, pathTo, () => {});
    });

    return true;
  }


/**
 * Remove a module
 *
 * @param {string} name Name of module to remove
 * @returns {boolean} Successfully removed the module
 */
  remove(name) {
    console.log('Removing ' + name);
    
    this.disable(name);

    let exec = require('child_process').exec, child;
    child = exec('npm uninstall ' + name, (error, stdout, stderr) => {
      if (error === null) {
        console.log('Successfully removed ' + name);
        return true;
      }
      else {
        console.log('There was an error removing '+name);
        return false;
      }
    });
  }


/**
 * List available packages
 *
 * @returns {boolean} If packages could be outputted
 */
  list() {    
    console.log('Packages:');

    for(var key in this.packages) {
      console.log(this.packages[key].name);
      console.log(this.packages[key].description);
      console.log('');
    }

    return true;
  }


/**
 * Enable a package
 *
 * @param {string} name Name of package to disable
 * @returns {boolean} Success of disabling
 */
  enable(name) {
    console.log('Enabling', name);

    var paths = this._getModulePaths(name);
    
    if(!paths) {
      console.log('Failed to fetch any paths for '+name);
      return false;
    }

    paths.forEach((result) => {
      this._link(result.type, result.name, result.path);
      Config.put(result.type, 'App.'+result.name);
    });

    return true;
  }


/**
 * Disable a package
 *
 * @param {string} name Name of package to disable
 * @returns {boolean} Success of disabling
 */
  disable(name) {
    console.log('Disabling', name);

    var paths = this._getModulePaths(name);

    if (!paths) {
      console.log('Failed to fetch any paths for ' + name);
      return false;
    }

    paths.forEach((result) => {
      this._unlink(result.type, result.name);
      Config.remove(result.type + '.App.' + result.name);
    });

    return true;
  }


/**
 * Fetch paths for a node module
 *
 * @param {string} name Name of module
 * @returns {string[]} Path array
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
      fs.readdirSync(path + '/Skill').forEach((dir_name) => {
        paths.push({
          type: 'skills',
          name: dir_name,
          path: path + '/Skill/' + dir_name
        });
      });
    }

    return paths;
  }


/**
 * Link a package directory
 *
 * @param {string} type Type of package, e.g. Skill
 * @param {string} directory Directory
 * @param {string} pathFrom Where the file originally is
 * @returns {boolean} If linked directory successfully
 */
  _link(type, directory, pathFrom) {
    var pathTo = Config.path(type+'.app') + '/' + directory;
    fs.symlink(pathFrom, pathTo);
    return true;
  }


/**
 * Remove link to a package directory
 *
 * @param {string} type Type of package, e.g. Skill
 * @param {string} directory Directory
 * @returns {boolean} If linked directory successfully
 */
  _unlink(type, directory) {
    var path = Config.path(type + '.app') + '/' + directory;

    let exec = require('child_process').exec, child;
    child = exec('unlink ' + path);
    return true;
  }


}