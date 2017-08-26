// Queue
	
var Admin = require('../admin');
var moment = require('moment');

function AgentListIntent() {
	var methods = {
		name: 'AgentList',
		trigger: 'agent list'
	}
	methods.__proto__ = Admin()

	methods.response = function(response) {
		var output = [];

		var agents = response.app.Server.agents;

		output.push('Agent list ('+agents.length+')');
		output.push('');

		for(var ii=0; ii<agents.length; ii++) {
			output.push(agents[ii].agent.name+' ('+agents[ii].ident+')');

			var created = moment(agents[ii].agent.created).format('dddd, MMMM Do YYYY, h:mm:ss a');
			var age = moment(agents[ii].agent.created).from();

			output.push('- Created: '+created);
			output.push('- Age: '+age);
			output.push('- Request count: '+agents[ii].agent.request_count);
			output.push('- Identified: '+agents[ii].agent.identified);
			output.push('');
		}

		return output;
	}

	return methods
}

module.exports = AgentListIntent;
