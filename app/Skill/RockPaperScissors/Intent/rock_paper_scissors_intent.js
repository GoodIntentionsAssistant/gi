/**
 * Rock Paper Scissors Intent
 */
const Intent = require('../../../../src/Intent/intent');
var _ = require('underscore');

module.exports = class RockPaperScissorsIntent extends Intent {

	setup() {
		this.name = 'RockPaperScissors';
		this.trigger = 'play game';
		this.synonyms = [
			'rock paper scissors'
		];
		this.parameters = {
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
				entity: 'App.Common.Entity.Confirm'
			}
		};
	}

	response(request) {
		request.send('Rock, paper or scissors?');
		this._set_required(request);
		return;
	}

	_set_required(request) {
		request.attachment.add_action('Rock');
		request.attachment.add_action('Paper');
		request.attachment.add_action('Scissors');
		request.expecting.set({
			action: 'chosen',
			force: true
		});
	}

	chosen(request) {
		var user_choice = request.parameters.value('choice');

		if(!user_choice) {
			this._set_required(request);
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
			entity: 'App.Common.Entity.Confirm',
			action: 'play_again',
			force: false
		});
		request.attachment.add_action('Yes');
		request.attachment.add_action('No');

		return output;
	}


	play_again(request) {
		var play_again = request.parameters.value('play_again');
		if(play_again == 'yes') {
			return request.redirect('App.RockPaperScissors.Intent.RockPaperScissors');
		}
		return 'No problems!';
	}

}


