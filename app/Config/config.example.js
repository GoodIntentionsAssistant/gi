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
  'App.Error',
  'App.Example',
  'App.Calculator',
  'App.Weather',
  'App.SmallTalk',
  'App.Dice',
  'App.Currency',
  'App.FlipCoin',
  'App.CatFacts',
  'App.Number',
  'App.Time',
  'App.Unit',
  'App.RockPaperScissors',
  'App.Fallback',
  'App.Common',
  'App.Reminder',
  'App.Logging',
  'App.Welcome',
  'App.BmiReading'
];

config.attachments = [
  'Sys.Attachment.Image',
  'Sys.Attachment.Action',
  'Sys.Attachment.Field',
  'Sys.Attachment.Reply',
  'App.Example.Attachment.Navigation',
  'App.Example.Attachment.Display'
];

config.auth = {
  strict: true
};

config.app = {
  loop_speed: 500
}

config.database = {
  'driver': 'jfs'
};

config.clients = {
  'test': {
    'secret': 'NrCgyKqvyB'
  }
};

config.collections = {
  'admin': {
    'classifier': 'strict'
  },
  'cancel': {
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