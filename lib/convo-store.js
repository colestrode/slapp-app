const JFS = require('jfs')
const store = new JFS('db/convo.json')
const get = (id, cb) => {
  // ignore errors: this means missing convo, which is very likely
  store.get(id, (err, res) => cb(null, res)) // eslint-disable-line handle-callback-err
}
const set = (id, params, cb) => store.save(id, params, cb)
const del = (id, cb) => store.delete(id, cb)

module.exports = { get, set, del }
