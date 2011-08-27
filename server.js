/**
 * @file
 *
 * Main file for Metalike project
 * Cranburgers team entry in NKO 2011 http://nodeknockout.com
 * 
 * @author: Russell Uman <russ@firebus.com>
 */

var http = require('http')
, fs = require('fs')
, nko = require('nko')('B80ubnph0rdg+N4H')
, url = require("url");


var app = http.createServer(function (req, res) {
  var path = url.parse(req.url).pathname;
  if (path == '/') {
    path = '/index.html';
  }
  console.log("Request for " + path + " received.");
  fs.readFile(__dirname + path,
  function (err, data) {
    if (err) {
      console.log('Error loading ' + path);
      res.writeHead(500);
      return res.end('Error loading ' + path);
    }
    res.writeHead(200);
    res.end(data);
  });
});

var io = require('socket.io').listen(app);

app.listen(parseInt(process.env.PORT) || 7777);

console.log('Listening on ' + app.address().port);

io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'Cranburgers' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});
