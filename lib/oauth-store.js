const JFS = require('jfs')
const store = new JFS('db/oauth.json')
const get = (id, cb) => store.get(id, cb)
const set = (id, params, cb) => store.save(id, params, cb)
const del = (id, cb) => store.delete(id, cb)

module.exports = { get, set, del }
