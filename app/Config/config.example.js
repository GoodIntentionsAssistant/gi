var config = {};

config.paths = {
  root:  __dirname+'/../..',
  app: __dirname+'/../../app',
  logs: __dirname+'/../../app/Log',
  system: __dirname+'/../../src',
  data: __dirname+'/../../data',
  skills: {
    app: __dirname+'/../../app/Skill',
    sys: __dirname+'/../../src/Skill'
  }
};

config.name = "Good Intentions";

config.skills = [
  'App.Currency',
  'App.Dice',
  'App.FlipCoin',
  'App.CatFacts',
  'App.RandomNumber',
  'App.Calculator',
  'App.Time',
  'App.Unit',
  'App.RockPaperScissors',
  'App.Example',
  'App.Fallback',
  'App.Weather',
  'App.Error',
  //'App.SmallTalk',
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
  enabled: false
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