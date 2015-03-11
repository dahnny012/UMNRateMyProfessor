


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