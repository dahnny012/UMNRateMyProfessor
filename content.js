var links = document.getElementsByTagName("a");
var size = links.length;
var pattern  = /http:\/\/www\.umn\.edu\/lookup\?/;
var MATCH = 0;
var regex = /( [A-z]+\.?)/

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
	var profBox = createDiv("profBox");
	var profName = createDiv("profName");
	var profMetricsWrapper = createDiv("profMetricsWrapper");
	var profMetricsHeader = createDiv("profMetricsHeader");
	var profScore = createDiv("profScore");
	var profAvgGrade = createDiv("profAvgGrade");
	var profMetric = createDiv("profMetric");
	var metricScore= createDiv("profScore metricScore");
	var metricGrade = createDiv("profAvgGrade metricGrade");
	var showReviews = createDiv("showReviews");
	
	profBox.appendChild(profName);
	profBox.appendChild(profMetricsWrapper);
	profBox.appendChild(profMetric);
	profMetricsWrapper.appendChild(profMetricsHeader);
	profMetricsWrapper.appendChild(profMetric);
	profMetricsWrapper.appendChild(showReviews);
	profMetricsHeader.appendChild(profScore);
	profMetricsHeader.appendChild(profAvgGrade);
	profMetric.appendChild(metricScore);
	profMetric.appendChild(metricGrade);
	
	var reviews = prof.reviews;
	var reviewsWrapper = createDiv("reviews","section")

	for(var review in reviews){
		var reviewNode = createDiv("review");
	 	var reviewHeader = createDiv("reviewHeader");
	 	var reviewHeaderClass = createDiv("reviewHeaderClass");
	 	var reviewDate = createDiv("reviewDate");
	 	var reviewScore = createDiv("reviewScore");
	 	var reviewText = createDiv("reviewText");
	 	var reviewTextBook = createDiv("reviewTextBook");
	 	reviewsWrapper.appendChild(reviewNode);
	 	reviewNode.appendChild(reviewHeader);
	 	reviewNode.appendChild(reviewText);
	 	reviewNode.appendChild(reviewTextBook);
	 	reviewHeader.appendChild(reviewHeaderClass);
	 	reviewHeaderClass.appendChild(reviewDate);
	 	reviewHeader.appendChild(reviewScore);
	
	}
	return profBox;
}

function createDiv(_class,tag){
	if(tag === undefined)
		tag = "div";
	var node = document.createElement(tag);
	node.className = _class;
	return node;
}


function sendMsg(name,_class){
	chrome.runtime.sendMessage({greeting: "hello",profName:name,profClass: _class}, 
	createInfoNode);
}