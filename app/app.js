/**
 * App
 */
const GoodIntentions = require('../src/Core/app.js');

module.exports = class App extends GoodIntentions {

	setup() {
    //Main app loop
    this.on('app.loop', () => {
    });

    //Client identified
    this.on('client.identified', (client) => {
    });

    //New auth
    this.on('auth.new', (Client) => {
      console.log('new client');
      // this.request(Client, {
      //   text: 'hello',
      //   user: 'good-intentions-user'
      // });
    });
  }

}