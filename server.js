var http = require('http');
var url = require('url');
var qs = require('querystring');

var fs = require('fs');
var spawn = require('child_process').spawn;

var request = require('request');
var es = require('event-stream');

function worker (params) {
    var args = Object.keys(params).reduce(function (acc, key) {
        return acc.concat('--' + key, String(acc[key]));
    }, []);
    args.unshift(__dirname + '/worker.js');
    
    var to = setTimeout(function () {
        ps.stdout.emit('data', 'PIXIFICATION TOOK TOO LONG\r\n');
        process.nextTick(function () {
            ps.kill();
        });
    }, 10 * 1000);
    
    var ps = spawn('node', args);
    ps.on('exit', function () {
        clearTimeout(to);
    });
    
    return es.duplex(ps.stdin, ps.stdout);
}

var server = http.createServer(function (req, res) {
    var params = qs.parse(decodeURIComponent(
        req.url.split('?').slice(1).join('?')
    ));
    
    if (req.method === 'GET' && req.url === '/') {
        res.setHeader('content-type', 'text/plain');
        fs.createReadStream(__dirname + '/usage.txt').pipe(res);
    }
    else if (req.method === 'PUT') {
        res.setHeader('content-type', 'text/ansi');
        
        var w = worker(params);
        w.pipe(res);
        req.pipe(w);
    }
    else if (req.method === 'GET' && params.uri) {
        res.writeHead(200, { 'content-type' : 'text/ansi' });
        
        var w = worker(params);
        w.pipe(res);
        var r = request(params.uri);
        r.pipe(w);
    }
    else {
        res.writeHead(404, { 'content-type' : 'text/plain' });
        res.end('not found');
    }
});
server.listen(5065);
