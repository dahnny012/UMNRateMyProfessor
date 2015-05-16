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
	
	if(node.opened != undefined){
		removeLastChild(node);
		node.opened = undefined;
	}else{
		sendMsg(prof,parent);
		node.opened = true;
	}
}

function sendMsg(name,target){
	chrome.runtime.sendMessage({msg: "ratemyprofessor",profName:name,profClass:"CSCI1113"},
	function(response){
		target.appendChild(factory.infoNode(response.prof));
	});
};


function removeLastChild(target){
	var parent = target.parentElement;
	if(parent.childNodes.length > 1)
		parent.removeChild(parent.childNodes[2]); 
}


chrome.runtime.onMessage.addListener(
	function(request,sender,sendResponse){
	    parse = new Parse();
		var profs = parse.findProfessors();
		profs.forEach(addNodes);
	}
);


