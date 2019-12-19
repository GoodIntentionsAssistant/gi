/**
 * Classify.js
 *
 * Javascript library for automated classification using Bayesian probability.
 *
 * Good Intentions Note
 * I'm not sure where this code is originally from so I can't credit it.
 * If you are the original creator of this please get in touch.
 *
 * Some logic and formatting changes have been made to this code.
 *
 */
const _ = require('underscore');
const fs = require('fs');

// Probability to assign to words that do not appear in a group. We cannot use
// zero because the log(0) is negative infinity.
const ZERO_PROBABILITY = 0.00000001;


// Storage for the input parameters for the model
var Classifier = function() {
  this.reset();
}


Classifier.prototype.reset = function() {
 this.numTrainingExamples = 0;
 this.groupFrequencyCount = new Object();

 this.numWords = 0;
 this.wordFrequencyCount = new Object();
 this.groupWordTotal = new Object();
 this.groupWordFrequencyCount = new Object();

  //All words are kept in the store so it can be reindexed
  this.storage = [];
}


/**
 * Trains the classifier with a known example.
 *
 * @param input An input value with a known classification
 * @param group The group the input should be classified as belonging to
 * @returns none
 */
Classifier.prototype.train = function(group, input)
{
  var self = this;

  //Push to storage
  //@todo With big data sets this is not efficient because we're duplicating the data stored
  //@todo FIgure out how to use the existing data
  this.storage.push([group, input]);

  self.numTrainingExamples += 1;

  incrementOrCreate(self.groupFrequencyCount, group);

  // We only want to see words once per training example
  var seenWord = new Object();

  // For each word in the input, increment all the counters
  input.split(" ").forEach(function(word) {
    // Clean non-alphanumeric characters from the input
    var cleanWord = scrubWord(word);

    if(!seenWord[cleanWord])
    {
      self.numWords += 1;

      incrementOrCreate(self.wordFrequencyCount, cleanWord);
      incrementOrCreate(self.groupWordTotal, group);
      incrementOrCreateGroup(self.groupWordFrequencyCount, group, cleanWord);

      seenWord[cleanWord] = true;
    }
	});
}


/**
 * Untrain by group
 *
 * @param string group
 * @return void
 */
Classifier.prototype.untrain = function(group) {
  let _storage = this.storage;

  this.reset();

  for(let ii=0; ii < _storage.length; ii++) {
    let _group = _storage[ii][0];
    let _input = _storage[ii][1];

    //Remove the group requested
    if(group === _group) {
      continue;
    }

    this.train(_group, _input);
  }
}


/**
 * Trains the classifier with a known example from the given file.
 *
 * @param filename A file with a known classification
 * @param group The group the input should be classified as belonging to
 * @returns none
 */
Classifier.prototype.trainFromFile = function(group, filename)
{
  var self = this;

  self.train(group, fs.readFileSync(filename, "utf-8"));
}


/**
 * Provides the most likely group classification for an input.
 *
 * @param input An input value with unknown classification
 * @returns The group the input is most likely a member of
 */
Classifier.prototype.classify = function(input)
{
  var rank = this.rank(input);

	var topRanked = rank.groups[0]; // just take the top ranked group

	if(topRanked && rank.certainty > 0.2) {
    return topRanked.group;
  }

	return false;
}


/**
 * Provides the most likely group classification for a file.
 *
 * @param filename The path to a file with unknown classification
 * @returns The group the input is most likely a member of
 */
Classifier.prototype.classifyFile = function(filename)
{
  // Use synchronous IO here since, honestly, we can't do anything else
  // until we read the file anyway.
  return this.classify(fs.readFileSync(filename, "utf-8"));
}


/**
 * Provides all possible groups for an input in ranked order of probability of matching.
 *
 * @param input An input value with unknown classification
 * @returns An array of groups and the probability the input belongs to one of them.
 */
