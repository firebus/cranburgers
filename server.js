// server.js
var http = require('http')
, nko = require('nko')('B80ubnph0rdg+N4H');

var app = http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('Hello, NKO love, Cranburgers');
});

app.listen(parseInt(process.env.PORT) || 7777);
console.log('Listening on ' + app.address().port);
