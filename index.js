const request = require('request')
const server = require('./lib/server')

const slapp = require('slapp')({
  convo_store: require('./lib/convo-store'),
  context: require('./lib/context'),
  log: true,
  colors: true,
  ignoreSelf: false,
  ignoreBots: false
})

slapp.message('morty', 'ambient', (msg) => msg.say('rick'))

slapp.message('rick', 'ambient', (msg) => {
  request({
    uri: 'http://rickandmortyquotes.eu-central-1.elasticbeanstalk.com',
    method: 'GET',
    json: true
  }, (err, res, body) => {
    if (err || res.statusCode >= 400) {
      return console.log('rick and morty error', err || body)
    }

    if (res.statusCode === 200) {
      msg.say({
        text: '',
        attachments: [{
          title: body.who,
          pretext: body.what,
          text: body.when
        }]
      })
    }
  })
})

slapp.attachToExpress(server, {
  event: true,
  command: true,
  action: true
}).listen(process.env.PORT, () => console.log(`server listening on ${process.env.PORT}`))
