#streamCb

Convert between node's two most popular interfaces, streams and
(err, result) callbacks.

They are both setup to handle data in the future and do something
responsible with an error if one occurs. The fundamental difference
is that streams can handle chunks at a time, where as callbacks
have to handle the whole thing at once. But when interfacing with a
module that deals with everything at once we still want to use our
streaming magic.

[![browser support](https://ci.testling.com/nrn/stream-cb.png)](https://ci.testling.com/nrn/stream-cb)

```javascript
var streamCb = require('stream-cb')
```

##streamCb(?, opt)

if ? is a stream, call .toCb(?, opt)
if ? is a function, call .toStream(?, opt)
Otherwise return undefined.

##streamCb.toStream(cb, encoding)

return a writable stream that calls cb(null, results) if it's ended
or with an error if error occurs.

##streamCb.toCb(stream, noend)

return a callback that writes to the stream when it's called (null, data),
or emits an error if one is provided.

If noend then don't end the stream when the returned callback is called.

##Why?

Because you want to make a streams lib and a cb lib work together,
or you want to provide a flexible api for your users.

###Libs playing together

```javascript
var client = require('redis').createClient()
  , http = require('http')
  , streamCb = require('stream-cb')

client.set('space_cowboys', 'Mal Reynolds, Han Solo, Vash the Stampede')

http.createServer(function (req, res) {

  res.on('error', function (e) {
    res.statusCode = 500
    res.end('Server ' + e)
  })

  res.statusCode = 200

  client.get('space_cowboys', streamCb(res))

}).listen(8080)
```

###Flexible API

```javascript
function (opts, cb) {
  var awesome = new crazyStream
  // Do cool streams stuff here

  if (cb) return awesome.pipe(streamCb.toStream(cb))
  return awesome
}
```

##License (MIT)

Copyright (c) 2013 Nick Niemeir <nick.niemeir@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

