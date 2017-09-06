/**
 * Server
 * 
 * Initalise the framework and the apps to be loaded
 * All apps are found in the app/ directory
 */
const App = require('./src/Core/app');

MyApp = new App();

MyApp.load([
    'Common',
    'Fun',
    'Productivity',
    'Examples'
]);

