//View engine

var TabulaView = {
	
		head : new Array(),
		headtag : "",
		scripts : [[]],
		body : "",
		path : "",
		waitforsql : 0,
		
	build: function (){
		TabulaView.head = "";
		TabulaView.headtag = "";
		TabulaView.scripts = [[]];
		TabulaView.body = "";
		TabulaView.path = "view\\" + TabulaModel.currentView;
		TabulaView.waitforsql = 0;
		



	},
	
	//Collect file from directory
	fetchScripts: function (deeppath){
		var type = deeppath;
		deeppath = "/" + deeppath + "/";
		
		var items = [];
		
		try{items = fs.readdirSync(TabulaView.path + deeppath)
		}catch(e){ return;}
			
			
			
			if(!items){
				
				return;
			}

			return items;
			

	},
	
	printHeadTag: function() {
		
		TabulaView.headtag += "<link rel=\"icon\" type=\"image/gif\" href=\"/favicon.ico\">"
		
		try{config = JSON.parse(fs.readFileSync(TabulaView.path + "/config.json"))
		}catch(e){ config = ["script", "css", "images"];}
		
		var pscripts = {};
		
		for (var key in config){
			if(config.hasOwnProperty(key)) {
				if(key != 'title'){
					pscripts[config[key]] = TabulaView.fetchScripts(config[key]);
				}
			}
		}
		
		
		
		TabulaView.headtag += "<head>";

		for(var key in pscripts){
			if(pscripts.hasOwnProperty(key)) {
				console.log(key);
				if(key == 'scripts'  && pscripts[key] != undefined){
					for(var i = 0; i < pscripts[key].length; i++){
					TabulaView.headtag += "<script src=/view/"+ TabulaModel.currentView
					+ "/" + pscripts[key][i] + "></script>";
					}
				}
			
				if(key == 'css'  && pscripts[key] != undefined){
						
					for(var i = 0; i < pscripts[key].length; i++){
						TabulaView.headtag += "<link rel=\"stylesheet\""+ TabulaModel.currentView
						+ "/" + pscripts[key][i] + "></script>";
					}
				}
				
				if(key == 'images' && pscripts[key] != undefined){
					for(var i = 0; i < pscripts[key].length; i++){
						TabulaView.headtag += "<link type=\"image/gif\" href=\""+ TabulaModel.currentView
						+ "/" + pscripts[key][i] + "></script>";
					}
				}
			}
		}
		TabulaView.headtag += "</head>";
		return TabulaView.headtag;
		
	}
	
}

module.exports = TabulaView;