var icon = "http://icons.iconarchive.com/icons/wineass/ios7-redesign/512/Sample-icon.png";

function Parse(){
	this.iframe = document.getElementsByTagName("iframe")[0].
		contentWindow.document;
	if(this.iframe == null){
		console.log("Cant find iframe");
	}
}


Parse.prototype.run = function(){
	this.findProfessors(addButton);
	
	function addButton(node){
			var image = new Image();
			image.src = icon;
			image.style.width = "20px";
			image.style.height = "20px";
			image.className = "prof"; 
			node.appendChild(image);
			image.addEventListener("click",openRating);
	}
};



Parse.prototype.classTable = function(){
	// Look at Iframe
	// By some magic metric conclude were at classes
	var table = this.iframe.getElementById("win0divDERIVED_CLSRCH_GROUP6");
	if(table == null){
		console.log("Class table not found");
		return null;
	}
	return table;
};


Parse.prototype.findProfessors = function(cb){
	var classes = this.classTable();
	if(classes == null){
		return null;
	}
	var table = $(classes).find(".PSLEVEL3GRIDROW");
	var size = table.length;
	for(var i=0; i<size; i++){
		var profNode = professorFilter(table[i]);
		if(profNode){
			cb(profNode);
		}
	}
	
	function professorFilter(node){
		var profNode = $(node).find("span")[0];
		
		if(profNode === undefined || profNode.id.indexOf("MTG_INSTR") < 0){
			return false;
		}
		return profNode;
	};
};




function openRating(e){
	if(e.target.className === "prof"){
			var node = createInfoNode(prof);
	}
}

function sendMsg(name,_class,target){
	chrome.runtime.sendMessage({msg: "ratemyprofessor",profName:name,profClass: _class},
	function(response){
		var node = 	createInfoNode(response,name);
		target.appendChild(node);
	});
}

chrome.runtime.onMessage.addListener(
	function(request,sender,sendResponse){
		var parse = new Parse();
		parse.run();
	}
);



/*
For testing on the page,
var frame = document.getElementsByTagName("iframe")[0]
var classes =frame.contentWindow.document.getElementById("win0divDERIVED_CLSRCH_GROUP6")
var script=document.createElement('script');
script.src = "http://code.jquery.com/jquery-latest.min.js";
document.body.appendChild(script);
*/