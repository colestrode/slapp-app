const oauthStore = require('./oauth-store')

module.exports = (req, res, next) => {
  const meta = req.slapp.meta

  oauthStore.get(meta.team_id, (err, result) => {
    if (err) {
      console.log('ERROR RETRIEVING TEAM CONTEXT', meta, err)
      return res.send(500)
    }

    const app_token = result.access_token // eslint-disable-line camelcase
    const {bot_access_token: bot_token, bot_user_id} = result.bot

    req.slapp.meta = Object.assign(meta, { app_token, bot_token, bot_user_id })

    next()
  })
}
