/**
 * Scrubber
 */
const Replacer = girequire('src/Utterance/replacer');

const wordsToNumbers = require('words-to-numbers');


/**
 * Brackets
 * 
 * Removes brackets, ( and )
 *
 * @todo Move to frivolous
 * @param {string} str Incoming string
 * @returns {string} Result
 */
exports.brackets = function(str) {
	return str.replace('(','').replace(')','');
}


/**
 * Token length
 * 
 * Removes any tokens in a string which are more than the specified length
 * 
 * @param {string} str Incoming string
 * @param {number} length Maximum length of string
 * @returns {string} Result
 */
exports.token_length = function(str, length = 2) {
	let tokens = str.split(/\s+/);
	return tokens.filter((token) => { return token.length > length; }).join(' ');
}


/**
 * Lowercase
 * 
 * @param {string} str Incoming string
 * @returns {string} Result
 */
exports.lower = function(str) {
	return str.toLowerCase();
}


/**
 * To sentence case
 * 
 * @todo Make this better and replace it with a module
 * @param {string} str Incoming string
 * @returns {string} Result
 */
exports.sentence_case = function(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}


/**
 * Stop words
 * 
 * Similar to mysql stop words. In most cases these are useless words which should be removed
 * stopwords.json is used to define what should be removed.
 * 
 * @param {string} str Incoming string
 * @returns {string} Result
 */
exports.stop_words = function(str) {
	let replacer = new Replacer();
	let result = replacer.process('Remove', str);
	result = result.replace(/ +(?= )/g,'');
	return result;
}


/**
 * Word numbers to numbers
 * 
 * @param {string} str Incoming string
 * @returns {string} Result
 */
exports.octal = function(str) {
	//The word "a" gets replaced by the library so need to hack it a bit
	str = str.replace(/\ba\b/g, '{{aa}}');

	//One to 1
	str = wordsToNumbers.wordsToNumbers(str);

	//Force the result to be a string, if "thirty" was replaced with 30 JS changes it to an int
	str = String(str);

	//Set "a" back to normal
	str = str.replace('{{aa}}', 'a');

	return str;
}


/**
 * Remove grammar
 * 
 * @param {string} str Incoming string
 * @returns {string} Result
 */
exports.grammar = function(str) {
	var stopwords = [
		',',
		'\\.',
		'-',					
		//'[^0-9]\\.[^0-9]',				//"a.b" is removed, but "123.456" remains
		'\\!',
		'\\?'
	];
	for(var ii=0; ii<stopwords.length; ii++) {
		var regex = new RegExp(stopwords[ii], "gi");
		str = str.replace(regex,'');
	}
	str = str.replace(/ +(?= )/g,'');
	return str;
}


/**
 * Substitutes
 * 
 * @param {string} str Incoming string
 * @returns {string} Result
 */
exports.substitutes = function(str) {
	let replacer = new Replacer();
	let result = replacer.process('Substitutes', str);
	return result;
}


/**
 * Spelling
 * 
 * @param {string} str Incoming string
 * @returns {string} Result
 */
exports.spelling = function(str) {
	let replacer = new Replacer();
	let result = replacer.process('Spelling', str);
	return result;
}