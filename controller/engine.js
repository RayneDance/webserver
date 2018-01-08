//Controller engine.


 var TabulaController = {
	 
	
	build: function (req, res,) {
		
		TabulaModel.build(req);

		var l = "/";
		TabulaView.build();
		TabulaView.path = globals.DOCROOT + "view/"+ TabulaModel.currentView;

		TabulaView.head[0] = TabulaModel.httpStatus;

	},
	
	SQLComplete: function(view){
		
		if(!TabulaView.waitforsql){
			return; 
			}	
		
		TabulaView.head[0] = TabulaModel.httpStatus;
	}
}

module.exports = TabulaController;

