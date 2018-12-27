/**
 * Identifier
 */
const Config = require('../Config/config');


/**
 * To file
 */
exports.to_file = function(identifier) {
  let file = this.to_directory(identifier);
  file += '/';
  file += this.to_filename(identifier);
  return file;
}


/**
 * To directory
 */
exports.to_directory = function(identifier) {
  let parts = identifier.split('.');

  //Build path
  let path = '';
  path += Config.path('root');

  //Main directory, either Sys or App
  let area = parts[0];
  if(area == 'Sys') {
    path += '/src';
  }
  else if(area == 'App') {
    path += '/app'
  }

  //Sub directory depth
  let subdir_depth = parts.length-1;

  //Shortcut paths
  //App.Example.Entity.Colour -> App.Skill.Example.Entity.Colour
  if(['Entity','Intent','Data','Attachment'].indexOf(parts[2]) !== -1) {
    path += '/Skill';

    //App.Example.Intent
    //If there is no ending then trying to scan the Intent directory
    if(parts.length == 3) {
      subdir_depth++;
    }
  }

  //App.Example -> App.Skill.Example
  if(parts.length == 2) {
    path += '/Skill';
    subdir_depth++;
  }

  //Sub directories
  for(var ii=1; ii<subdir_depth; ii++) {
    path += '/'+parts[ii]; 
  }

  return path;
}


/**
 * To filename
 */
exports.to_filename = function(identifier) {
  let parts = identifier.split('.');

  let area  = parts[0];                 //App.
  let type  = parts[1];                 //Error.

  //Shortcut, App.Example -> App.Skill.Example, change type to skill
  if(parts.length == 2) {
    type = 'skill';
  }

  //App.Example.Entity.Colour -> Set the type to be Entity
  if(parts.length == 4) {
    type = parts[2];
  }

  //Build filename based on final part of the array
  let filename  = parts.slice(-1)[0];   //NoAuth
  filename = filename.replace(/([A-Z])/g, function(x){return "_"+x }).replace(/^_/, "");
  filename = filename.toLowerCase() + '_' + type.toLowerCase();

  return filename;
}


