// Create web server


var http = require('http');
var fs = require('fs');
var url = require('url');
var path = require('path');
var comments = require('./comments');

var server = http.createServer(function(req, res) {
    var urlObj = url.parse(req.url, true);
    var pathname = urlObj.pathname;
    if (pathname === '/') {
        var filePath = path.join(__dirname, 'index.html');
        fs.readFile(filePath, 'utf8', function(err, data) {
            if (err) {
                res.writeHead(500, {'Content-Type': 'text/plain'});
                res.end('Server Error');
            }
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(data);
        });
    } else if (pathname === '/comments.json' && req.method === 'GET') {
        comments.get(function(err, data) {
            if (err) {
                res.writeHead(500, {'Content-Type': 'text/plain'});
                res.end('Server Error');
            }
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(data);
        });
    } else if (pathname === '/comments.json' && req.method === 'POST') {
        var str = '';
        req.on('data', function(chunk) {
            str += chunk;
        });
        req.on('end', function() {
            comments.add(str, function(err) {
                if (err) {
                    res.writeHead(500, {'Content-Type': 'text/plain'});
                    res.end('Server Error');
                }
                res.end();
            });
        });
    } else {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('Not Found');
    }
});

server.listen(3000, function() {
    console.log('Server is listening on port 3000');
});