// Called when the user clicks on the browser action.

// Browser Action = chrome button
// Passes the Active tab
chrome.browserAction.onClicked.addListener(function(tab) {
  // No tabs or host permissions needed!
  console.log('Turning ' + tab.url + ' red!');
  // Like exec
  chrome.tabs.executeScript({
	  // JS code to execute
    code: 'document.body.style.backgroundColor="red"'
  });
});
