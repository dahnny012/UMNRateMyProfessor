var MATCH = 0;
var regex = /( [A-z-]+\.?)/g;
var regexTime = /[0-9:]+ [APM\.]+/g;
var regexDate = /[MTWF]+[hu]*(,[MTWF]+[hu]*)*[^(A.M)^(P.M)]/;
var icon = chrome.extension.getURL("/icon.png");
var client = new XMLHttpRequest();
function init(){
	var divs = document.getElementsByClassName("description");
	var size = divs.length;
	var pattern  = /http:\/\/www\.umn\.edu\/lookup\?/;
	var dayKeys = ["M","Tu","W","Th","F"];
	for(var i =0; i<size; i++){
		var links = divs[i].getElementsByTagName("a");
		var times = divs[i].textContent;
		parseTime(times,dayKeys,divs[i]);

		var linkSize = links.length;
		for(var j=0; j<linkSize; j++) {
			if (links[j].href.search(pattern) == MATCH) {
				var profClass = getClassName(links[j]);
				var profName = links[j].text.replace(regex, "").replace(",", ", ");
				var node = createNode(profName, profClass);
				var target = links[j];
				target.parentNode.insertBefore(node, target.nextSibling);
			}
		}
	}
}
init();

function parseTime(text,keys,div){
	var time = text.match(regexTime);
	var date = text.match(regexDate);
	console.log(date);
	date = date[0].replace(/\n/,"");
	date = date.split(/,/);
	if(keys.indexOf(date[0]) == -1)
		return;
	console.log(date);
	chrome.runtime.sendMessage({msg: "schedule",date:date,time:time},
	function(response){
		div.color = "blue";
		// make color red/blue?
	});
}

function createNode(profName,profClass){
	var wrapper = document.createElement("div");
	var node = document.createElement("img");
	wrapper.appendChild(node);
	wrapper.style.display = "inline";
	wrapper.className = "profWrapper";
	node.className = "prof";
	node.setAttribute("width","24px");
	node.setAttribute("height","24px");
	node.src = icon;

	node.addEventListener("click",function(e){
		console.log(e.target.className);
		if(e.target.className == "prof"){
			if(e.target.clicked == undefined){
				e.target.clicked = true;
				var target = e.target.parentNode;
				sendMsg(profName,profClass,target);
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

function sendMsg(name,_class,target){
	console.log("Sending msg");
	chrome.runtime.sendMessage({msg: "ratemyprofessor",profName:name,profClass: _class},
	function(response){
		var node = 	createInfoNode(response,name);
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



function createInfoNode(response,_profName){
	var prof = response.prof;
    if(prof == undefined)
        return blankNode(_profName);
	var profBox = createDiv("profBox");
	var profName = createDiv("profName");
	profName.textContent = prof.name;
	var profLink = createDiv("profLink","a");
	var link = "http://"+prof["link"].replace(" ","");
	profLink.setAttribute("href",link);
	profLink.setAttribute("target","_blank");
	profLink.appendChild(profName);
	
	var profMetricsWrapper = createDiv("profMetricsWrapper");
	var profMetricsHeader = createDiv("profMetricsHeader");
	var profScore = createDiv("profScore");
	profScore.textContent = "Avg. Score";
	var profAvgGrade = createDiv("profAvgGrade");
	profAvgGrade.textContent ="Avg. Grade";
	var profMetric = createDiv("profMetric");
	var metricScore= createDiv("profScore metricScore");
	metricScore.textContent = prof.metrics.rating;
	var metricGrade = createDiv("profAvgGrade metricGrade");
	metricGrade.textContent = prof.metrics.avgGrade;
	var showReviews = createDiv("showReviews");
	showReviews.textContent = "Reviews";
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
	 	reviewHeaderClass.textContent = review.class;
	 	var reviewDate = createDiv("reviewDate");
	 	reviewDate.textContent = review.date;
	 	var reviewScore = createDiv("reviewScore");
	 	reviewScore.innherHtml = review.score;
	 	var reviewText = createDiv("reviewText");
	 	reviewText.textContent = review.review;
	 	var reviewTextBook = createDiv("reviewTextBook");
	 	reviewTextBook.textContent = review.textbook;
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

function blankNode(_name) {
	client.open("HEAD","http://umnratemyprofessor-dahnny012.c9.io/"+_name);
	client.send();
    var profBox = createDiv("profBox");
    var profName = createDiv("profName");
    profName.textContent = "No information found";
    var profLink = createDiv("profLink","a");
    var link = "http://www.ratemyprofessors.com/search.jsp?query="+(_name.replace(",","")).split(" ")[0]+"+"+"minnesota";
    profLink.setAttribute("href",link);
    profLink.setAttribute("target","_blank");
    profLink.appendChild(profName);
    var profMetricsWrapper = createDiv("profMetricsWrapper");
    var profMetricsHeader = createDiv("profMetricsHeader");
    var profScore = createDiv("profScore");
    profScore.textContent = "Avg. Score";
    var profAvgGrade = createDiv("profAvgGrade");
    profAvgGrade.textContent = "Avg. Grade";
    var profMetric = createDiv("profMetric");
    var metricScore= createDiv("profScore metricScore");
    metricScore.textContent = "N/A";
    var metricGrade = createDiv("profAvgGrade metricGrade");
    metricGrade.textContent = "N/A";
    var showReviews = createDiv("showReviews");
    showReviews.textContent = "Reviews";

    profBox.appendChild(profLink);
    profBox.appendChild(profMetricsWrapper);
    profMetricsWrapper.appendChild(profMetricsHeader);
    profMetricsWrapper.appendChild(profMetric);
    profMetricsWrapper.appendChild(showReviews);
    profMetricsHeader.appendChild(profScore);
    profMetricsHeader.appendChild(profAvgGrade);
    profMetric.appendChild(metricScore);
    profMetric.appendChild(metricGrade);

    return profBox;
}
