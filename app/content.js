var parse = new Parse();
var factory = new ProfNodeFactory();


function addNodes(node){
	
}

function openRating(e){
	if(e.target.className === "prof"){
			var node = createInfoNode(prof);
	}
}

function sendMsg(name,_class,target){
	chrome.runtime.sendMessage({msg: "ratemyprofessor",profName:name,profClass: _class},
	function(response){
		var node = 	createInfoNode(response,name);
		target.appendChild(node);
	});
}

chrome.runtime.onMessage.addListener(
	function(request,sender,sendResponse){
		var profs = parse.findProfessors();
		profs.forEach(addNodes);
	}
);