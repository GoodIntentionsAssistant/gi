/**
 * Server
 * 
 * Initalise the framework and the apps to be loaded
 * All apps are found in the app/ directory
 */
const App = require('./src/Core/app');

GiApp = new App();
GiApp.load();

