function Parse(){
	this.iframe = document.getElementsByTagName("iframe")[0].
		contentWindow.document;
	if(this.iframe == null){
		console.log("Cant find iframe");
	}
}


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
	var profs = [];
	for(var i=0; i<size; i++){
		var profNode = this.professorFilter(table[i]);
		if(profNode){
			profs.push(profNode);
		}
	}
	
	return profs;
};

Parse.prototype.professorFilter=function(node){
	var profNode = $(node).find("span")[0];
	
	if(profNode === undefined || profNode.id.indexOf("MTG_INSTR") < 0){
		return false;
	}
	return profNode;
};






/*
For testing on the page,
var frame = document.getElementsByTagName("iframe")[0]
var classes =frame.contentWindow.document.getElementById("win0divDERIVED_CLSRCH_GROUP6")
var script=document.createElement('script');
script.src = "http://code.jquery.com/jquery-latest.min.js";
document.body.appendChild(script);
*/