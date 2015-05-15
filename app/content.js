var parse;
var factory = new ProfNodeFactory();


function addNodes(node){	
	var button = factory.buttonNode(
	    {handler:openRating}
	);
	node.appendChild(button);
}


function openRating(e){
	var node = e.target;
	var parent = e.target.parentElement;
	var prof = parent.innerText;
	console.log(prof);
	parent.appendChild(factory.infoNode());
}

function sendMsg(name,_class,target){
	chrome.runtime.sendMessage({msg: "ratemyprofessor",profName:name,profClass: _class},
	function(response){
		var node = 	factory.infoNode(response,name);
		target.appendChild(node);
	});
}

chrome.runtime.onMessage.addListener(
	function(request,sender,sendResponse){
	    parse = new Parse();
		var profs = parse.findProfessors();
		profs.forEach(addNodes);
	}
);

