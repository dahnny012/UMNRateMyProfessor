var schedule = {};

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.msg == "schedule"){
        var conflict = getConflict(request);
        sendResponse({conflict: conflict});
    }
});c

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.msg == "syncSchedule"){
        schedule = request.schedule;
    }
});



function getConflict(request){
  for(var day in request.day){
	if(schedule[day] !== undefined){
		var time = timeToNumber(request.time);
		for(var currentTime in schedule[day]){
			if(currentTime.between(time)){
				return false;
			}
		}
	}
	
  }
  return true;
}
function timeToNumber(time){
    var start = time[0].match(/[0-9]+/g);
    var startOffset = time[0].search(/pm/);
    start = parseInt(start.join(""));
    if(startOffset != -1 && (start % 1200) > 59)
        start  += 1200;
    var end = time[1].match(/[0-9]+/g);
    var endOffset = time[1].search(/pm/);
    end = parseInt(end.join(""));
    if(endOffset != -1 && (end % 1200) > 59)
        end += 1200;
    return {	
	"start":start,
    "end":end,
    between:function(time){
        return (this.start >= time.start && this.start <= time.end) ||
                (this.end >= time.start  && this.end <= time.end) ||
                (this.start <= time.start && this.end >= time.end);   
    }};
}


