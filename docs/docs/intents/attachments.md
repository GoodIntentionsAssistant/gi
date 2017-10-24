---
layout: page
title: Intent Attachments
---

The response from the intent can hold additional meta data such as options, images and smaller detail making messages more interactive.

For example you could return two action attachments "Yes" and "No" which could be passed to Facebook to show two buttons with the message.

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


## Client support

The clients must support these attachment types to send to the end platform. Each platform handle these attachments differently and can have restrictions. For example Facebook support actions and buttons but have a limit of three buttons in total.

GI's attachments were loosely based on the [Slack API](https://api.slack.com/docs/message-attachments).


## Future development

Attachments are used for meta data and has a strong interest in chat / virtual assistants for such things as handling payments and interacting with IoT devices.

We plan to expand GI into handling more types of attachments dynamically.


## Actions

Used for showing buttons to a user.

~~~javascript
request.attachment.add_action('Yes');
request.attachment.add_action('No');
~~~

<div class="chat" markdown="0">
  <div class="user"><span>Hello</span></div>
  <div class="bot"><span>Do you like sport?</span></div>
  <div class="attachment attachment-buttons">
    <span>Yes</span>
    <span>No</span>
  </div>
</div>

After one of these buttons is pressed it will send the text back to the GI client, for example "yes".

But without using `expecting` and a `parameter` the next input of "yes" or "no" won't be recognised.


## Example

This example uses attachment of buttons, parameters to fetch the confirmation and expecting to wait for the reply.

The Apptem Confirm entity has a small dictionary of common confirmations for yes and no.

~~~javascript
module.exports = class AskMeAgainIntent extends Intent {

  setup() {
    this.train(['ask me again'], { classifier:'strict' });

    this.parameter('ask_again', {
      name: 'Ask again',
      entity: 'App.Common.Entity.Confirm'
    });
  }

  response(request) {
    request.attachment.add_action('Yes');
    request.attachment.add_action('No');

    request.expecting.set({
      action: 'chosen',
      force: true
    });

    return 'Ask me again?';
  }

  chosen(request) {
    var choice = request.parameters.value('ask_again');
    if(choice == 'yes') {
      return request.redirect('App.Example.Intent.AskMeAgain');
    }
    return 'OK that is enough';
  }

}
~~~


<div class="chat" markdown="0">
  <div class="user"><span>Ask me again</span></div>
  <div class="attachment attachment-buttons">
    <span>Yes</span>
    <span>No</span>
  </div>
  <div class="user"><span>Yes</span></div>
  <div class="attachment attachment-buttons">
    <span>Yes</span>
    <span>No</span>
  </div>
  <div class="user"><span>Yup!</span></div>
  <div class="attachment attachment-buttons">
    <span>Yes</span>
    <span>No</span>
  </div>
  <div class="user"><span>No</span></div>
  <div class="bot"><span>OK that is enough</span></div>
</div>


## Images

Used for showing buttons to a user.

~~~javascript
request.attachment.add_image('https://picsum.photos/300/300/?random');
~~~

<div class="chat" markdown="0">
  <div class="user"><span>Hello</span></div>
  <div class="bot"><span><img src="https://picsum.photos/300/300/?random"></span></div>
</div>