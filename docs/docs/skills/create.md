---
layout: page
title: Create a Skill
---

Create a new directory in your `app/Skill/` directory using CamelCase format.

Typical directory structure.

~~~
/app
  /ExampleMenu
    /Entity
    /Data
    /Intent
    example_menu_skill.js
~~~

The skill file must match the directory name using lower case and underscore format.

## Skill file

~~~javascript
module.exports = class ExampleMenuSkill extends Skill {

	constructor(app) {
		super(app);
		this.intents = [];
	}

}
~~~

When the skill file is loaded all intents found in the `/Intent` directory are loaded in.

To control which intents are loaded change `this.intents` array. If the array is empty all intents are loaded.

For example if you had two files

~~~
/Intent
  order1_intent.js
  order2_intent.js
~~~

To just load the Order2 intent you would set the intents array to be...

~~~javascript
this.intents = ['Order2'];
~~~
