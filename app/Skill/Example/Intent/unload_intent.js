/**
 * Unload Intent
 */
const Intent = require('../../../../src/Intent/intent');

module.exports = class UnloadIntent extends Intent {

	setup() {
		this.train([
      'unload ping',
      'load ping'
    ], {
      collection: 'strict'
    });    

    this.parameter('method', {
      data: ['load', 'unload']
    });
	}


  response(request) {
    let method = request.parameters.value('method');

    if(method == 'load') {
      return this._load();
    }
    else {
      return this._unload();
    }
  }


  _load() {
    let result = this.app.IntentRegistry.load('App.Example.Intent.Ping');
    if(!result) {
      return 'Could not load Ping, maybe it is already loaded?';
    }
    return  'Ping loaded';
  }

  _unload() {
    let result = this.app.IntentRegistry.unload('App.Example.Intent.Ping');
    if(!result) {
      return 'Failed to unload Ping, maybe you have unloaded it already?';
    }
    return 'Ping has now been unloaded';
  }

}

