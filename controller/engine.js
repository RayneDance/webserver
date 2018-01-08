//Controller engine.


 var TabulaController = {
	 
	//entry point. Main()ish.
	build: function (req, res,) {
		
		//Line 1: Abandon ship and build the Model.
		TabulaModel.build(req);
		
		//This looks nicer, but is silly.
		var l = "/";
		
		//Init view, and set view path to what we believe is the current view.
		TabulaView.build();
		TabulaView.path = globals.DOCROOT + "view/"+ TabulaModel.currentView;
		
		//This looks odd, but this is exactly what a controller does.
		TabulaView.head[0] = TabulaModel.httpStatus;

	},
	//This is called after our database read completes. Our view attemptes to figure out what's going
	// on without the database read, but it can only do so much.  Especially if we're viewing the blog.
	SQLComplete: function(view){
		
		//If we already figured it out before IO could help us, just move on with life.
		if(!TabulaView.waitforsql){
			return; 
			}
		
		//It's possible we made it here without pushing 500 status. This is bad.
		TabulaView.head[0] = TabulaModel.httpStatus;
		
		//Some logic will go here later.
	}
}

module.exports = TabulaController;

