/**
 * Documentation Example
 */
const Intent = require('../../../../src/Intent/intent');

module.exports = class DocumentationIntent extends Intent {

	setup() {
		this.train([
			'@App.Example.Entity.Documentation',
			new RegExp(/^go to/,'g')
		]);

		this.parameter('page', {
			name: "Page",
			entity: "App.Example.Entity.Documentation"
		});
	}

	response(request) {
		if(!request.parameters.has('page')) {
			return 'I\'m not sure of that page in the documentation';
		}

		let label = request.parameters.get('page.data.label');
		let url = request.parameters.get('page.data.url');

		request.attachment('navigation', {
			name: label,
			url: url
		});

		return 'Taking you to '+label;
	}

}

