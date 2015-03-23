


function demo1(){


(function(){
    search();
}())


function search(){
  var max = 20;
  var offset = 0;
  while(offset <= max){
      getPage(undefined,offset);
      offset+= 20;
  }
 
}


function getPage(fn,offset){
  var url = "http://www.ratemyprofessors.com/search.jsp?query=university+of+minnesota+twin+cities&queryoption=HEADER&stateselect=&country=&dept=&queryBy=&facetSearch=&schoolName=&offset="+offset+"&max=20"
  needle.get(url, function(error, response) {
  if (!error && response.statusCode == 200){
     $ = cheerio.load(response.body);
     $("li[class='listing PROFESSOR']").each(function(i, elem) {
        var profPage = $(this).children("a").attr('href')
        var profName = $(this).find('.main').text();
        needle.get("http://www.ratemyprofessors.com"+profPage, function(error, response) {
            if (!error && response.statusCode == 200){
                 $ = cheerio.load(response.body);
                 console.log(profName);
                 console.log($(".grade").first().text())
            }
            else{
              console.log("ERROR")
              console.log(error)
              console.log(response.statusCode)
          }
        })
     });
  }
  else{
      console.log("ERROR")
      console.log(error)
      console.log(response.statusCode)
  }
});
}
    
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