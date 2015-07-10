function main() {
    var program = require("commander");
    var cheerio = require('cheerio');
    var pretty =  require("prettyjson")
    var fs = require("fs");
    var async = require("async");
    var counter = 0;
    var http = require('http');
    var table = {};
    var offset = 0;
    var max = -1;
    var query = "";
    
    // Applies a function to a page
    function getPage(fn, options, args) {
        var callback = function(response) {
            var body = '';
            response.on('data', function(chunk) {body += chunk;});
            //the whole response has been recieved, so we just print it out here
            response.on('end', function() {
                fn(body, args);}
            );
            response.on('error', function() {console.log("ERRORED OUT");});
        }
        http.request(options, callback).end();
    }


    function search(offset) {
            var options = {
                host: 'www.ratemyprofessors.com',
                path: '/search.jsp?query='+query+'&queryoption=HEADER&stateselect=&country=&dept=&queryBy=&facetSearch=&schoolName=&offset=' + offset + '&max=20',
                keepAlive: true
            };
        
            getPage(function(body) {
                    $ = cheerio.load(body);
                    // Init the max
                    if(max == -1){
                        var regex = /[0-9-]+/g;
                        var resultString = $(".result-count").last().text();
                        var filtered = resultString.match(regex);
                        max = Math.abs(parseInt(filtered[1])) - 20;
                        if(max <= -20){
                            return;
                        }
                    }
                    var professorsOnPage = $("li[class='listing PROFESSOR']");
                    async.each(professorsOnPage,
                    function(element,cb) {
                        element = $(element);
                        var profPage = element.children("a").attr('href')
                        var profName = element.find('.main').text();
                        var profOptions = {
                            host: 'www.ratemyprofessors.com',
                            path: profPage,
                            keepAlive: true
                        };
                        getPage(function(body) {
                            $ = cheerio.load(body);
                            var avgGrade = getGrade($);
                            var rating = getRating($);
                            var classes = getClasses($);
                            var scores = getScores($);
                            var reviews = getReviews($);
                            var metrics = {
                                "rating": rating,
                                "avgGrade": avgGrade,
                                "scores": scores
                            };
                            var prof = createProf(profName, classes, metrics, reviews);
                            prof["link"] = "www.ratemyprofessors.com" + profPage;
                            addProf(prof, table)
                            cb();
                        }, profOptions, offset);
                    },function(err){
                        if(err){
                            console.log(err());
                            return;
                        }
                        if(offset < max) {
                            startSearch();
                        }else{
                            if(program.save){
                                fs.writeFile(program.save,JSON.stringify(table));
                            }else{
                                console.log(pretty.render(table));
                            }
                        }
                    })
                },
                options);
        }

    function getClasses($) {
        var classes = {};
        $(".tftable").find(".name").each(function(i, elem) {
            var _class = $(this).find(".response").text().toUpperCase().replace(/ /, '', 'g');
            classes[_class] = _class;
        });
        return classes;
    }

    function getGrade($) {
        var grade = $(".grade").slice(1).first().text();
        return grade;
    }

    function getRating($) {
        var grade = $(".grade").first().text();
        return grade;
    }

    function getScores($) {
        var sliders = $(".faux-slides").find(".rating-slider");
        var scores = [];
        sliders.each(function(i, ele) {
            var label = $(this).find(".label").text();
            var score = $(this).find(".rating").text();
            scores.push(label + " " + score);
            //console.log(label + " " + score);
        });
        return scores
    }

    function getReviews() {
        var reviews = $(".tftable").find("tr").slice(1);
        if (reviews.length == 0) {
            console.log("quitting")
            return;
        }
        var count = 3;
        var i = 0;
        var size = reviews.length;

        var reviewsTable = {};
        while (count > 0 && reviews.length != i) {
            var query = $(reviews[i])
            var _class = query.find(".name").find(".response").text().toUpperCase()
                // Check if already been reviewed
            if (reviewsTable[_class] == undefined && _class != '') {
                var review = {};
                var date = query.find(".date").text();
                count--;
                var textbook = query.find(".textbook-use").text();
                var avg = 0;
                query.find(".score").each(function(i, ele) {
                    var score = parseInt($(this).text());
                    avg += score;
                });
                avg = (avg / 3).toFixed(2);
                var reviewText = query.find(".comments").find("p").text()
                review["class"] = _class;
                review["date"] = date;
                review["textbook"] = textbook;
                review["score"] = avg;
                review["review"] = reviewText;
                reviewsTable[_class] = review;
            }
            i++;
        }
        return reviewsTable;
    }


    function createProf(name, classes, metrics, reviews) {
        return {
            "name": name,
            "metrics": metrics,
            "classes": classes,
            "reviews": reviews
        }
    }

    function addProf(prof, table) {
        if (table[prof.name] === undefined) {
            table[prof.name] = [prof]
        }
        else {
            table[prof.name].push(prof)
        }
    }

    function startSearch(){
        setTimeout(function(){
            search(offset);
            offset += 20;
        },0);
    }
    
    program
        .option("find [query]","Queries for a teacher/teachers in a organization")
        .option("-s, --save [filename]","Saves the results to a json file")
        .parse(process.argv);
    if(program.find){
        query = program.find.replace(/ /g,"+");
        startSearch();
    }
    
    if (!process.argv.slice(2).length) {
        program.outputHelp();
    }
}

main();