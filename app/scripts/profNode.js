function ProfNodeFactory(){

}

ProfNodeFactory.prototype.icon = chrome.extension.getURL("assets/icon.png");


ProfNodeFactory.prototype.buttonNode = function(obj){
	var image = new Image();
	image.src = this.icon;
	image.style.width = "20px";
	image.style.height = "20px";
	image.className = "prof";
	image.addEventListener("click",obj.handler);
	return image;
};

ProfNodeFactory.prototype.infoNode = function(prof){
	if(prof === undefined)
		return this.blankNode();
        
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
	var reviewsWrapper = createDiv("reviews","section");
	
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
	
	this.addReviewNode(prof,reviewsWrapper);
	return profBox;
};


ProfNodeFactory.prototype.addReviewNode = function(prof,reviewsWrapper){
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
};

ProfNodeFactory.prototype.blankNode = function(){
	var _name = "";
	//client.open("HEAD","http://umnratemyprofessor-dahnny012.c9.io/"+_name);
	//client.send();
    var profBox = createDiv("profBox");
    profBox.id = "profBox";
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
};


function reviewsHandler(e){
	var parent = e.target.parentElement.parentElement;
    if(e.target.clicked === undefined){
    	e.target.clicked = true;
        parent.setAttribute("style","height:auto"); 
    }else{
        e.target.clicked = undefined;
        parent.setAttribute("style","height:105px"); 
    }
}

function createDiv(_class,tag){
	if(tag === undefined)
		tag = "div";
	var node = document.createElement(tag);
	node.className = _class;
	return node;
}

