var MATCH = 0;
var regex = /( [A-z]+\.?)/g;
var icon = chrome.extension.getURL("/icon.png");


function init(){
	var divs = document.getElementsByClassName("description");
	var size = divs.length;
	var pattern  = /http:\/\/www\.umn\.edu\/lookup\?/;
	
	for(var i =0; i<size; i++){
		var links = divs[i].getElementsByTagName("a");
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

function createInfoNode2(response){
    var prof = response.prof;
    if(prof == undefined)
        return blankNode();
    var profBox = 
    ["<div class='profBox'>",
        "<a class='profLink' href='","http://",prof["link"].replace(" ","")
        ,"' target=_blank>",
            "<div class='profName'>",prof.name,"</div>","</a>",
        "<div class='profMetricsWrapper'",
            "<div class='profMetricsHeader'>",
                "<div class='profScore'>Avg. Score</div>"
                ,"<div class='profAvgGrade'>Avg. Grade</div>"
            ,"</div>"
            ,"<div class='profMetric'>",
                "<div class='profScore metricScore'>",
                prof.metrics.rating
                ,"</div>"
                ,"<div class='profAvgGrade metricGrade'>",
                prof.metrics.avgGrade
                ,"</div>"
            ,"</div>",
            "<div class='showReviews'>Reviews</div>"
        ,"</div>",
        "<section class='reviewsWrapper'>"
        ]
        
        // Add reviews
        for(var review in prof.reviews){
            review = prof.reviews[review];
	        profBox.push("<div class='review'>");
	        profBox.push("<div class='reviewHeader'>");
	        profBox.push("<div class='reviewHeaderClass'>");
	        profBox.push(review.class);
	        profBox.push("<div class='reviewDate'>");
	        profBox.push(review.date);
	        profBox.push("</div></div><div class='reviewScore'>");
	        profBox.push(review.score);
	        profBox.push("</div></div>");
	        profBox.push("<div class='reviewText'>");
	        profBox.push(review.review);
	        profBox.push("</div>");
	        profBox.push("<div class='reviewTextBook'>")
	        profBox.push(review.textBook);
	        profBox.push("</div></div>");
        }
        
        // Finish
        profBox.push("</section>")
        profBox.push("</div>")
        return profBox.join();
        
    
}

function createInfoNode(response){
	var prof = response.prof;
    if(prof == undefined)
        return blankNode();
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

function blankNode() {
    var profBox = createDiv("profBox");
    var profName = createDiv("profName");
    profName.textContent = "No information found";
    var profLink = createDiv("profLink","a");
    var link = "http://ratemyprofessor.com";
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

