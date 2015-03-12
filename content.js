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
	wrapper.style.display = "inline";
	wrapper.className = "profWrapper";
	node.className = "prof";
	node.setAttribute("width","20px");
	node.setAttribute("height","20px");
	node.src ="http://icons.iconarchive.com/icons/wineass/ios7-redesign/512/Sample-icon.png";

	wrapper.addEventListener("click",function(e){
		console.log(e.target.clicked);
		if(e.target.clicked == undefined){
			var box = document.createElement("span");
			box.className = "profBox";
			box.style.display = "inline";
			box.setAttribute("style","position:absolute;\
			height:200px;width:300px;background:black");
			e.target.clicked = true;
			e.target.parentElement.appendChild(box);
		}else{
			e.target.clicked = undefined;
			removeNode(e)
		}
	},true);
	return wrapper;
}


function removeNode(e){
	var target = e.target;
	var parent = target.parentElement;
	if(parent.childNodes.length > 1)
		parent.removeChild(parent.childNodes[1]); 
}


function createInfoNode(response){
	var prof = response.prof;
	var profBox = document.createElement("div");
	profBox.className = "profBox";
	var profName = document.createElement("div");
	profName.className = "profName";

	
	profBox.appendChild(profName);
	var metricsWrapper = document.createElement("div");
	var metricsHeader = document.createElement("div");
	var profScore = document.createElement("div");
	var profAvgGrade = document.createElement("div");
	var profMetric = document.createElement("div");
	var metricScore= document.createElement("div");
	var metricGrade = document.createElement("div");
	var reviewsWrapper = document.createElement("section");
	var reviews = [];
	// For each review
		var review = document.createElement("div");
	 	var reviewHeaderInfo = document.createElement("div");
	 	var reviewHeaderScore = document.createElement("div");
	 	
	return profBox;
}


function sendMsg(name,_class){
	chrome.runtime.sendMessage({greeting: "hello",profName:name,profClass: _class}, 
	createInfoNode);
}