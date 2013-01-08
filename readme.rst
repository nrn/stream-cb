===============================================================================
streamCb
===============================================================================

Switch between node's two most popular interfaces, streams and 
(err, result) callbacks.

``streamCb = require('stream-cb')``

streamCb(?, opt)
==========

if ? is a stream, call .toCb(?, opt)
if ? is a function, call .toStream(?, opt)
Otherwise throw an error.

streamCb.toStream(cb, encoding)
============================

return a writable stream that calls cb(null, results) if it's ended
or with an error if error occurs.

streamCb.toCb(stream, noend)
===============================

return a callback that writes to the stream when it's called (null, data),
or emits an error if one is provided.

If noend then don't end the stream when the returned callback is called.

Why?
====

Because you want to make a streams lib and a cb lib work together,
or you want to provide a flexible api for your users.

::
  function (opts, cb) {
    var awesome = new crazyStream
    // Do cool streams stuff here

    if (cb) return awesome.pipe(streamCb.toStream(cb))
    return awesome
  }
