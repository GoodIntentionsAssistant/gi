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
 * @return void
 */
  constructor() {
    this.packages = {};
    this.load();
  }


/**
 * Load module
 *
 * @return void
 */
  load() {
    var packagesFile = Config.path('package') + '/packages.json';

    //Packages file does not exist
    //No need to error, the user might be trying to fetch packages
		if(!fs.existsSync(packagesFile)) {
      return;
    }

    var data = fs.readFileSync(packagesFile, { encoding: 'utf-8' });
    var json = JSON.parse(data);

    if (!json || !json.packages) {
      return console.error('Data in packages.json could not be converted to JSON');
    }

    this.packages = json.packages;
  }


/**
 * Fetch latest packages file
 *
 * @return void
 */
  fetch() {
    var package_url = Config.read('packages.url');

    fetch(package_url)
      .catch((err) => console.error(err))
      .then((res) => res.text())
      .then((text) => {
        this._writeToPackages(text);
      });
  }


/**
 * Write packages file to temp directory
 *
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
 * @return void
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
  }


/**
 * Install a package from dev
 *
 * @param string name
 * @return void
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
      fs.readdirSync(path + '/Skill').forEach(dir_name => {

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

    return;
  }


/**
 * Remove a module
 *
 * @param string name
 * @return void
 */
  remove(name) {
    console.log('Removing ' + name);
    
    this.disable(name);

    let exec = require('child_process').exec, child;
    child = exec('npm uninstall ' + name, (error, stdout, stderr) => {
      if (error === null) {
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
      Config.put(result.type, 'App.'+result.name);
    });
  }


/**
 * Disable a package
 *
 * @param string name
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
      Config.remove(result.type + '.App.' + result.name);
    });
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