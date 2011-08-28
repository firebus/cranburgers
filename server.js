/**
 * @file
 *
 * Main file for Metalike project
 * Cranburgers team entry in NKO 2011 http://nodeknockout.com
 * 
 * @author: Russell Uman <russ@firebus.com>
 */

// Requires
var http = require('http')
, fs = require('fs')
, nko = require('nko')('B80ubnph0rdg+N4H')
, url = require('url')
, compressor = require('node-minify');

// Minify bookmarklet
new compressor.minify({
  type: 'uglifyjs',
  fileIn: './bookmarklet.js',
  fileOut: './bookmarklet-min.js',
  callback: function(err){
    console.log('minify errors: ' + err);
  }
});

// Instantiate http server
var app = http.createServer(routeHandler);

// Instantiate sockets
var io = require('socket.io').listen(app);
io.sockets.on('connection', function (socket) {
  socket.emit('client', { message: 'client message' });
  socket.on('server', function (data) {
      console.log(data['message']);
  });
});

// Start http server
app.listen(parseInt(process.env.PORT) || 7777);
console.log('Listening on ' + app.address().port);

/**
 * A really simple router
 */
function routeHandler (req, res) {
  var path = url.parse(req.url).pathname
  if (path == '/') {
    path = '/index.html';
  }
  console.log("Request for " + path + " received.");

  if (path == '/index.html') {
    var haml = require('hamljs')
    , hostname = req.headers.host;

    var bookmarklet = fs.readFileSync(__dirname + '/bookmarklet-min.js').toString().replace(/HOSTNAME/g, hostname);
    
    var options = {
      locals: {
        bookmarklet: 'javascript:' + bookmarklet,
        //bookmarklet: "javascript:(function(){var varScript=document.createElement('SCRIPT');varScript.type='text/javascript';varScript.innerHTML='var hostname = \\\'" + hostname + "\\\';';document.getElementsByTagName('head')[0].appendChild(varScript);var metaScript=document.createElement('SCRIPT');metaScript.type='text/javascript';metaScript.src='http://" + hostname + "/metalike.js';document.getElementsByTagName('head')[0].appendChild(metaScript)})();",
      }
    };
    res.writeHead(200);
    res.end(haml.render(fs.readFileSync('index.haml'), options));
  }
  else {
    fs.readFile(__dirname + path, function (err, data) {
      if (err) {
        console.log('Error loading ' + path);
        res.writeHead(500);
        return res.end('Error loading ' + path);
      }
      res.writeHead(200);
      res.end(data);
    });
  }
}

