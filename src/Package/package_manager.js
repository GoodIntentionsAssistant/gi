/**
 * Package Manager
 */
const Config = require('../Core/config.js');
const fetch = require('node-fetch');
const git = require('simple-git');
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


  load() {
    var filename = Config.read('paths.package') + '/packages.json';

    var data = fs.readFileSync(filename, { encoding: 'utf-8' });
    var json = JSON.parse(data);

    if (!json || !json.packages) {
      return console.error('Data in packages.json could not be converted to JSON');
    }

    this.packages = json.packages;
  }


  stats() {
    console.log('Skills:', Object.keys(this.packages.skills).length);
  }


  write(data) {
    var filename = Config.read('paths.package')+'/packages.json';

    fs.writeFile(filename, data, (err) => {
      if(err) {
        return console.error(err);
      }
      console.log('Package file updated');
      this.load();
    }); 
  }


  fetch() {
    var package_url = Config.read('packages.url');
    
    fetch(package_url)
      .catch(err => console.error(err))
      .then(res => res.text())
      .then(text => {
        this.write(text);
      });
  }


  reinstall(type, name) {
    this.remove(type, name);
    this.install(type, name);
  }


  install(type, name) {
    var _type = type+'s'; //skill => skills
    var identifier = type + '::' + name;

    if(!this.packages[_type] || !this.packages[_type][name]) {
      return console.error(identifier+' does not exist');
    }

    //Check directory
    var path = Config.read('paths.' + _type + '.app') + '/' + name;
    if(fs.existsSync(path)) {
      return console.error('Skill directory '+name+' exists already');
    }

    var _package = this.packages[_type][name];
    console.log('Installing '+identifier);
    console.log(_package.repository.url);

    git()
      .clone(_package.repository.url, path)
      .exec(() => {
        console.log(name + ' package installed');
      });
  }


  remove(type, name) {
    var _type = type + 's';

    var path = Config.read('paths.' + _type + '.app') + '/' + name;
    if(!fs.existsSync(path)) {
      return console.error('Skill '+name+' directory not found');
    }

    fs.removeSync(path);

    console.log('Removed '+name+' package');
  }


  list() {    
    console.log('Skills:');

    for(var key in this.packages.skills) {
      console.log(this.packages.skills[key].name);
      console.log(this.packages.skills[key].description);
      console.log('');
    }

  }


}