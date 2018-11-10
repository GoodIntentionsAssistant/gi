#!/usr/bin/env node

/**
 * Good intentions
 */
const App = require('./app/app.js');
const Package = require('./src/Package/package.js');

var program = require('commander');

program
  .command('serve', '', { isDefault: true })
  .description('Load the GI Server')
  .action(function() {
    GiApp = new App();
    GiApp.load();
  });

program
  .command('fetch')
  .description('Fetch packages')
  .action(function (name) {
    GiPackage = new Package();
    GiPackage.fetch();
  });

program
  .command('install <name>')
  .description('Install a package')
  .action(function(name) {
    GiPackage = new Package();
    GiPackage.install(name);
  });

program
  .command('remove <name>')
  .description('Remove a package')
  .action(function(name) {
    GiPackage = new Package();
    GiPackage.remove(name);
  });

program
  .command('list')
  .description('List installed packages')
  .action(function() {
    GiPackage = new Package();
    GiPackage.list();
  });


if(!process.argv.slice(2).length) {
  program.outputHelp();
}

program.parse(process.argv);

return;

