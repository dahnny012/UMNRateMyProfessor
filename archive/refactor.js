var fs = require("fs");
var regex = /[A-z-]+/;
var newTable = {};
var inFn = process.argv[2];
var outFn = inFn.match("[A-z]+")[0]+"Out.json";

// pretend the data is not in the background file.
var file = fs.readFileSync(inFn);

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


fs.writeFileSync(outFn,JSON.stringify(newTable));




