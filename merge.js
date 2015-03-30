var fs = require("fs");

var profs = []

for(var i=0; i<8; i++){
    profs.push(require("./data"+i+".js").testProfs);
}

var table  = {};

for(var i =0; i<8; i++) {
    for (var prof in profs[i]) {
        if(table[prof] == undefined){
            table[prof] = [];
        }
        for(var k=0; k<profs[i][prof].length; k++) {
            table[prof].push(profs[i][prof][k]);
        }
    }
}

fs.writeFileSync("profs.js","var profs="+JSON.stringify(table));




