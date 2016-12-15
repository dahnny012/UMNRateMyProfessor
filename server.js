var http = require("http");
var url = require("url");
var fs = require("fs")


http.createServer(function(req,res){
    var reqUrl = url.parse(req.url);
    res.end("");
    fs.appendFile("missing.txt",reqUrl.pathname+"\n");
    
}).listen(8080);