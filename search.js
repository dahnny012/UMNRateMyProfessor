var needle = require('needle');
var cheerio = require('cheerio');

(function(){
  getPage(null,0);
}())


function search(){
  
}


function getPage(fn,offset){
  var url = "http://www.ratemyprofessors.com/search.jsp?query=university+of+minnesota+twin+cities&queryoption=HEADER&stateselect=&country=&dept=&queryBy=&facetSearch=&schoolName=&offset="+offset+"&max=20"
  needle.get(url, function(error, response) {
  if (!error && response.statusCode == 200){
     $ = cheerio.load(response.body);
     $("li[class='listing PROFESSOR']").each(function(i, elem) {
      console.log($(this).children("a").attr('href'))
      //console.log($(this).html());
     });
    //fn(response.body);
  }
});
}