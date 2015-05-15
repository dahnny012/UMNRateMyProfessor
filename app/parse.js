function Parse(){
	this.iframe = document.getElementsByTagName("iframe")[0].
		contentWindow.document;
	if(this.iframe == null){
		console.log("Cant find iframe");
	}
}


Parse.prototype.run = function(){
	this.findProfessors();
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


Parse.prototype.findProfessors = function(){
	var classes = this.classTable();
	if(classes == null){
		return null;
	}
	var table = $(classes).find(".PSLEVEL3GRIDROW");
	var professors = table.filter(professorFilter);

};

function professorFilter(node){
	var profNode = $(node).find("span");
	if(profNode.id.indexOf("MTG_INSTR") < 0){
		return;
	}
};

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