---
layout: page
title: Redirecting
---

Redirecting from one intent to another is called by the `intent.redirect()` method.

The redirect must be returned within the intent method.

~~~javascript
module.exports = class BoingIntent extends Intent {

  setup() {
    this.train(['boing']);
  }

  response(request) {
    return request.redirect('App.Example.Intent.Ping');
  }

}
~~~