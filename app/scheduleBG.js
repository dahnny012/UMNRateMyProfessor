var schedule = {};


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.msg == "syncSchedule"){
        schedule = request.schedule;
        console.log(schedule);
    }
    else if (request.msg == "getSchedule"){
        sendResponse({schedule: schedule});
    }
});
