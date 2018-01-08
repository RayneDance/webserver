// HTTP server core

//Include necessary files.
const http = require('http');

fs = require('fs');
globals = require('./config');
TabulaController = require(globals.DOCROOT +'controller/engine');
TabulaModel = require(globals.DOCROOT + 'model/modelengine');



// Create HTTP server
const server = http.createServer(function(req, res) {
	TabulaController.build(req, res);
	res.writeHead(200, {'Content-Type': 'text/html'});
	
	console.log(req.method);
	
	res.end(`${TabulaController.Tabulaurl}`);
});

server.listen(globals.port, globals.hostname, () =>{
	console.log(`Server running on ${globals.hostname}:${globals.port}`)
});