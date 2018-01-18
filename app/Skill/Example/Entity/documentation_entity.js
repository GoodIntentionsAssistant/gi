/**
 * Documentation Entity
 */ 
const Entity = require('../../../../src/Entity/entity');

module.exports = class DocumentationEntity extends Entity {

  setup() {
    this.data = {
      'docs': {
        'label': 'Documentation',
        'url': '/docs',
        'synonyms': ['documentation']
      },
      'skills': {
        'label': 'Skills',
        'url': '/docs/overview/skills',
        'synonyms': ['skill']
      },
      'training': {
        'label': 'Training',
        'url': '/docs/overview/training',
        'synonyms': ['train']
      },
      'parameters': {
        'label': 'Parameters',
        'url': '/docs/overview/parameters',
        'synonyms': ['params']
      },
      'result': {
        'label': 'Returning result',
        'url': '/docs/overview/result',
        'synonyms': []
      },
      'entities': {
        'label': 'Entities',
        'url': '/docs/overview/entities',
        'synonyms': ['entity']
      },
      'attachment': {
        'label': 'Attachments',
        'url': '/docs/overview/attachments',
        'synonyms': ['attach']
      },
      'expects': {
        'label': 'Expects',
        'url': '/docs/overview/expects',
        'synonyms': ['expecting']
      },
      'redirect': {
        'label': 'Redirecting',
        'url': '/docs/overview/redirect',
        'synonyms': ['redirecting']
      },
      'fallback': {
        'label': 'Fallbacks',
        'url': '/docs/overview/fallback',
        'synonyms': ['fallbacks']
      },
      'callback': {
        'label': 'Callbacks',
        'url': '/docs/overview/callback',
        'synonyms': ['callbacks']
      },
      'events': {
        'label': 'Events',
        'url': '/docs/overview/intents',
        'synonyms': ['intent']
      },
      'events': {
        'label': 'Events',
        'url': '/docs/overview/events',
        'synonyms': ['event']
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