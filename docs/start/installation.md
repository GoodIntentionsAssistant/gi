---
layout: page
title: Installation
---

GI uses NodeJS 8.x and the code has only been tested on Linux Mint. Install node.js from https://nodejs.org. It is also recommended to use nvm (node version manager) to manage your node.js versions.



## How to Run

Run the server which will listen to a port specified in your config file. This will then be ready for client connections. You cannot interact with the server directly.

~~~
node server.js
~~~

After the server has successfully loaded run the client terminal in a different terminal console. The client will connect to the server and give you an interface to interact to the app. Never use the terminal client for production, it should only be used for debugging.

~~~
cd clients
node terminal.js
~~~