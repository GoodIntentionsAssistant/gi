//For testing
//https://www.npmjs.com/package/socket.io-client
var prompt = require('prompt');
prompt.start();
prompt.message = "";

var io = require('socket.io-client');
var socket = io.connect('http://localhost:3000', {
	reconnect: true
});

socket.on('connect', function(){
	console.log('Connected to server');

	ident();

	send('hey');
});



socket.on('event', function(data){
	console.log(data);
});

socket.on('request_result', function(data){
	if(data.type == 'message') {

		for(var ii=0; ii<data.messages.length; ii++) {
			console.log('\033[31m','Devi: ',data.messages[ii],'\033[0m');
		}

		if(data.attachments.actions) {
			var actions = data.attachments.actions;
			var output = []; 
			for(var ii=0; ii<actions.length; ii++) {
				output.push(actions[ii].text);
			}
			console.log('\x1b[34m','Options: ',output.join(', '),'\033[0m');
		}

		if(data.attachments.images) {
			var images = data.attachments.images;
			var output = []; 
			for(var ii=0; ii<images.length; ii++) {
				console.log('\x1b[34m','Image: ',images[ii].url,'\033[0m');
			}
		}

		if(data.attachments.shortcuts) {
			var shortcuts = data.attachments.shortcuts;
			var output = []; 
			for(var ii=0; ii<shortcuts.length; ii++) {
				console.log('\x1b[34m','Shortcut: ',shortcuts[ii].text,'\033[0m');
			}
		}

		if(data.attachments.links) {
			var links = data.attachments.links;
			var output = []; 
			for(var ii=0; ii<links.length; ii++) {
				console.log('\x1b[34m','Link: ',links[ii].text, links[ii].url,'\033[0m');
			}
		}

		if(data.attachments.fields) {
			var fields = data.attachments.fields;
			var output = []; 
			for(var ii=0; ii<fields.length; ii++) {
				console.log('\x1b[34m','Field: ',fields[ii].title,fields[ii].value,'\033[0m');
			}
		}

	}
	else if(data.type == 'start') {
		console.log('\033[31m','Devi: start\033[0m');
	}
	else if(data.type == 'end') {
		console.log('\033[31m','Devi: end\033[0m');
	}

});

socket.on('disconnect', function(){
	console.log('Disconnect');
});


prompt_me();

//------------------------------------


function prompt_me() {
	var schema = {
		properties: {
			input: {
				message: ' ',
				required: true
			}
		}
	};
	prompt.get(schema, function (err, result) {
		send(result.input, true);
		prompt_me();
	});
}


function ident() {
	socket.emit('identify',{
		agent: 'test',
		token: 'NrCgyKqvyB'
	});
}


function send(input, hide) {
	if(!hide) {
		console.log('> '+input);
	}
	var input = {
		agent: 'test',
		token: 'NrCgyKqvyB',
		text: input,
		type: 'message',
		event: 'direct_message'
	};
	socket.emit('request',input);
}