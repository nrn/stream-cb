var test = require('tape')
  , Stream = require('stream')
  , streamCb = require('./index')

test('streamCb', function (t) {
  var cb = function (e, r) {
    if (e) throw e
    t.equal(r, 'asdf', 'Callback')
  }
  var str = function () {
    var st = new Stream
      , b = ''
    st.writable = true
    st.write = function (chunk) {
      b += chunk
    }
    st.end = function () {
      t.equal(b, 'foo', 'Stream')
    }
    return st
  }

  t.plan(9)

  var st1 = streamCb(cb)
  st1.write('asdf')
  st1.end()

  var st2 = streamCb.toStream(cb)
  st2.write('as')
  st2.write('df')
  st2.end()

  var st3 = streamCb.toStream(cb)
  st3.write('as')
  st3.end('df')

  var ct1 = streamCb.toCb(cb)(null, 'asdf')

  var st4 = streamCb.toStream(str())
  st4.write('foo')
  st4.end()

  var ct2 = streamCb(str())(null, 'foo')

  try{
    var ct3 = streamCb.toCb(str())(new Error('bar'))
  } catch (e) {
    t.equal(e.toString(), 'Error: bar', 'throws')
  }

  var noend = str()
  var ct4 = streamCb.toCb(noend, true)(null, 'foo')
  noend.end()

  var tryThis = streamCb(function (e, r) {
    t.equal(this.thing, 123, 'this value correct')
  })
  tryThis.thing = 123

  tryThis.end()

})

