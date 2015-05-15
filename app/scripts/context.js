  chrome.contextMenus.create(
  {
      "title": "Run Script",
      "contexts":["all"],
      "onclick": function(){
       	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {text:"getStuff"}, function(response) {
            });
          });
      }
  });