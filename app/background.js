chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.msg == "ratemyprofessor"){
        var prof = getProfessor(request);
        sendResponse({prof: prof});
    }
});


function getProfessor(request){
   console.log(request.profName);
   console.log(request.profClass);
  var prof = profs[request.profName];
  if(prof == undefined){
  	  console.log("Professor doesnt exist");
    return;
  }
  if(prof.length > 1){
  	  console.log("Professor with same names");
    for(var i=0; i<prof.length; i++){
      if(prof[i].classes[request.profClass] != undefined){
        return prof[i];
      }
    }
  }
  console.log("found a professor");
  return prof[0];
}

var testProfessor = {"name":"Driessen, Michelle","metrics":{"rating":"4.0","avgGrade":"B-","scores":["Helpfulness 4.0","Clarity 4.0","Easiness 2.8"]},"classes":{"1061":"1061","1062":"1062","CHEM1061":"CHEM1061","CHEM1021":"CHEM1021","CHEM1015":"CHEM1015","CHEM1065":"CHEM1065","CHEM1062":"CHEM1062","CHEMISTY":"CHEMISTY","CHEM1601":"CHEM1601"},"reviews":{"1061":{"class":"1061","date":" 02/17/2015","textbook":"Textbook Use: What textbook?","score":"4.33","review":" \r\n\t                 She's the only teacher that I've been able to pass chemistry with. She is amazing and I would take her class any day.  \r\n\t              "},"CHEM 1061":{"class":"CHEM 1061","date":" 01/15/2015","textbook":"Textbook Use: What textbook?","score":"3.33","review":" \r\n\t                 Her videos are nice and easy to understand, but during her actual lectures she does not teach at all. You just do homework for an hour with a small group. In my opinion she thinks too highly of herself.  \r\n\t              "},"CHEM 1021":{"class":"CHEM 1021","date":" 12/04/2014","textbook":"Textbook Use: Essential to passing","score":"3.33","review":" \r\n\t                 Driessen does her best to explain concepts clearly and I thought she did a good job of it. She definitely wants you to succeed and if you go talk to her outside of class, she's really helpful. I definitely recommend her as a prof! \r\n\t              "}},"link":"www.ratemyprofessors.com/ShowRatings.jsp?tid=260962"};
