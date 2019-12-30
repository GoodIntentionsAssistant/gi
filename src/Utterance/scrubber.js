/**
 * Scrubber
 */
const Replacer = girequire('src/Utterance/replacer');

const fs = require('fs');
const wordsToNumbers = require('words-to-numbers');


/**
 * Brackets
 * 
 * Removes brackets, ( and )
 *
 * @todo Move to frivolous
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
	return tokens.filter(function(token){ return token.length > length; }).join(' ');
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
 * stopwords.json is used to define what should be removed.
 * 
 * @param string str
 * @return string
 */
exports.stop_words = function(str) {
	let replacer = new Replacer();
	let result = replacer.process('Remove', str);
	return result;
}


/**
 * Word numbers to numbers
 * 
 * @param string str
 * @return string
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
 * Single letter
 * 
 * Might need tweaking but these have been found to be pretty useless
 * 
 * Starting with "t "
 * Ending with " t"
 * Middle with " t "
 * 
 * @todo Move to frivolous
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
		'[^0-9]\\.[^0-9]',				//"a.b" is removed, but "123.456" remains
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
 * Substitutes
 * 
 * @param string str
 * @return string
 */
exports.substitutes = function (str) {
	let replacer = new Replacer();
	let result = replacer.process('Substitutes', str);
	return result;
}


/**
 * Spelling
 * 
 * @param string str
 * @return string
 */
exports.spelling = function (str) {
	let replacer = new Replacer();
	let result = replacer.process('Spelling', str);
	return result;
}