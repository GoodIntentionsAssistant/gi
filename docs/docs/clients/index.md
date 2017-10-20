---
layout: page
title: Clients
---

Clients act as middleware between the server and the service it will connect to.

Clients could include interfaces to Facebook, Line, Hipchat, Slack, IRC and any other type of chat interface. These clients must be written by a developer to make GI useful. We hope to provide packaged clients with GI after the first stable release.


## CLI Test Client

GI provides a CLI test client found in `clients/cli.js`.

Load the server and then load the client. The client will identify with the server with the client token (stored in your config.js file) and the server will generate a session_token for all requests. You can then type in any command to test the app.


