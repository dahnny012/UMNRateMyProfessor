var search = "http://onestop2.umn.edu/courseinfo/searchcriteria.jsp?campus=UMNTC&term=1159&resetCriteria=Y";
var schedule = "https://webapps-prd.oit.umn.edu/registration/initializeCurrentEnrollment.do?institution=UMNTC&resetInstitut";


document.body.addEventListener('click',function(e){
	if(e.target.id == "schedule"){
		chrome.tabs.create({url: schedule});
	}else{
		chrome.tabs.create({url:search});
	}
});

