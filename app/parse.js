function Parse(){
	this.iframe = document.getElementsByTagName("iframe")[0].
		contentWindow.document;
}


Parse.prototype.run = function(){
	this.findProfessors();
}



Parse.prototype.classTable = function(){
	// Look at Iframe
	// By some magic metric conclude were at classes
	var table = this.iframe.getElementByID("win0divDERIVED_CLSRCH_GROUP6");
	if(table == null){
		return null;
	}
	return table;
};


Parse.prototype.findProfessors = function(){
	var classes = this.classTable();
	if(classes == null)
		return null;
	var professors = $(classes).find("th[abbr='Instructor']");
	console.log(professors);
};

chrome.runtime.onMessage.addListener(
	function(request,sender,sendResponse){
		console.log("Curse the world");
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