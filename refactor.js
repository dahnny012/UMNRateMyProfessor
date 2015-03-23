var fs = require("fs");
var regex = /[A-z-]+/;
var newTable = {};


// pretend the data is not in the background file.
var file = fs.readFileSync("data.json");

var oldTable = JSON.parse(file);


for(var name in oldTable){
    var lastName = name.match(regex)[0];
    if(newTable[lastName] == undefined){
        newTable[lastName] = [];    
    }
    var size =oldTable[name].length;
    for(var i=0; i<size; i++){
        newTable[lastName].push(oldTable[name][i]);
    }
}


fs.writeFileSync("newData.js","var profs ="+JSON.stringify(newTable));




