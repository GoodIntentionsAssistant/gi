global.girequire = (name) => {
	let path = __dirname + '/../..';

	//Standard module
	if(name.indexOf('/') === -1) {
		path = __dirname + '/../../node_modules';
	}

	return require(`${path}/${name}`);
};