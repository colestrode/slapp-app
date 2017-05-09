const express = require('express')
const qs = require('qs')
const request = require('request')
const oauthStore = require('./oauth-store')
const server = express()

server.get('/add', (req, res) => {
  const queryParms = {
    client_id: process.env.CLIENT_ID,
    scope: `bot channels:history groups:history im:history mpim:history`
  }
  const url = `https://slack.com/oauth/authorize?${qs.stringify(queryParms)}`
  res.redirect(url)
})

server.use('/oauth', (req, res) => {
  if (req.query.error) {
    console.log(`Error adding team: ${req.query.error}`)
    return res.status(500).send({error: `Error adding team: ${req.query.error}`})
  }

  request.get({
    url: `https://slack.com/api/oauth.access`,
    qs: {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code: req.query.code
    },
    json: true
  }, (err, accessRes, accessBody) => {
    if (err || accessRes.statusCode >= 400) {
      console.log('bad oauth.access response', err || accessBody)
      return res.status(500).send({error: 'Bad oauth.access request'})
    }

    if (!accessBody.ok) {
      console.log(`oauth.access response not ok`, accessBody)
      return res.status(500).send({error: `oauth.access response not ok`})
    }

    oauthStore.set(accessBody.team_id, accessBody, (saveErr) => {
      if (saveErr) {
        console.log('could not save oauth token', saveErr)
        return res.status(500).send({error: 'Could not save oauth token'})
      }

      return res.status(200).send({message: `successfully added team "${accessBody.team_name}"`})
    })
  })
})

module.exports = server
