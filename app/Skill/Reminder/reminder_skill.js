/**
 * Reminder Skill
 */
const Skill = require('../../../src/Skill/skill');

const moment = require('moment');

module.exports = class ReminderSkill extends Skill {

/**
 * Constructor
 *
 * @param object app
 * @access public
 * @return void
 */
  constructor(app) {
    super(app);

    /*app.on('client.handshake', (data) => {
      app.Scheduler.add('reminder', data.session_id, {
        'when': moment().add(2, 'seconds')
      });
    });

    app.on('scheduler.trigger.reminder', (data) => {
      console.log(data.schedule);
      console.log('yay to the scheduler!');
    });*/
  }

}