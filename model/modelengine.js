//model engine

//Obvi. MySQL driver.
var mysql = require('mysql');

var TabulaModel = {
	
	currentView: "blog",	//default
	TabulaDB: new Object,	
	httpStatus: 200,	//default.  We're optimistic here.
	urlset: new Object,

	
	build: function (req){
		
		//Not setting these results in an interesting bug.  Long story short, memory leak.
		// it's worse in the view class.  Each page refresh takes up a couple kb.
		//  { url } = req; very important.  Gives info from the request directly.
		var { url } = req;
		TabulaModel.currentView = "blog";   //Stuff to figure out what were doing.
		TabulaModel.TabulaDB = { "" : "" }; //Our DB object.
		TabulaModel.httpStatus = 200;
		urlset = { "" : "" };		    //Clearing for memory leak reasons.
		
		
		//Taking ownership
		TabulaModel.urlset = url;
		
		//Formatting for what we're looking for.
		TabulaModel.parseurl();
		
		TabulaModel.TabulaDBConnect();

		TabulaModel.TabulaDB.end();
		return;
	},
	
	parseurl: function () {
		
		//This gives us the information we're looking for in an object, with some extra verbosity(true).
		TabulaModel.urlset = url.parse(TabulaModel.urlset, true);
		
		// Leading and trailing / will produce a blank spot in the array.
		// that's an if statement in filter, and I'm pretty sure it's performing black magic.
		// I had no idea how this worked the first time, and this solution is less pretty than
		// the original that I accidentally edited out.
		var path = TabulaModel.urlset.pathname.split("/").filter(x => x != "").toString();
		
		//split on the ,s toString throws in.
		path = path.split(",");
		
		//If we're in an array, take the first element. That's our path.
		//If we're not in an array, there was only one true god.
		if(Array.isArray(path)) path = path[0].toString();
		TabulaModel.currentView = path;

	
	},
	
	//Database connect method.
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
		//We're connected, move on to looking up what the user is looking for.
		TabulaModel.viewSearch(TabulaModel.currentView);
		
	},
	//Check the database to see if we can figure out what the user wants.
	viewSearch: function (path) {

		//Should probably start by stripping out any character
		// that could be used for SQL injection. NAHHHHHH --
		
		//We're purely matching the first element of our url,
		// the first /word/ past .com, to a view name.
		var query = "SELECT * FROM views WHERE viewname = \'"
		+path+"\';";
		
		//Query takes an anonymous callback function for result/error
		// I'd like to say being free of this super slow serialization is 
		// nice, but you really do end up having to be in an event driven
		// mindset.  If you need the data, you're stuck waiting for that
		// event to fire, and your code is not going anywhere.
		TabulaModel.TabulaDB.query(query, function (error, result, fields){
			
			if(error){console.log("Error: "+error);}
			
			//placeholder for result.
			var fixedviewname = 0;
			
			//see if we got a result without crashing the app
			try{
				fixedviewname = result[0].viewname;
			}catch(err){
				fixedviewname = 0;
			}
			
			//Have result, assign correct view to model.
			// if nothing found, we're 404
			if(fixedviewname){
				TabulaModel.currentView = fixedviewname;
				}else{
					TabulaModel.currentView = "404";
					TabulaModel.httpStatus = 404;
					}
			});
			
			//Something something event driven control flow.
			TabulaController.SQLComplete(TabulaModel.currentView);

	
		
	}
	
	
}

module.exports = TabulaModel;
