//View engine

var TabulaView = {
	
		head : new Array(),
		headtag : "",
		scripts : [[]],
		body : "",
		path : "",
		waitforsql : 0,
		
	build: function (){
		
		//Must clean variables here. MUST.  Things WILL get nasty.
		TabulaView.head = "";		//For our headers
		TabulaView.headtag = "";	//HTML head output container
		TabulaView.scripts = [[]];	//Do I even use this anymore?
		TabulaView.body = "";		//Body container. TBA
		TabulaView.path = "view\\" + TabulaModel.currentView;
		TabulaView.waitforsql = 0;	//0 if we're doing fine without DB read
						//1 if we cant figure things out without DB read
		



	},
	
	//Collect files from directory base on name
	//This function should be moved to model.
	fetchScripts: function (deeppath){
		
		//deeppath will usually be 'script' or 'css'
		var type = deeppath;
		deeppath = "/" + deeppath + "/";
		
		var items = [];
		
		//If this works, there's files.  If not, no worries.
		try{items = fs.readdirSync(TabulaView.path + deeppath)
		}catch(e){ return;}
			
			
			
			if(!items){
				
				return;
			}

			return items;
			

	},
	
	//This function needs to be split up and moved partly to model and partly to controller.
	printHeadTag: function() {
		
		TabulaView.headtag += "<link rel=\"icon\" type=\"image/gif\" href=\"/favicon.ico\">"
		
		//We can can fetch for different file types/directorys using a config.
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
				
				//push out JS files to buffer for sending to client.
				if(key == 'scripts'  && pscripts[key] != undefined){
					for(var i = 0; i < pscripts[key].length; i++){
					TabulaView.headtag += "<script src=/view/"+ TabulaModel.currentView
					+ "/" + pscripts[key][i] + "></script>";
					}
				}
				//CSS files to head buffer
				if(key == 'css'  && pscripts[key] != undefined){
						
					for(var i = 0; i < pscripts[key].length; i++){
						TabulaView.headtag += "<link rel=\"stylesheet\""+ TabulaModel.currentView
						+ "/" + pscripts[key][i] + "></script>";
					}
				}
				//images to head buffer... 3 types was easier to debug.
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
