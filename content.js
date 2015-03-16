var links = document.getElementsByTagName("a");
var size = links.length;
var pattern  = /http:\/\/www\.umn\.edu\/lookup\?/;
var MATCH = 0;
var regex = /( [A-z]+\.?)/g;
var classRegex = /([A-Z]+(.)+[0-9]+)/;
var testProf = {"name":"Driessen, Michelle","metrics":{"rating":"4.0","avgGrade":"B-","scores":["Helpfulness 4.0","Clarity 4.0","Easiness 2.8"]},"classes":{"1061":"1061","10 62":"1062","CHEM1061":"CHEM1061","CHEM1021":"CHEM1021","CHEM1015":"CHEM1015","CHEM1065":"CHEM1065","CHEM1062":"CHEM1062","CHEMISTY":"CHEMISTY","CHEM1601":"CHE M1601"},"reviews":{"1061":{"class":"1061","date":" 02/17/2015","textbook":"Textbook Use: What textbook?","score":"4.33","review":" \r\n\t She' s the only teacher that I've been able to pass chemistry with. She is amazing and I would take her class any day. \r\n\t "},"CHEM 1061":{"class" :"CHEM 1061","date":" 01/15/2015","textbook":"Textbook Use: What textbook?","score":"3.33","review":" \r\n\t Her videos are nice and easy to u nderstand, but during her actual lectures she does not teach at all. You just do homework for an hour with a small group. In my opinion she thinks too highly of herself. \r\n\t "},"CHEM 1021":{"class":"CHEM 1021","date":" 12/04/2014","textbook":"Textbook Use: Essential to passing","score":"3.33","review":" \r\n\t Driessen does her best to explain concepts clearly and I thought she did a good job of it. She definitely wants you to succeed an d if you go talk to her outside of class, she's really helpful. I definitely recommend her as a prof! \r\n\t "}},"link":"www.ratemyprofessors.com /ShowRatings.jsp?tid=260962"};

for(var i =0; i<size; i++){
	if(links[i].href.search(pattern) == MATCH){
		var className = getClassName(links[i]);
		var profName = links[i].text.replace(regex,"").replace(",",", ");
		var node = createNode(profName);
		var target = links[i];
		target.parentNode.insertBefore(node, target.nextSibling);
	}
}

var testResponse = {prof:testProf};


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

	node.addEventListener("click",function(e){
		console.log(e.target.className);
		if(e.target.className == "prof"){
			if(e.target.clicked == undefined){
				e.target.clicked = true;
				var infoNode = createInfoNode(testResponse);
				e.target.parentNode.appendChild(infoNode);
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

function sendMsg(name,_class){
	chrome.runtime.sendMessage({greeting: "hello",profName:name,profClass: _class}, 
	createInfoNode);
}

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
		parent = parent.substr(classRegex);
		console.log(parent);
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


