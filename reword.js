//this is the javascript for the popup

chrome.browserAction.onClicked.addListener(function(tab){
    chrome.tabs.executeScript(tab.id, {file:"content.js"});
    chrome.tabs.sendMessage(tab.id, {}, function(response){
	document.getElementById("test").innerHTML = response.message;
    });
});

