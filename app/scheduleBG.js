var schedule = {};

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.msg == "schedule"){
        var conflict = getConflict(request);
        sendResponse({conflict: conflict});
    }
});



function getConflict(request){
  // Check for each day in request
  
  // Check schedule.between(request)
    // if true
}



