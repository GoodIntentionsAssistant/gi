// Emotion
	
var Entity = require('../../../../src/Entity/entity');

//http://www.psychpage.com/learning/library/assess/feelings.html

function EmotionEntity() {
	var entity = {
		name: "Emotion",
		data: {
			'happy': {
				type: 'positive',
				synonyms:['great','delighted','overjoyed','thankful','cheerful','merry']
			},
			'alive': {
				type: 'positive',
				synonyms:['playful','courageous','energetic','liberated','optimistic','provocative','impulsive','free','thrilled','wonderful']
			},
			'good': {
				type: 'positive',
				synonyms:['calm','peaceful','comfortable','pleased','content','relaxed','free and easy']
			},
			'love': {
				type: 'positive',
				synonyms:['loving','considerate','affectionate','passionate','warm','touched','loved']
			},
			'interested': {
				type: 'positive',
				synonyms:['fascinated','intrigued','inquisitive','curious']
			},
			'positive': {
				type: 'positive',
				synonyms:['keen','earnest','inspired','determined','excited','enthusiastic','brave','daring','optimistic','confident','hopeful']
			},
			'indifferent': {
				type: 'negative',
				synonyms:["insensitive","dull","nonchalant","neutral","reserved","weary","bored","preoccupied","cold","disinterested",
"lifeless"]
			},
			'afraid': {
				type: 'negative',
				synonyms:["fearful","terrified","suspicious","anxious","alarmed","panic","nervous","scared","worried","frightened","timid","shaky","restless","doubtful","threatened","cowardly","quaking","menaced",
"wary"]
			},
			'hurt': {
				type: 'negative',
				synonyms:["crushed","tormented","deprived","pained","tortured","dejected","rejected","injured","offended","afflicted","aching","victimized","heartbroken","agonized","appalled","humiliated","wronged",
"alienated"]
			},
			'sad': {
				type: 'negative',
				synonyms:["tearful","sorrowful","pained","grief","anguish","desolate","desperate","pessimistic","unhappy","lonely","grieved","mournful",
"dismayed"]
			},
			'angry': {
				type: 'negative',
				synonyms:["irritated","enraged","hostile","insulting","sore","annoyed","upset","hateful","unpleasant","offensive","bitter","aggressive","resentful","inflamed","provoked","incensed","infuriated","cross","worked up","boiling","fuming",
"indignant"]
			},
			'depressed': {
				type: 'negative',
				synonyms:["lousy","disappointed","discouraged","ashamed","powerless","diminished","guilty","dissatisfied","miserable","detestable","repugnant","despicable","disgusting","abominable","terrible","in despair","sulky",
"bad"]
			},
			'confused': {
				type: 'negative',
				synonyms:["upset","doubtful","uncertain","indecisive","perplexed","embarrassed","hesitant","shy","stupefied","disillusioned","unbelieving","skeptical","distrustful","misgiving","lost","unsure","uneasy","pessimistic",
"tense"]
			},
			'helpless': {
				type: 'negative',
				synonyms:["incapable","alone","paralyzed","fatigued","useless","inferior","vulnerable","empty","forced","hesitant","despair","frustrated","distressed","woeful","pathetic","tragic",
"dominated"]
			}
		}
	}
	entity.__proto__ = Entity()

	entity.parse = function(string) {
		var result = this.find(string);

		return result;
	}

	return entity
}

module.exports = EmotionEntity;
