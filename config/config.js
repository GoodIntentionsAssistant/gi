var config = {};

config.app_dir =  __dirname+'/../apps';

config.root_dir =  __dirname+'/..';

config.name = "Good Intentions";

config.app = {
  loop_speed: 500
}

config.admin = {
  password: 'hungry55'
};

config.clients = {
  'test': {
    'token': 'NrCgyKqvyB'
  },
  'webhook': {
    'token': 'qkkl7Xb0Cc'
  }
};

config.learn = {
  default_classifier: 'classify'
};

config.response = {
  min_reply_time: 500,
  letter_speed: 20,
  max_response: 2000
};

config.classifiers = {
  '_default': {
    'classifier': 'classify'
  },
  'admin': {
    'classifier': 'strict'
  },
  'strict': {
    'classifier': 'strict'
  },
  'main': {
    'classifier': 'classify'
  },
  'fallback': {
    'classifier': 'classify'
  }
}

config.queue = {
  max_consecutive: 1,
  timeout: 5000
};

config.server = {
  enabled: true,
  port: 3000
};

module.exports = config;