var needle = require('needle');
var cheerio = require('cheerio');



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
      var max = 20;
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
                    var grade = getGrade($)
                    var classes = getClasses($);
                    var prof = createProf(profName,grade,classes);
                    var review = getScores($);
                    addProf(prof,table)
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
           console.log(label + " " + score);
       });
   }
   
    function getReviews(){
        var reviews = $(".tftable").find("tr").slice(1);
        if(reviews.length == 0)
            return;
        var counter = 3;
        var i = 0;
        var size=  reviews.length;
        
        var reviewsTable = {}
        while(counter && reviews == i){
            var query = $(reviews[i])
            var _class = query.find(".name").find(".response").text().toUpperCase().replace(/ /,'','g');
            // Check if already been reviewed
            if(reviewsTable[_class] == undefined){
                counter--;
                var textbook = query.find(".textbook-use").text();
                var avg;
                query.find(".score").each(function(i,ele){
                    avg += parseInt($(this).text());
                    count++;
                })
                avg = avg/3;
                var review = query.find(".comments").find("p").text()
            }
        }
   }
   
   
  
   function createProf(name,grade,classes){
       return {
           "name":name,
           "grade":grade,
           "classes":classes
       }
   }
   
   function addProf(prof,table){
       if(table[prof.name] === undefined){
           table[prof.name] = [prof]
       }else{
           table[prof.name].push(prof)
       }
   }
   search();
}

demo2()