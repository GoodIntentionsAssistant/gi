---
layout: page
title: Contributing
---

We welcome contributions from developers to fix bugs, enhance existing features and creating new features for the chat bot. If you're just getting started check out the project [Github Issues](https://github.com/darrenmoore/GoodIntentionsChatBot/issues) for a list of improvements, bugs and wild ideas!

## Areas of interest

* Clients
* Example intents
* Skills
* Entities and data
* NLP improvements
* Database layer / ORM improvements
* Documentation
* Reporting issues


## How to Contribute

1. Fork the code from master
2. Create a branch (git checkout -b my-branch)
3. Commit your changes (git commit -m "My fix or feature")
4. Push to the origin branch (git push origin my-branch)
5. Create a new Pull Request


## Reporting Issues

Github Issues is used for managing bugs, improvements and future ideas.

For all improvements and feature requests that the following format is adheared to as often as possible for the description.

~~~
WHO
Optional
Who the issue is affecting or the target audience for the issue

WHY
Not required if it's a bug
Why the issue is required or why the target audience needs it

WHAT
Detailed information about the issue.
User stories and example dialog.
~~~

An example for creating a "Ping" Skill.

~~~
WHO
Onboarding new developers to the framework

WHY
There is a learning curve for GI so providing a simple example skill with an intent is useful

WHAT
As a new developer who downloads GI I want to learn how to build my first skill.
As a reference I go into my app skills directory and can see the "Ping" skill.
I then copy this directory, rename the skill, filenames and can make my own skill with an intent quickly
~~~