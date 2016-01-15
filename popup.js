/*
  This is the javascript attached to the popup box that appears when the extension is clicked
*/

chrome.tabs.executeScript(null, {file:"jquery.js"});
chrome.tabs.executeScript(null, {file:"content.js"});

var sendInstructions = function sendInstructions(){
    if(document.getElementById("simplify").checked){
	getActiveTab().then(function(tab){
	    chrome.tabs.sendMessage(tab[0].id, {mode:"simplify"});
	});
    }else if(document.getElementById("complicate").checked){
	getActiveTab().then(function(tab){
	    chrome.tabs.sendMessage(tab[0].id, {mode:"complicate"});
	});
    }
};

var getActiveTab = function getActiveTab(){
    return new Promise(function(resolve,reject){
	chrome.tabs.query({active:true,currentWindow:true},function(tab){
	    resolve(tab);
	});
    });
}

document.getElementById("submit").addEventListener("click", sendInstructions);
