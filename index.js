// stream-cb, (c) 2013 Nick Niemeir <nick.niemeir@gmail.com>
// MIT licensed. https://github.com/nrn/stream-cb

var stream = require('stream')

module.exports = streamCb
streamCb.toCb = toCb
streamCb.toStream = toStream

function streamCb (cbst) {
  if (typeof cbst.pipe === 'function') return toCb(cbst)
  if (typeof cbst === 'function') return toStream(cbst)
}

function toStream (cb, encoding) {
  if (typeof cb.pipe === 'function') return cb
  var str = new stream.Writable
    , data = []
  str.on('error', cb)
  str._write = function (chunk, encoding, cb) {
    data.push(chunk)
    cb()
  }
  str.end = function (chunk) {
    if (chunk) str.write(chunk)
    cb(null, Buffer.concat(data).toString(encoding))
  }

  return str
}

function toCb (str, noend) {
  if (typeof str === 'function') return str
  return function (e, results) {
    if (e) return str.emit('error', e)
    str.write(results)
    if (!noend) str.end()
  }
}

