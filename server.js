var http = require('http');
var pictureTube = require('picture-tube');
var url = require('url');
var qs = require('querystring');
var request = require('request');
var fs = require('fs');

var server = http.createServer(function (req, res) {
    var params = qs.parse(decodeURIComponent(
        req.url.split('?').slice(1).join('?')
    ));
    
    if (req.method === 'GET' && req.url === '/') {
        res.writeHead(200, { 'content-type' : 'text/plain' });
        fs.createReadStream(__dirname + '/usage.txt').pipe(res);
    }
    else if (req.method === 'PUT') {
        res.writeHead(200, { 'content-type' : 'text/ansi' });
        
        var tube = pictureTube(params);
        tube.pipe(res);
        req.pipe(tube);
    }
    else if (req.method === 'GET' && params.uri) {
        res.writeHead(200, { 'content-type' : 'text/ansi' });
        
        var tube = pictureTube(params);
        tube.pipe(res);
        request(params.uri).pipe(tube);
    }
    else {
        res.writeHead(404, { 'content-type' : 'text/plain' });
        res.end('not found');
    }
});
server.listen(5065);
