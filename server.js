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

const app = slapp.attachToExpress(express())
app.listen(process.env.PORT)
