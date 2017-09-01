/**
 * Server
 * 
 * Initalise the framework and the apps to be loaded
 * All apps are found in the app/ directory
 */
const App = require('./src/app');

MyApp = new App();

MyApp.load([
    'Common',
    'Admin',
    'Fun',
    'Productivity',
    'Examples'
]);

