var links = document.getElementsByTagName("a");
var size = links.length;
var pattern  = /http:\/\/www\.umn\.edu\/lookup\?/;
var MATCH = 0;
var regex = /( [A-z]+\.?)/g;


for(var i =0; i<size; i++){
	if(links[i].href.search(pattern) == MATCH){
		var className = getClassName(links[i]);
		var profName = links[i].text.replace(regex,"").replace(",",", ");
		var node = createNode(profName,className);
		var target = links[i];
		target.parentNode.insertBefore(node, target.nextSibling);
	}
}

//var testResponse = {prof:testProf};


function createNode(profName,className){
	var wrapper = document.createElement("div");
	var node = document.createElement("img");
	wrapper.appendChild(node);
	wrapper.style.display = "inline";
	wrapper.className = "profWrapper";
	node.className = "prof";
	node.setAttribute("width","20px");
	node.setAttribute("height","20px");
	node.src ="http://icons.iconarchive.com/icons/wineass/ios7-redesign/512/Sample-icon.png";

	node.addEventListener("click",function(e){
		console.log(e.target.className);
		if(e.target.className == "prof"){
			if(e.target.clicked == undefined){
				e.target.clicked = true;
				var target = e.target.parentNode;
				sendMsg(profName,className,target);
			}else{
				e.target.clicked = undefined;
				removeNode(e)
			}
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

function createDiv(_class,tag){
	if(tag === undefined)
		tag = "div";
	var node = document.createElement(tag);
	node.className = _class;
	return node;
}

function addText(div,text){
    var textNode = document.createTextNode(text);
    div.appendChild(textNode);
}

function sendMsg(name,_class,target){
	console.log("Sending msg");
	chrome.runtime.sendMessage({msg: "ratemyprofessor",profName:name,profClass: _class}, 
	function(response){
		var node = 	createInfoNode(response);
		target.appendChild(node);
	});
};

function reviewsHandler(e){
	var parent = e.target.parentElement.parentElement;
    if(e.target.clicked == undefined){
    	e.target.clicked = true;
        parent.setAttribute("style","height:auto"); 
    }else{
        e.target.clicked = undefined;
        parent.setAttribute("style","height:105px"); 
    }
}

function getClassName(node){
	var parent = node;
	for(var i=0; i<5; i++){
		parent = parent.parentNode;
	}
	if(i==5){
		parent = parent.childNodes[5].childNodes[1].data;
		parent = parent.match(/[A-z]+/)[0]+parent.match(/[0-9]+/)[0];
	}else{
		return "";
	}
	return parent
}

function createInfoNode(response){
	var prof = response.prof;
	var profBox = createDiv("profBox");
	var profName = createDiv("profName");
	addText(profName,prof.name);
	var profLink = createDiv("profLink","a");
	var link = "http://"+prof["link"].replace(" ","");
	profLink.setAttribute("href",link);
	profLink.setAttribute("target","_blank");
	profLink.appendChild(profName);
	
	var profMetricsWrapper = createDiv("profMetricsWrapper");
	var profMetricsHeader = createDiv("profMetricsHeader");
	var profScore = createDiv("profScore");
	addText(profScore,"Avg. Score");
	var profAvgGrade = createDiv("profAvgGrade");
	addText(profAvgGrade,"Avg. Grade");
	var profMetric = createDiv("profMetric");
	var metricScore= createDiv("profScore metricScore");
	addText(metricScore,prof.metrics.rating);
	var metricGrade = createDiv("profAvgGrade metricGrade");
	addText(metricGrade,prof.metrics.avgGrade);
	var showReviews = createDiv("showReviews");
	addText(showReviews,"Reviews");
	showReviews.addEventListener("click",reviewsHandler);
	var reviewsWrapper = createDiv("reviews","section")
	
	profBox.appendChild(profLink);
	profBox.appendChild(profMetricsWrapper);
	profBox.appendChild(reviewsWrapper);
	profMetricsWrapper.appendChild(profMetricsHeader);
	profMetricsWrapper.appendChild(profMetric);
	profMetricsWrapper.appendChild(showReviews);
	profMetricsHeader.appendChild(profScore);
	profMetricsHeader.appendChild(profAvgGrade);
	profMetric.appendChild(metricScore);
	profMetric.appendChild(metricGrade);
	
	
	for(var review in prof.reviews){
	    review = prof.reviews[review];
		var reviewNode = createDiv("review");
	 	var reviewHeader = createDiv("reviewHeader");
	 	var reviewHeaderClass = createDiv("reviewHeaderClass");
	 	addText(reviewHeaderClass,review.class);
	 	var reviewDate = createDiv("reviewDate");
	 	addText(reviewDate,review.date);
	 	var reviewScore = createDiv("reviewScore");
	 	addText(reviewScore,review.score);
	 	var reviewText = createDiv("reviewText");
	 	addText(reviewText,review.review);
	 	var reviewTextBook = createDiv("reviewTextBook");
	 	addText(reviewTextBook,review.textbook);
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


