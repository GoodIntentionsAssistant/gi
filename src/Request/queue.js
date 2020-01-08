/**
 * Queue
 */
const Dispatcher = girequire('/src/Request/dispatcher');
const Config = girequire('/src/Config/config');
const Logger = girequire('/src/Helpers/logger');

const Randtoken = require('rand-token');

module.exports = class Queue {

/**
 * Constructor
 *
 * @constructor
 * @param {Object} app App instance
 */
	constructor(app) {
		this.app = app;

		//Dispatcher
		this.dispatcher = new Dispatcher(this.app);

		//Queued requests waiting for dispatching
		this._queue = [];

		//Active requests
		//If max_consecutive is one there will only be one request at a time
		this._requests = [];

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
    app.on('app.loop', () => {
			if(this.active) {
				this.check();
      }
    });
	}


/**
 * Make the queue active
 * 
 * @returns {boolean}
 */
	start() {
		Logger.success(`Queue started with ${this.max_consecutive} maximum consecutive requests`);
		this.active = true;
		return true;
	}


/**
 * Add request to queue
 *
 * @param {Object} input Input from request
 * @param {boolean} check If the queue should be checked immediately after adding to the queue
 * @returns {boolean} If added to queue, of if queue skipped then if the request was dispatched successfully
 */
	add(input, check = true) {
		//Create a unique ident for this queue
		let ident = Randtoken.generate(16);

		//Check if skipping the queue
		//This should only be used for time critical requests such as a scheduled call
		//that we don't want to get stuck in the queue causing a delay
		if(input.skip_queue) {
			Logger.info(`Request is skipping queue`, { prefix:ident });
			return this.request({
				ident,
				input
			});
		}

		//Add to queue
		//The app loop listener will process this in ::check
		this._queue.push({
			ident,
			input
		});

		//Check the queue to see if it's empty and if we should process this request immediately
		if(check) {
			this.check();
		}

		return true;
	}


/**
 * Check
 *
 * @returns {boolean}
 */
	check() {
		//Find item in queue and do the request
		//Only run if items in the queue and max number of running requests is not exceeded
		if(this._queue.length > 0 && Object.keys(this._requests).length < this.max_consecutive) {
			let request = this._queue.shift();
			this.request(request);
		}

		//Check requests timed out
		if(Object.keys(this._requests).length > 0) {
			this.check_timed_out();
		}

		return true;
	}


/**
 * Check timed out
 *
 * @returns {boolean}
 */
	check_timed_out() {
		for(var key in this._requests) {
			//Make sure it's still active
			if(!this._requests[key].active) {
				continue;
			}

			//Check request last activity and work out the difference
			var diff = parseInt(Date.now() - this._requests[key].request.last_activity);
			
			//Over time out
			if(diff >= this.queue_timeout) {
				this._requests[key].active = false;
				this._requests[key].request.timeout();
			}
		}

		return true;
	}


/**
 * Request
 *
 * @param {Object} data Original request object from queue
 * @returns {boolean} If successfully dispatched
 */
	request(data) {
		//Check if this request by the ident is already being processed
		if(this.has_request(data.ident)) {
			return false;
		}

		//Dispatch the queue request
		let request = this.dispatcher.dispatch(data);

		//Failed to make request?
		if(!request) {
			return false;
		}

		//Push the request to local array
		//This will be checked on the loop to make sure it's not timed out
		this._requests[data.ident] = {
			started: Date.now(),
			active: true,
			request
		};

		//Check when the request has finished
		//It doesn't matter if it failed or was successful
		//Once the request has finished then destroy the request
		request.promise.then(() => {
			this.destroy_request(data.ident);
		});

		return true;
	}


/**
 * Has request
 * 
 * @param {string} ident Ident for request
 * @returns {boolean} If the request exists
 */
	has_request(ident) {
		if(!this._requests[ident]) {
			return false;
		}
		return true;
	}


/**
 * Destroy request
 *
 * @todo Return to check if it was deleted
 * @param {string} ident Identifier for the request
 * @returns {boolean} Succss of deleting the request
 */
	destroy_request(ident) {
		if(!this._requests[ident]) {
			Logger.error(`Request ${ident} not found to destroy`);
			return false;
		}

		Logger.info('Request finished', { prefix:ident });
		delete this._requests[ident];
		return true;
	}

}



