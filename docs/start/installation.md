---
layout: page
title: Installation
---

GI uses NodeJS 8.x and the code has only been tested on Linux Mint. Install node.js from https://nodejs.org. It is also recommended to use nvm (node version manager) to manage your node.js versions.

It is recommended that GI is downloaded as a package directly from Github and not via NPM for now. Once GI is stable it will be available to download as a standard node package with setup scripts and a different installation guide.


## How to Run

Run the server which will listen to a port specified in your config file. This will then be ready for client connections. You cannot interact with the server directly but it will verbose information.

~~~
npm install
node server.js
~~~

After the server has successfully loaded run the CLI test script in a different terminal console. The client will connect to the server and give you an interface to interact to the app. Never use the terminal client for production, it should only be used for debugging.

~~~
cd clients
node cli.js
~~~


## Test CLI Client

The test CLI client is located in the `clients/` directory. This test client is not designed for production and must only be used for locally testing the server.

If the CLI client returns errors about invalid tokens check the client configuration settings in `app/Config/config.js` match up with the configuration settings in `clients/cli.js` file.
