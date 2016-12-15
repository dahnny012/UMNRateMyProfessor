var map = {};
var fs = require("fs");
var lazy = require("lazy");
var count =0;
var fileStream = fs.createReadStream("missing.txt");

fileStream.on("end",function(){
    fs.writeFile("missing.json",JSON.stringify(map));
})
new lazy(fileStream).lines
.forEach(function(data){
    var prof = data.toString();;
    prof = prof.replace(/[\/%20]+/g,"");
    if(prof === "")
        return;
    if(map[prof] === undefined){
        map[prof] = prof.match(/[A-z-]+/)[0];
    }
});

