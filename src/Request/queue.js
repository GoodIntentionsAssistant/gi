/**
 * Queue
 */
const Request = require('./request.js');
const Randtoken = require('rand-token');

module.exports = class Queue {

/**
 * Initialize
 *
 * @param object app
 * @return void
 */
	constructor(app) {
		this.requests = [];
		this.timer = null;
		this.queue = [];
		this.active = false;

		this.app = app;

		this.max_consecutive = this.app.Config.read('queue.max_consecutive');
	}


/**
 * Start the queue
 *
 * @access public
 * @return void
 */
	start() {
		this.app.Log.add('Queue started');
		this.active = true;
	}


/**
 * Add to queue
 *
 * @param object client
 * @param hash input
 * @access public
 * @return void
 */
	add(client, input) {
		var ident = Randtoken.generate(16);
		this.queue.push({
			ident: ident,
			client: client,
			input: input
		});
	}


/**
 * Check
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
	check() {
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
	}


/**
 * Check timed out
 *
 * @access public
 * @return object
 */
	check_timed_out() {
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
 * @param object client`
 * @param string input
 * @return object
 */
	request(request) {
		var req = new Request(this.app, request.client, request.ident);
		req.incoming(request.input);

		//
		this.requests[request.ident] = {
			started: Date.now(),
			request: req,
			active: true
		};

		//Check when the result has finished
		req.promise.then((result) => {
			this.destroy_request(request.ident);
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
	destroy_request(ident) {
		if(!this.requests[ident]) {
			this.app.Log.error('Request '+ident+' not found to destroy');
			return false;
		}
		this.app.Log.add('Request finished', ident);
		delete this.requests[ident];
		return true;
	}


/**
 * Status
 *
 * @access public
 * @return hash
 */
	status() {
		var data = {
			'queue_length': this.queue.length,
			'speed': this.speed,
			'max': this.max_consecutive,
			'active_requests': Object.keys(this.requests).length
		};
		return data;
	}

}


