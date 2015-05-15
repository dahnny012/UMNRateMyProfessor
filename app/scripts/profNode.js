function ProfNodeFactory(){

}

ProfNodeFactory.prototype.icon = "http://icons.iconarchive.com/icons/wineass/ios7-redesign/512/Sample-icon.png";
;

ProfNodeFactory.prototype.eventNode = function(obj){
	var image = new Image();
	image.src = this.icon;
	image.style.width = "20px";
	image.style.height = "20px";
	image.className = "prof"; 
	image.addEventListener("click",obj.handler);
	return image;
};

ProfNodeFactory.prototype.infoNode = function(){
			
};


ProfNodeFactory.prototype.reviewNode = function(){
	
};