Classifier.prototype.rank = function(input, remove_unranked = false)
{
  var self = this;

	var groups = Object.keys(self.groupFrequencyCount);
	var groupProb = self.getGroupProbabilities();

	var groupLikelihood = new Array();
	var counter = 0;
	groups.forEach(function(group) {
		groupLikelihood[counter] = new Object();
		groupLikelihood[counter].group = group;
    groupLikelihood[counter].matched = 0;

    // Start with the overall probability of this group
    groupLikelihood[counter].probability = Math.log(groupProb[group]);

    // Note that we use logs of probability so we can add them later. Multiplying the
    // floating point values together will result in the values getting too small to track.

		counter++;
	});

  var words = input.split(" ");

	for(var j = 0; j < words.length; j++)
  {
    var cleanWord = scrubWord(words[j]);

		for(var i = 0; i < groupLikelihood.length; i++)
		{
      var matched = false;
			var group = groupLikelihood[i].group;
      var groupWordFreqCount = self.groupWordFrequencyCount[group];

      //console.log('** '+cleanWord+' == '+groupWordFreqCount[cleanWord]);

      //Add to the freqency of occurrence of this word in this group.
			if(groupWordFreqCount[cleanWord]) {
				var individualProb = groupWordFreqCount[cleanWord]/self.groupFrequencyCount[group];
        var logProb = Math.log(individualProb);

        groupLikelihood[i].probability += logProb;
        matched = true;
			}

      //We have to penalize entires that don't have this word, but we can't use the log(0)
      if(!matched) {
        groupLikelihood[i].probability += Math.log(ZERO_PROBABILITY);
      }
      else {
        //Increase number of matched words
        groupLikelihood[i].matched++;
      }


		}
	}

  groupLikelihood.sort(function(a,b){return b.probability - a.probability});


  //Remove anything without a match
  //Added for GI.
  if(remove_unranked) {
    groupLikelihood = _.reject(groupLikelihood, function(data){
      return data.matched === 0 ? true : false;
    });
  }
  

  //Check the certainty of the match
  var certainty = 1;

  if(groupLikelihood.length > 1) {
    certainty = 0;
    groupLikelihood.forEach(function (data) {
      certainty += data.probability;
    });
    certainty = (certainty / groupLikelihood.length) - groupLikelihood[0].probability;
    certainty *= -1;
  }

	return {
    certainty: certainty,
    groups: groupLikelihood
  };
}


/**
 * Returns all training groups and their associated probabilities (simple frequencies).
 *
 * @returns An object with properties names for the input groups whose values are the probability of that group.
 */
Classifier.prototype.getGroupProbabilities = function()
{
  var self = this;

	var groups = new Object();

	// get group probabilities
	Object.keys(self.groupFrequencyCount).forEach(function(group) {
		//groups[group] = self.groupFrequencyCount[group] / self.numTrainingExamples;

    //DM: Set zero proability across the board because i don't know why a group
    //would get more probability just based on how many words its been trained
    groups[group] = ZERO_PROBABILITY;
	});

	return groups;
}


/**
 * Returns number of unique groups seen in the training data.
 */
Classifier.prototype.getNumGroups = function()
{
	return Object.keys(this.groupFrequencyCount).length;
}

/**
 * Looks for a field with the given value in the object and if found increments it. Otherwise, creates it with a value of 1.
 */
function incrementOrCreate(object, value)
{
	if(object[value]) {
    object[value] += 1;
  }
	else {
    object[value] = 1;
  }
}

/**
 * Looks for a field with the given group and value in the object and if found increments it. Otherwise, creates it with a value of 1.
 */
function incrementOrCreateGroup(object, group, value)
{
  if(!object[group]) {
    object[group] = new Object();
  }

  var myGroup = object[group];

  if(myGroup[value]) {
    myGroup[value] += 1;
  }
  else {
    myGroup[value] = 1;
  }
}

function scrubWord(word)
{
  //return word.replace(/\W/g, '');
  return word;
}

module.exports = Classifier;