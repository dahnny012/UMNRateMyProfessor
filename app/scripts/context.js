  chrome.contextMenus.create(
  {
      "title": "Professor Reviews",
      "contexts":["all"],
      "onclick": function(){
       	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {cmd:"start"}, function(response) {
            });
          });
      }
  });