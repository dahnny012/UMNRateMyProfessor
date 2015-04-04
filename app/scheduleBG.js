var schedule = {};

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.msg == "schedule"){
        var conflict = getConflict(request);
        sendResponse({conflict: conflict});
    }
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.msg == "syncSchedule"){
        schedule = request.schedule;
        console.log(schedule);
    }
});



function getConflict(request){
	var dateSize = request.date.length;
  for(var i=0; i<dateSize; i++){
	  var day = request.date[i];
	  if(day === "Tu"){
		day = "T";
	  }
	if(schedule[day] !== undefined){
		var time = timeToNumber(request.time);
		var numTimes = schedule[day].length;
		console.log(day);
		for(var j=0; j<numTimes; j++){
			currentTime = schedule[day][j];
			console.log(currentTime);
			console.log(time);
			if(checkBetween(currentTime,time)){
				return true;
			}
		}
	}
  }
  return false;
}

function timeToNumber(time){
    var start = time[0].match(/[0-9]+/g);
    var startOffset = time[0].search(/p.m./i);
    start = parseInt(start.join(""));
    if(startOffset != -1 && (start % 1200) > 59)
        start  += 1200;
    var end = time[1].match(/[0-9]+/g);
    var endOffset = time[1].search(/p.m./i);
    end = parseInt(end.join(""));
    if(endOffset != -1 && (end % 1200) > 59)
        end += 1200;
    return {	
	"start":start,
    "end":end
	}
}

function checkBetween(time1,time2){
	return (time1.start >= time2.start && time1.start <= time2.end) ||
           (time1.end >= time2.start  && time1.end <= time2.end) ||
           (time1.start <= time2.start && time1.end >= time2.end);   
}


