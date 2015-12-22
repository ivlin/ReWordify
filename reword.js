//this is the javascript for the popup

chrome.browserAction.onClicked.addListener(function(tab){
    chrome.tabs.executeScript(tab.id, {"file":"content.js",});
    //optional callback para
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    sendResponse()
});
