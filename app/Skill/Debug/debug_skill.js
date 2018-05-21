/**
 * Debug Skill
 */
var Skill = require('../../../src/Skill/skill');

module.exports = class DebugSkill extends Skill {

/**
 * Constructor
 *
 * @param App app
 * @access public
 * @return void
 */
  constructor(app) {
    super(app);

    app.on('app.understand.match', (data) => {
      this.debug([
        'Understand',
        'Collection: '+data.collection,
        'Matches: '+data.matches.length,
      ]);

      if(data.matches.length > 0) {
        for(let ii=0; ii<data.matches.length; ii++) {
          this.debug(data.matches[ii].result+' ('+data.matches[ii].confidence+')');
        }
      }

    });

  }


  debug(messages) {
    if(typeof messages !== "object") {
      messages = [messages];
    }

    for(let ii=0; ii<messages.length; ii++) {
      if(typeof messages[ii] == 'object') {
        messages[ii] = messages[ii].toString();
      }

      console.log('Debug'.magenta, messages[ii]);
    }
  }

}