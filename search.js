var needle = require('needle');
var cheerio = require('cheerio');



function demo2(){
    var http = require('http');
    http.globalAgent.maxSockets = 1000;
    var table = {}


    function getPage(fn,options){
        
        var callback = function(response) {
          var body = '';
          response.on('data', function (chunk) {
            body += chunk;
          });
        
          //the whole response has been recieved, so we just print it out here
          response.on('end', function () {
             fn(body);
          });
          
          response.on('error',function(){
              console.log("ERRORED OUT");
          });
        }
        
         http.request(options, callback).end();
    }
    
   function search(fn){
      var max = 100;
      var offset = 0;
      var finished = 0;
      while(offset <= max){
          var options = {
          host: 'www.ratemyprofessors.com',
          path: '/search.jsp?query=university+of+minnesota+twin+cities&queryoption=HEADER&stateselect=&country=&dept=&queryBy=&facetSearch=&schoolName=&offset='+offset+'&max=20'
        };
        offset += 20;
        getPage(function(body){$ = cheerio.load(body);
             $("li[class='listing PROFESSOR']").each(function(i, elem) {
                 var profPage = $(this).children("a").attr('href')
                 var profName = $(this).find('.main').text();
                 var profOptions = {
                  host: 'www.ratemyprofessors.com',
                  path: profPage
                };
                
                getPage(function(body){
                    $ = cheerio.load(body);
                    //console.log(profName);
                    var avgGrade = getGrade($);
                    var rating = getRating($);
                    var classes = getClasses($);
                    var scores = getScores($);
                    var reviews = getReviews($);
                    var metrics = {"rating":rating,"avgGrade":avgGrade,"scores":scores};
                    var prof = createProf(profName,classes,metrics,reviews);
                    addProf(prof,table)
                    console.log(prof);
                },profOptions);
             })
        },
        options)
      }
   }
   
   function getClasses($){
       var classes = {};
       
       $(".tftable").find(".name").each(function(i,elem){
           var _class = $(this).find(".response").text().toUpperCase().replace(/ /,'','g');
           classes[_class] = _class;
       });
       return classes;
   }
   
   function getGrade($){
       var grade = $(".grade").slice(1).first().text();
       return grade;
   }
   function getRating($){
       var grade = $(".grade").first().text();
       return grade;
   }
   
   function getScores($){
       var sliders = $(".faux-slides").find(".rating-slider");
       var scores = [];
       sliders.each(function(i,ele){
           var label = $(this).find(".label").text();
           var score = $(this).find(".rating").text();
           scores.push(label + " " + score);
           //console.log(label + " " + score);
       });
       
       return scores
   }
   
    function getReviews(){
        var reviews = $(".tftable").find("tr").slice(1);
        if(reviews.length == 0){
            console.log("quitting")
            return;
        }
        var count = 3;
        var i = 0;
        var size=  reviews.length;
        
        var reviewsTable = {};
        while(count > 0 && reviews.length != i){
            var query = $(reviews[i])
            var _class = query.find(".name").find(".response").text().toUpperCase()
            //console.log("class: " + _class);
            // Check if already been reviewed
            if(reviewsTable[_class] == undefined && _class != ''){
                var review = {};
                var date = query.find(".date").text();
                count--;
                var textbook = query.find(".textbook-use").text();
                var avg = 0;
                query.find(".score").each(function(i,ele){
                    var score = parseInt($(this).text());
                    avg+= score;
                });
                avg = (avg/3).toFixed(2);
                var reviewText = query.find(".comments").find("p").text()
                review["date"] =  date;
                review["textbook"] = textbook;
                review["score"] = avg;
                review["review"] = reviewText;
                reviewsTable[_class] = review;
            }else{
                //console.log("reject");
            }
            i++;
        }
        return reviewsTable;
   }
   
  
   function createProf(name,classes,metrics,reviews){
       return {
           "name":name,
           "metrics":metrics,
           "classes":classes,
           "reviews":reviews
       }
   }
   
   function addProf(prof,table){
       if(table[prof.name] === undefined){
           table[prof.name] = [prof]
       }else{
           table[prof.name].push(prof)
       }
   }
   
   function searchProfessor(){
      var options = {
          host: 'www.ratemyprofessors.com',
          path: '/ShowRatings.jsp?tid=897321'
        };

        getPage(function(body){
            $ = cheerio.load(body);
            var avgGrade = getGrade($);
            var rating = getRating($);
            var classes = getClasses($);
            var scores = getScores($);
            var reviews = getReviews($);
            var metrics = {"rating":rating,"avgGrade":avgGrade,"scores":scores};
            var prof = createProf("Thomas Holmes",classes,metrics,reviews);
            addProf(prof,table)
            console.log(prof);
        },options);
   }
   search();
   //searchProfessor();
}

demo2()




