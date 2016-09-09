'use strict'
const Slapp = require('slapp')
const BeepBoopConvoStore = require('slapp-convo-beepboop')
const BeepBoopContext = require('slapp-context-beepboop')
const express = require('express')
const sg = require('sendgrid')(process.env.SENDGRID_API_KEY)
const validURL = require('valid-rul')


const slapp = Slapp({
  verify_token: process.env.SLACK_VERIFY_TOKEN,
  convo_store: BeepBoopConvoStore(),
  context: BeepBoopContext(),
  log: true,
  colors: true
})

slapp.command('/curated', 'add (.*)', (msg, text, url) => {
  // Check if valid url
  console.log('URL received => ', url)
  if (validURL.isUri(url){
    msg.respond(`Thanks for adding! ${url}!`)

    var helper = require('sendgrid').mail;
    var from_email = new helper.Email('dalanmiller@rethinkdb.com');
    var to_email = new helper.Email('process.env.CURATEDCO_EMAIL');
    var subject = '';
    var content = new helper.Content('text/plain', url);
    var mail = new helper.Mail(from_email, subject, to_email, content);

    var request = sg.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: mail.toJSON(),
    });

  } else {
    msg.respond("That doesn't look like it was a valid URL")
  }
})





sg.API(request, function(error, response) {
  console.log(response.statusCode);
  console.log(response.body);
  console.log(response.headers);
});


slapp.message('^(hi|hello|hey).*', ['direct_mention', 'direct_message'], (msg, text, greeting) => {
  msg
    .say(`${greeting}, how are you?`)
    .route('handleHowAreYou')  // where to route the next msg in the conversation
})

// register a route handler
slapp.route('handleHowAreYou', (msg) => {
  // respond with a random entry from array
  msg.say(['Me too', 'Noted', 'That is interesting'])
})

const app = slapp.attachToExpress(express()).listen(process.env.PORT)
