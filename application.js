// HTTP server core

//Include necessary files.
const http = require('http');

url = require('url');
fs = require('fs');

//This is our config file for the moment.
globals = require('./config');

//Calling in our M, V, and C, in control-flow order.
TabulaController = require(globals.DOCROOT +'controller/engine');
TabulaModel = require(globals.DOCROOT + 'model/modelengine');
TabulaView = require(globals.DOCROOT + 'view/viewengine');



// Create HTTP server
const server = http.createServer(function(req, res) {
	

	//get rid of obnoxious favicon request.
	if(url.parse(req.url).pathname == "/favicon.ico"){
		res.writeHead(204, {'Content-Type': 'text/html'});
		
		//no need to waste processor time.
		res.end();
		return;
	}
	
	//First call to our engine.
	TabulaController.build(req, res);
	
	//To do: model.httpStatus etc.
	res.writeHead(200, {'Content-Type': 'text/html'});
	
	res.end(TabulaView.printHeadTag());
	
});
//Have you tried turning the server on?
server.listen(globals.port, globals.hostname, () =>{
	console.log(`Server running on ${globals.hostname}:${globals.port}`)
});
