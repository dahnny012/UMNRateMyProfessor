var links = document.getElementsByTagName("a");
var size = links.length;
var pattern  = /http:\/\/www\.umn\.edu\/lookup\?/;
var MATCH = 0;

for(var i =0; i<size; i++){
	if(links[i].href.search(pattern) == MATCH){
		console.log(links[i].href)
	}
}

