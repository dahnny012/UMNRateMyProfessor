function ProfNodeFactory(){

}

ProfNodeFactory.prototype.icon = "http://icons.iconarchive.com/icons/wineass/ios7-redesign/512/Sample-icon.png";
;

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
};


ProfNodeFactory.prototype.reviewNode = function(){
	
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


function createDiv(_class,tag){
	if(tag === undefined)
		tag = "div";
	var node = document.createElement(tag);
	node.className = _class;
	return node;
}