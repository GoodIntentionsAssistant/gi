var DeviAPI_v1_0 = require('./DeviAPI_v1_0'),
    fs = require('fs');

/**
 * Returns a Devi API wrapper object in the specified version. The only API
 * version currently supported is 1.0 but as soon as other versions are available and
 * implemented you can specify the one you want in the options parameter.
 *
 * Available options are:
 *  - version   The API version to use, currently only '1.0' is supported.
 *              Defaults to '1.0'.
 *  - secure    Whether or not to use secure connections over HTTPS
 *              (true/false). Defaults to false.
 *  - userAgent Custom User-Agent description to use in the request header.
 *
 * @param subDomain Your Devi sub domain key to access Devi
 * @param apiKey The API key to access the Devi API with
 * @param options Configuration options as described above
 * @return Instance of the Devi API in the specified version
 */
function DeviAPI (subDomain, apiKey, options) {

	if (!options)
		var options = {};

	try {
		var packageInfo = fs.readFileSync(__dirname+"/../../package.json");
	} catch (error) {
		throw new Error('Required package file package.json not found for this module.');
	}
	options.packageInfo = JSON.parse(packageInfo.toString());

	if (!options.version || options.version == '1.0')
		return new DeviAPI_v1_0(subDomain, apiKey, options);
	else
		throw new Error('Version ' + options.version + ' of the Devi API is currently not supported.');

}

module.exports = DeviAPI;