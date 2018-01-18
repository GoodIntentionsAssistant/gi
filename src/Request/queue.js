/**
 * Queue
 */
const Request = require('./request.js');
const Randtoken = require('rand-token');
const Config = require('../Core/config.js');

module.exports = class Queue {

/**
 * Initialize
 *
 * @param object app
 * @access public
 * @return void
 */
	constructor(app) {
		this.app = app;

		//Queued requests waiting for dispatching
		this.queue = [];

		//Active requests
		//If max_consecutive is one there will only be one request at a time
		this.requests = [];

		//Queue needs to be started before it can start processing requests
		this.active = false;

		//Total number of requests that can be handled simultaneously
		//It's suggested to keep this number low
		this.max_consecutive = Config.read('queue.max_consecutive');

		//Request time out
		//If a request takes too much time to process the request will time out
		//This will free up the number of requests based on max_consecutive
		this.queue_timeout = Config.read('queue.timeout');

		//Listen to the main app loop
    app.on('app.loop', (data) => {
    	if(this.active) {
      	this.check();
      }
    });
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
	add(input) {
		//Create a unique ident for this queue
		let ident = Randtoken.generate(16);

		this.queue.push({
			ident: ident,
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
			if(diff >= this.queue_timeout) {
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
		//Client id is passed in the request
		//Use this to find the correct client to send the response back to
		let client = this.app.Server.find_client(request.input.client_id);

		//Build a new request object
		//Each request object is unique and will be destroyed after its completed
		//or if it's timed out.
		let req = new Request(this.app, client, request.ident);

		//Process the request
		req.incoming(request.input);

		//Push the request to local array
		//This will be checked on the loop to make sure it's not timed out
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

}



