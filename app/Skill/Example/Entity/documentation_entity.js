/**
 * Documentation Entity
 */ 
const Entity = require('../../../../src/Entity/entity');

module.exports = class DocumentationEntity extends Entity {

  setup() {
    this.data = {
      'training': {
        'label': 'Intent training',
        'url': '/docs/intents/training',
        'synonyms': ['train']
      },
      'parameters': {
        'label': 'Intent parameters',
        'url': '/docs/intents/parameters',
        'synonyms': ['params']
      },
      'result': {
        'label': 'Intent returning result',
        'url': '/docs/intents/result',
        'synonyms': []
      },
      'attachment': {
        'label': 'Intent attachments',
        'url': '/docs/intents/attachments',
        'synonyms': ['attach']
      },
      'expects': {
        'label': 'Intent expects',
        'url': '/docs/intents/expects',
        'synonyms': ['expecting']
      },
      'redirect': {
        'label': 'Intent redirecting',
        'url': '/docs/intents/redirect',
        'synonyms': ['redirecting']
      },
      'fallback': {
        'label': 'Intent fallbacks',
        'url': '/docs/intents/fallback',
        'synonyms': ['fallbacks']
      },
      'callback': {
        'label': 'Intent callbacks',
        'url': '/docs/intents/callback',
        'synonyms': ['callbacks']
      },
      'intents': {
        'label': 'Intents',
        'url': '/docs/intents',
        'synonyms': ['intent']
      },
      'entities': {
        'label': 'Entities',
        'url': '/docs/entities',
        'synonyms': ['entity']
      },
      'home': {
        'label': 'Good intentions home page',
        'url': '/',
        'synonyms': []
      },
      'docs': {
        'label': 'Documentation',
        'url': '/docs/',
        'synonyms': ['documentation']
      },
    };
  }

}