// Rock Paper Scissors
	
var Intent = require('../../../../src/Intent/intent');
var _ = require('underscore');

function RockPaperScissorsIntent() {
	var methods = {
		name: 'RockPaperScissors',
		trigger: 'play game',
		synonyms: [
			'rock paper scissors'
		],
		parameters: {
			"choice": {
				name: "Choice",
				data: {
					"rock":{},
					"paper":{},
					"scissors":{}
				}
			},
			"play_again": {
				name: "Play Again",
				entity: 'Common/Confirm'
			}
		}
	}
	methods.__proto__ = Intent()

	methods.response = function(request) {
		request.send('Rock, paper or scissors?');
		request.attachment.add_action('Rock');
		request.attachment.add_action('Paper');
		request.attachment.add_action('Scissors');
		request.expecting.set({
			action: 'chosen',
			force: true
		});
		return;
	}

	methods.chosen = function(request) {
		var user_choice = request.param('choice');

		if(!user_choice) {
			return 'You need to type either rock, paper or scissors';
		}

		var choices = ["rock","paper","scissors"];
		var app_choice = _.sample(choices);

		//Winner
		var winner = 'user';

		if(app_choice == 'rock' && user_choice == 'scissors') {
			winner = 'app';
		}
		else if(app_choice == 'paper' && user_choice == 'rock') {
			winner = 'app';
		}
		else if(app_choice == 'scissors' && user_choice == 'paper') {
			winner = 'app';
		}
		else if(app_choice == user_choice) {
			//Draw
			winner = 'draw';
		}

		//
		var output = [];
		output.push('I chose '+app_choice);

		//
		if(winner == 'app') {
			output.push('I win!');
		}
		else if(winner == 'user') {
			output.push('You win!');
		}
		else {
			output.push('Draw!');
		}

		output.push('Play again?');

		request.expecting.set({
			entity: 'Common/Confirm',
			action: 'play_again',
			force: false
		});
		request.attachment.add_action('Yes');
		request.attachment.add_action('No');

		return output;
	}


	methods.play_again = function(request) {
		var play_again = request.param('play_again');
		if(play_again == 'yes') {
			return request.redirect('Fun/RockPaperScissors');
		}
		return 'No problems!';
	}

	return methods
}


module.exports = RockPaperScissorsIntent;
