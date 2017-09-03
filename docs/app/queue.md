---
layout: page
title: App Queue
---

Each request is added to the queue and a loop in the app will process it.

The queue speed is based on the `config.app.loop_speed` configuration setting.

Each request is stored and only max_consecutive requests can be made at one time. When testing it's a good idea to have max_consecutive set to 1 so it will do one request at a time.

The queueing also acts as basic flood protection. If a user is malicious they may try to send hundreds of lines to the bot, or they may copy and paste hundreds of lines by mistake into a client.