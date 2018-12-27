#!/usr/bin/env node

/**
 * Good intentions
 */
const App = require('./app/app.js');
const PackageManager = require('./src/Package/package_manager.js');

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
  .action(function () {
    GiPackage = new PackageManager();
    GiPackage.fetch();
  });

program
  .command('install <name>')
  .description('Install a package')
  .action(function(name) {
    GiPackage = new PackageManager();
    GiPackage.install(name);
  });

program
  .command('remove <name>')
  .description('Remove a package')
  .action(function(name) {
    GiPackage = new PackageManager();
    GiPackage.remove(name);
  });

program
  .command('reinstall <name>')
  .description('Reinstall a package')
  .action(function(name) {
    GiPackage = new PackageManager();
    GiPackage.reinstall(name);
  });

program
  .command('enable <name>')
  .description('Enable an installed package')
  .action(function (name) {
    GiPackage = new PackageManager();
    GiPackage.enable(name);
  });

program
  .command('disable <name>')
  .description('Disable an installed package')
  .action(function (name) {
    GiPackage = new PackageManager();
    GiPackage.disable(name);
  });

program
  .command('list')
  .description('List installed packages')
  .action(function() {
    GiPackage = new PackageManager();
    GiPackage.list();
  });


if(!process.argv.slice(2).length) {
  program.outputHelp();
}

program.parse(process.argv);

return;

