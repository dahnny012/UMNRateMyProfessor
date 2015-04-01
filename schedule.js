

var whiteRow = document.getElementsByClassName("white")
var coloredRow = document.getElementsByClassName("coloredtablerow")
var schedule = {};


// get all tds for white row
    for(var i=0; i<whiteRow.length; i++){
        var row = whiteRow[i];
        var tds = row.getElementsByTagname("td");
        var days = tds[3].textContent;
        var time = tds[5].textContent;
        addToSchedule(days,time);
        
    }
// get all tds for colored row
    for(i=0; i<coloredRow.length; i++){
        var row = coloredRow[i];
        var tds = row.getElementsByTagname("td");
        var days = tds[3].textContent;
        var time = tds[5].textContent;
        addToSchedule(days,time);
    }


function addToSchedule(days,time){
    days = days.match(/[MTWF]h*/g);
    time = time.match(/[0-9:]+ [(pm)(am)]/g);
    time = timeToNumber(time);
    
    days.forEach(function(day){
         if(schedule[day] === undefined)
            schedule[day] = [];
        schedule.push(time);
    });
}

function timeToNumber(time){
    // 10:00 pm ---  11:00 pm
    var start = time[0].match(/[0-9]+/);
    var startOffset = time[0].search(/pm/);
    start = parseInt(start.join(""));
    if(startOffset && start > 1259)
        start  += 1200;
    var end = time[1].match(/[0-9]+/);
    var endOffset = time[1].search(/pm/);
    if(endOffset && end > 1259)
        end += 1200;
    end = parseInt(end.join(""));
    return {"start":start,
    "end":end,
    between:function(time){
        return (time.start >= this.start && this.end <= time.start) ||
                (time.end >= this.start  && this.end <= time.end);
    }};
}