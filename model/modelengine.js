//model engine
var mysql = require('mysql');

var TabulaModel = {
	
	currentView: "blog",
	TabulaDB: new Object,
	httpStatus: 200,
	urlset: new Object,

	
	build: function (req){
		var { url } = req;
		TabulaModel.currentView = "blog";
		TabulaModel.TabulaDB = { "" : "" };
		TabulaModel.httpStatus = 200;
		urlset = { "" : "" };
		
		
		//Taking ownership
		TabulaModel.urlset = url;
		
		//Formatting for what we're looking for.
		TabulaModel.parseurl();
		
		TabulaModel.TabulaDBConnect();

		TabulaModel.TabulaDB.end();
		return;
	},
	
	parseurl: function () {
		
		TabulaModel.urlset = url.parse(TabulaModel.urlset, true);
		
		//Remove /'s and null space created by removal.
		var path = TabulaModel.urlset.pathname.split("/").filter(x => x != "").toString();
		
		//split on the ,s toString throws in.
		path = path.split(",");
		
		//If we're in an array, take the first element. That's our path.
		if(Array.isArray(path)) path = path[0].toString();
		TabulaModel.currentView = path;

	
	},
	
	TabulaDBConnect: function (){

		TabulaModel.TabulaDB = mysql.createConnection({
		host     : globals.db_info.server,
		user     : globals.db_info.username,
		password : globals.db_info.password,
		database : 'tabula'
		});
		
		TabulaModel.TabulaDB.connect(function(err) {
			if (err) {
				TabulaModel.httpStatus = 500;
				console.error('error connecting: ' + err.stack);
			return;
			}
		
		});
		
		TabulaModel.viewSearch(TabulaModel.currentView);
		
	},
	
	viewSearch: function (path) {

		//Should probably start by stripping out any character
		// that could be used for SQL injection.
		var query = "SELECT * FROM views WHERE viewname = \'"
		+path+"\';";
		
		//Query takes an anonymous callback function for result/error
		TabulaModel.TabulaDB.query(query, function (error, result, fields){
			
			if(error){console.log("Error: "+error);}
			
			var fixedviewname = 0;
			
			try{
				fixedviewname = result[0].viewname;
			}catch(err){
				fixedviewname = 0;
			}
			
			
			if(fixedviewname){
				TabulaModel.currentView = fixedviewname;
				}else{
					TabulaModel.currentView = "404";
					TabulaModel.httpStatus = 404;
					}
			});
			
			TabulaController.SQLComplete(TabulaModel.currentView);

	
		
	}
	
	
}

module.exports = TabulaModel;