var links = document.getElementsByTagName("a");
var size = links.length;
var pattern  = /http:\/\/www\.umn\.edu\/lookup\?/;
var MATCH = 0;

for(var i =0; i<size; i++){
	if(links[i].href.search(pattern) == MATCH){
		var node = createNode();
		var target = links[i];
		target.parentNode.insertBefore(node, target.nextSibling);
	}
}


function createNode(){
	var wrapper = document.createElement("div");
	var node = document.createElement("img");
	wrapper.appendChild(node);
	node.className = "prof";
	node.style.display = "inline";
	node.setAttribute("width","20px");
	node.setAttribute("height","20px");
	node.src ="http://icons.iconarchive.com/icons/wineass/ios7-redesign/512/Sample-icon.png"

	wrapper.addEventListener("click",function(e){
		console.log("execute");
		var box = document.createElement("div");
		box.className = "profBox";
		e.target.appendChild(box);
	},true);
	
	wrapper.addEventListener("mouseout",function(e){
		var target = e.target;
		if(target.className != "profBox")
			return;
		var parent = target.parentElement;
		parent.removeChild(parent.childNodes[0]); 
	},true);
	
	return wrapper;
}

