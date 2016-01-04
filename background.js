/*
  Background page: ONE per chrome session, always running in background
  This page will be used to handle event listeners
*/


//there's probably a better way to do this
//codeInjected is a list of all the ids of tabs which the content page has been injected to
var codeInjected = [];

var simplify = function simplify(){
    //gets the current tab and sends a json object to the content script
    getActiveTab().then(function(tab){
	chrome.tabs.sendMessage(tab[0].id, {mode:"simplify"});
    });
};

var complicate = function complicate(){
    //gets the current tab and sends a json object to the content script
    getActiveTab().then(function(tab){
	chrome.tabs.sendMessage(tab[0].id, {mode:"complicate"});
    });
};

var getActiveTab = function getActiveTab(){
    return new Promise(function(resolve,reject){	
	chrome.tabs.query({active:true,currentWindow:true},
			  function(tab){
			      resolve(tab);
			  });
    });
};

chrome.browserAction.onClicked.addListener(function(tab){
    /*
      every time the extension button is clicked, it will try to inject the content script (content.js)
      it checks if the code has already been injected first
     */
    if (codeInjected.indexOf(tab.id) == -1){
	chrome.tabs.executeScript(tab.id, {file:"content.js"});
	codeInjected.push(tab.id);
    }
});
