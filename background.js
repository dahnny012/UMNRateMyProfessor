var professors = {};


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.msg == "ratemyprofessor"){
        var prof = getProfessor(request);
        sendResponse({prof: prof});
    }
});


function getProfessor(request){
  var profName = request.profName.replace(/PHD\./,"").replace(/, /,",");
  var profClass = request.profClass;
  var prof = professors[profName];
  if(prof == undefined)
    return;
  if(prof.length > 1){
    // Get one that teaches that classes if their are people with the same names
    for(var i=0; i<prof.length; i++){
      if(prof[i].classes[profClass] != undefined){
        return prof[i];
      }
    }
  }
  return prof[0];
}

