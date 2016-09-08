'use strict'
const Slapp = require('slapp')
const BeepBoopContext = require('slapp-context-beepboop')
const express = require('express')
const sg = require('sendgrid')(process.env.SENDGRID_API_KEY)


const slapp = Slapp({
  verify_token: process.env.SLACK_VERIFY_TOKEN,
  // convo_store: ConvoStore(),
  context: BeepBoopContext(),
  log: true,
  colors: true
})

slapp.command('/curated', 'add (.*)', (msg, text, url) => {

  msg.respond(`Thanks for adding! ${url}!`)
})

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
