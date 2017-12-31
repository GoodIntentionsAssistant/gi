/**
 * Scrubber
 */

/**
 * Brackets
 * 
 * Removes brackets, ( and )
 * 
 * @param string str
 * @return string
 */
exports.brackets = function(str) {
	return str.replace('(','').replace(')','');
}


/**
 * Token length
 * 
 * @param string str
 * @param int length
 * @return string
 */
exports.token_length = function(str, length) {
	if(!length) { length = 2; }
	var tokens = str.split(/\s+/);
	return tokens.filter(function(token){ return token.length > length}).join(' ');
}


/**
 * Lowercase
 * 
 * @param string str
 * @return string
 */
exports.lower = function(str) {
	return str.toLowerCase();
}


/**
 * To sentence case
 * 
 * @param string str
 * @return string
 */
exports.sentence_case = function(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}


/**
 * Stop words
 * 
 * Similar to mysql stop words. In most cases these are useless words which should be removed
 * 
 * @param string str
 * @return string
 */
exports.stop_words = function(str) {
	var stopwords = [
		' a ',
		' an ',
		' in ',
		' the ',
		' is ',
		' it ',
		' of ',
		' to ',
		' are ',
		' you$',
		'^how ',
		'^what '
	];
	for(var ii=0; ii<stopwords.length; ii++) {
		var regex = new RegExp(stopwords[ii], "gi");
		str = str.replace(regex,' ');
	}
	return str;
}


/**
 * Single letter
 * 
 * Might need tweaking but these have been found to be pretty useless
 * 
 * Starting with "t "
 * Ending with " t"
 * Middle with " t "
 * 
 * @param string str
 * @return string
 */
exports.single_letter = function(str) {
	var regex = new RegExp(/^[a-z] |[a-z] $| [a-z] |^[a-z]$/, "gi");
	str = str.replace(regex,' ');
	return str;
}


/**
 * Remove grammar
 * 
 * @param string str
 * @return string
 */
exports.grammar = function(str) {
	var stopwords = [
		',',
		'\\.',
		'\\!',
		'\\?'
	];
	for(var ii=0; ii<stopwords.length; ii++) {
		var regex = new RegExp(stopwords[ii], "gi");
		str = str.replace(regex,'');
	}
	return str;
}


/**
 * Contractions
 * 
 * Standardising contractions from what's to what is
 * 
 * @param string str
 * @return string
 */
exports.contractions = function(str) {
	var contractions = [
		["what's", "what is"],
		["i'm","i am"],
		["you're","you are"],
		["it's","it is"],
		["we're","we are"],
		["they're","they are"],
		["that's","that is"],
		["who's","who is"],
		["what's","what is"],
		["where's","where is"],
		["when's","when is"],
		["why's","why is"],
		["how's","how is"],
	];
	for(var ii=0; ii<contractions.length; ii++) {
		var regex = new RegExp(contractions[ii][0], "gi");
		str = str.replace(contractions[ii][0],contractions[ii][1]);
	}
	return str;
}