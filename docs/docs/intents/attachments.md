---
layout: page
title: Intent Attachments
---

The response from the intent can hold additional meta data such as options, images and smaller detail. This can be useful when you're handling different types of clients who support different types of meta data. For example you could return two action attachments "Yes" and "No" which could be passed to Facebook to show two buttons with the message.

~~~javascript
request.attachment.add_action('Yes');
request.attachment.add_action('No');
~~~


Supported attachment types are currently:

* Actions - Used for options to show the user
* Images - Send image URL's to be displayed
* Fields - Additional small information, e.g. citation
* Links - A list of links
* Input - Possibility to hide the user input and only give them actions to choose from