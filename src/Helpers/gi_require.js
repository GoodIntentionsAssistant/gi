
/**
 * Gi require
 * 
 * Require abstraction making it easier to load in other modules
 * without having to define exactly the right path.
 * 
 * This abstraction is also needed for app skills because the skills might
 * be symbolically linked from either node_modules or a test directory.
 * 
 * https://gist.github.com/branneman/8048520
 * 
 * @param {string} name Name to includ
 * @returns {Object} Module
 */
global.girequire = (name) => {
	let path = __dirname + '/../..';

	//Standard module
	if(name.indexOf('/') === -1) {
		path = __dirname + '/../../node_modules';
	}

	return require(`${path}/${name}`);
};