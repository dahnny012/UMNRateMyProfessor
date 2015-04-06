

function scheduleInit(){
	var schedule = {};
	var whiteRow = document.getElementsByClassName("white");
	var coloredRow = document.getElementsByClassName("coloredtablerow");
	scrapeRow(whiteRow,schedule);
	scrapeRow(coloredRow,schedule);
	console.log(schedule);
	chrome.runtime.sendMessage({msg: "syncSchedule",schedule:schedule});
}
    
function scrapeRow(htmlRow,schedule){
	 for(i=0; i<htmlRow.length; i++){
        var row = htmlRow[i];
        var tds = row.getElementsByTagName("td");
        var days = tds[3].textContent;
        var time = tds[5].textContent;
        var classes = tds[1].textContent.match(/[A-z0-9]+/g).join(" ");
        addToSchedule(days,time,classes,schedule);
    }
}    
    
    
function addToSchedule(days,time,classes,schedule){
    days = days.match(/[MTWF]h*/g);
    time = time.match(/[0-9:]+ [(pm)(am)]+/g);
    time = timeToNumber(time);
	time['class'] = classes;
    days.forEach(function(day){
         if(schedule[day] === undefined)
            schedule[day] = [];
        schedule[day].push(time);
    });
}




function runTests(){
    // basic cases
    var base = timeToNumber(["1:00 pm","2:00 pm"]);
    var fails = [];
    console.log(base);
    // Should fail
    fails.push(timeToNumber(["1:01 pm","2:01 pm"]));
    fails.push(timeToNumber(["12:59 pm","2:02 pm"]));
    fails.push(timeToNumber(["11:59 am","1:59 pm"]));
    fails.push(timeToNumber(["11:59 am","5:00 pm"]));
    fails.push(timeToNumber(["1:00 pm","2:00 pm"]));
    fails.push(timeToNumber(["1:00 am","2:00 pm"]));
    
    fails.forEach(function(e){
        if(!base.between(e)){
			console.log(e);
            throw "Error";
        }
    });
    
    var passes = [];
    passes.push(timeToNumber(["11:59 am","12:59 pm"]));
    passes.push(timeToNumber(["2:01 am","12:59 pm"]));
    passes.push(timeToNumber(["2:01 pm","11:59 pm"]));
    passes.push(timeToNumber(["1:00 am","12:59 pm"]));
    
    
    passes.forEach(function(e){
        if(base.between(e)){
			console.log(e);
            throw "Error";
        }
    });
}



