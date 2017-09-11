/**
 * Terminal test client for GI
 */
const prompt = require('prompt');
const io = require('socket.io-client');
const socket = io.connect('http://localhost:3000', {
	reconnect: true
});

var session_token;

prompt.message = "";
prompt_me();
prompt.start();


function ready() {
	//send('roll dice');
	send('6+6');
}



socket.on('connect', function(){
	console.log('\x1b[32m','Connected to server','\x1b[0m');
	ident();
});

socket.on('disconnect', function(){
	console.log('\x1b[32m','Disconnected','\x1b[0m');
});



socket.on('event', function(data){
	if(data.type == 'error') {
		console.log('\033[31m','Error:', data.message,'\033[0m');
	}
	else if(data.type == 'request' && !data.success) {
		console.log('\033[31m','Error:', data.message,'\033[0m');
	}
	else if(data.type == 'identify' && data.success) {
		console.log('\x1b[32m',data.message,'\x1b[0m');
		session_token = data.session_token;
		ready();
	}
});


socket.on('response', function(data){
	if(data.type == 'message') {

		for(var ii=0; ii<data.messages.length; ii++) {
			console.log('\x1b[36m',data.messages[ii],'\x1b[0m');
		}

		if(data.attachments.actions) {
			var actions = data.attachments.actions;
			var output = []; 
			for(var ii=0; ii<actions.length; ii++) {
				output.push(actions[ii].text);
			}
			console.log('\x1b[35m','Options: ',output.join(', '),'\x1b[0m');
		}

		if(data.attachments.images) {
			var images = data.attachments.images;
			var output = []; 
			for(var ii=0; ii<images.length; ii++) {
				console.log('\x1b[35m','Image: ',images[ii].url,'\x1b[0m');
			}
		}

		if(data.attachments.shortcuts) {
			var shortcuts = data.attachments.shortcuts;
			var output = []; 
			for(var ii=0; ii<shortcuts.length; ii++) {
				console.log('\x1b[35m','Shortcut: ',shortcuts[ii].text,'\x1b[0m');
			}
		}

		if(data.attachments.links) {
			var links = data.attachments.links;
			var output = []; 
			for(var ii=0; ii<links.length; ii++) {
				console.log('\x1b[35m','Link: ',links[ii].text, links[ii].url,'\x1b[0m');
			}
		}

		if(data.attachments.fields) {
			var fields = data.attachments.fields;
			var output = []; 
			for(var ii=0; ii<fields.length; ii++) {
				console.log('\x1b[34m','Field: ',fields[ii].title,fields[ii].value,'\x1b[0m');
			}
		}

		//Debug information
		console.log(
			'\x1b[90m',
			'Confidence:', data.confidence,'|',
			'Intent:', data.intent,'|',
			'Action:', data.action,'|',
			'Classifier:', data.classifier,
			'\x1b[0m'
		);

	}
	else if(data.type == 'start') {
		console.log('\x1b[90m','GI is typing','\x1b[0m');
	}
	else if(data.type == 'end') {
		console.log('\x1b[90m','GI has finished typing','\x1b[0m');
	}

});


function prompt_me() {
	var schema = {
		properties: {
			input: {
				message: ' '
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
		client: 'test',
		token: 'NrCgyKqvyB'
	});
}


function send(input, hide) {
	if(!hide) {
		console.log('> '+input);
	}
	var input = {
		client: 'test',
		session_token: session_token,
		text: input,
		type: 'message',
		user: 'good-intentions-user',
		fast: true
	};
	socket.emit('request',input);
}
