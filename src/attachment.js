/**
 * Attachment
 */
var Attachment = function() {
	this.request = null;
	this.attachments = {
		actions:[],
		images:[],
		shortcuts:[],
		fields:[],
		links:[],
		input: true
	};
}


/**
 * Initialize
 *
 * @param object response
 * @access public
 * @return void
 */
Attachment.prototype.initialize = function(request) {
	this.request = request;
}


/**
 * Add field
 *
 * @param array data
 * @param object object
 * @access public
 * @return void
 */
Attachment.prototype.add_field = function(data) {
	this.attachments.fields.push(data);
}


/**
 * Add action
 *
 * @param string text
 * @param object object
 * @access public
 * @return void
 */
Attachment.prototype.add_action = function(text, options) {
	var data = {
		text: text
	};
	this.attachments.actions.push(data);
}


/**
 * Add giphy
 *
 * @param string text
 * @access public
 * @return void
 */
Attachment.prototype.add_image = function(url) {
	var data = {
		url: url
	};
	this.attachments.images.push(data);
}


/**
 * Add link
 *
 * @param string text
 * @access public
 * @return void
 */
Attachment.prototype.add_link = function(url, text) {
	var data = {
		text: text,
		url: url
	};
	this.attachments.links.push(data);
}


/**
 * Add shortcut
 *
 * @param string text
 * @access public
 * @return void
 */
Attachment.prototype.add_shortcut = function(text) {
	var data = {
		text: text
	};
	this.attachments.shortcuts.push(data);
}


/**
 * Hide input
 *
 * @access public
 * @return void
 */
Attachment.prototype.hide_input = function() {
	this.input = false;
}



module.exports = Attachment;
