/**
 * Attachment
 */

module.exports = class Attachment {

/**
 * Constructor
 *
 * @param object response
 * @access public
 * @return void
 */
	constructor(request) {
		this.request = request;
		this.attachments = {
			actions:[],
			images:[],
			shortcuts:[],
			fields:[],
			links:[],
			input: true
		};

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
	add_field(data) {
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
	add_action(text, options) {
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
	add_image(url) {
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
	add_link(url, text) {
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
	add_shortcut(text) {
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
	hide_input() {
		this.input = false;
	}

}

