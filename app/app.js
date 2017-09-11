/**
 * App
 */
const GoodIntentions = require('../src/Core/app.js');

module.exports = class App extends GoodIntentions {

	setup() {
    //Main app loop
    this.on('app.loop', () => {
    });

    //Client connected
    this.on('client.connected', (client) => {
    });
  }

}