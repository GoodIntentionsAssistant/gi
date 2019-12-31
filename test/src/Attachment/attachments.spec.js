const expect = require('chai').expect;

const ActionAttachment = girequire('src/Attachment/action_attachment.js');
const FieldAttachment = girequire('src/Attachment/field_attachment.js');
const ImageAttachment = girequire('src/Attachment/image_attachment.js');
const ReplyAttachment = girequire('src/Attachment/reply_attachment.js');
const MessageAttachment = girequire('src/Attachment/message_attachment.js');
const VoiceAttachment = girequire('src/Attachment/voice_attachment.js');

const Template = girequire('src/Response/template');

describe('Attachments', function() {

  it('can handle voice with templating', () => {
    let attachment = new VoiceAttachment();
    let template = new Template();
    template.set('foo', 'bar');
    template.set('test', 'second');

    let result = attachment.build('foo{{foo}} {{test}}', template);

    expect(result).to.eql({ text: 'foobar second' });
  });

  it('can handle simple voice', () => {
    let attachment = new VoiceAttachment();
    let result = attachment.build('foobar');
    expect(result).to.eql({ text: 'foobar' });
  });

  it('can handle message with templating', () => {
    let attachment = new MessageAttachment();
    let template = new Template();
    template.set('foo', 'bar');
    template.set('test', 'second');

    let result = attachment.build('foo{{foo}} {{test}}', template);

    expect(result).to.eql({ text: 'foobar second' });
  });

  it('can handle simple message', () => {
    let attachment = new MessageAttachment();
    let result = attachment.build('foobar');
    expect(result).to.eql({ text: 'foobar' });
  });

  it('can handle asking for a reply', () => {
    let attachment = new ReplyAttachment();
    expect(attachment.build()).to.equals(true);
  });

  it('can handle images', () => {
    let attachment = new ImageAttachment();
    expect(attachment.build('foobar.jpg')).to.eql({ url: 'foobar.jpg' });
  });

  it('can handle fields', () => {
    let attachment = new FieldAttachment();
    expect(attachment.build({ 'field1': 'value1', 'field2': 'value2' })).to.eql({ 'field1': 'value1', 'field2': 'value2' });
  });

  it('can handle actions', () => {
    let attachment = new ActionAttachment();
    attachment.load();
    expect(attachment.build('foobar')).to.eql({ text: 'foobar' });
  });


});