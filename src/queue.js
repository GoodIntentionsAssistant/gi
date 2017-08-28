/**
 * Queue
 */
const Request = require('./request.js');


var Queue = function() {
	this.requests = [];
	this.timer = null;
	this.queue = [];
	this.active = false;
}


/**
 * Initialize
 *
 * @param object app
 * @return void
 */
Queue.prototype.initialize = function(app) {
	this.app = app;

	this.speed = this.app.Config.read('queue.speed');
	this.max_consecutive = this.app.Config.read('queue.max_consecutive');
}


/**
 * Start the queue
 *
 * @access public
 * @return void
 */
Queue.prototype.start = function() {
	this.app.log('Queue started');
	this.active = true;
	this.loop();
}


/**
 * Add to queue
 *
 * @param object client
 * @param hash input
 * @access public
 * @return void
 */
Queue.prototype.add = function(client, input) {
	var ident = Math.random().toString(36).substr(2, 6).toUpperCase();
	this.queue.push({
		ident: ident,
		client: client,
		input: input
	});
}


/**
 * Loop
 *
 * Loop through the request queue with a speed. This will hopefully control
 * any basic flood and memory issues. We can extend on this functionality another time with
 * a new module for queuing jobs, checking the memory and how many loaded requests are still
 * active. If the brain starts to use up too much memory then increase the speed and
 * optimise this code later.
 *
 * @access public
 * @return void
 */
Queue.prototype.loop = function() {
	//Find item in queue and do the request
	//Only run if items in the queue and max number of running requests is not exceeded
	if(this.queue.length > 0 && Object.keys(this.requests).length < this.max_consecutive) {
		var request = this.queue.shift();
		this.request(request);
	}

	//Check requests timed out
	if(Object.keys(this.requests).length > 0) {
		this.check_timed_out();
	}

	//Timed trigger to check queue again
	var that = this;
	this.timer = setTimeout(function() {
		that.loop();
	}, this.speed);
}


/**
 * Check timed out
 *
 * @access public
 * @return object
 */
Queue.prototype.check_timed_out = function() {
	for(var key in this.requests) {
		//Make sure it's still active
		if(!this.requests[key].active) {
			continue;
		}

		//Check request last activity and work out the difference
		var diff = parseInt(Date.now() - this.requests[key].request.last_activity);
		
		//Over time out
		if(diff >= this.app.Config.read('queue.timeout')) {
			this.requests[key].active = false;
			this.requests[key].request.timeout();
		}
	}
}


/**
 * Request
 *
 * @param object client
 * @param string input
 * @return object
 */
Queue.prototype.request = function(request) {
	var req = new Request();
	req.initialize(this.app, request.ident);
	req.process(request.client, request.input);

	//
	this.requests[request.ident] = {
		started: Date.now(),
		request: req,
		active: true
	};

	//Check when the result has finished
	var that = this;
	req.promise.then(function(result) {
		that.destroy_request(request.ident);
	});

	return req;
}


/**
 * Destroy request
 *
 * @param string ident
 * @access public
 * @return boolean
 */
Queue.prototype.destroy_request = function(ident) {
	if(!this.requests[ident]) {
		this.app.error('Request '+ident+' not found to destroy');
		return false;
	}
	this.app.log('Request finished', ident);
	delete this.requests[ident];
	return true;
}


/**
 * Status
 *
 * @access public
 * @return hash
 */
Queue.prototype.status = function() {
	var data = {
		'queue_length': this.queue.length,
		'speed': this.speed,
		'max': this.max_consecutive,
		'active_requests': Object.keys(this.requests).length
	};
	return data;
}




module.exports = Queue;



