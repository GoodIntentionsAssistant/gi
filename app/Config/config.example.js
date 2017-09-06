var config = {};

config.paths = {
  root:  __dirname+'/../..',
  app: __dirname+'/../../app',
  skills: __dirname+'/../../app/Skills',
  system: __dirname+'/../../src'
};

config.name = "Good Intentions";

config.apps = [
  'Common',
  'Fun',
  'Productivity',
  'Examples'
];

config.app = {
  loop_speed: 500
}

config.admin = {
  password: ''
};

config.clients = {
  'test': {
    'token': 'NrCgyKqvyB'
  }
};

config.learn = {
  default_classifier: 'classify'
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
  'default': {
    'classifier': 'classify'
  },
  'fallback': {
    'classifier': 'classify'
  }
}

config.logging = {
  enabled: true
};

config.response = {
  min_reply_time: 500,
  letter_speed: 20,
  max_response: 2000
};

config.queue = {
  max_consecutive: 1,
  timeout: 5000
};

config.server = {
  enabled: true,
  port: 3000
};

module.exports = config;