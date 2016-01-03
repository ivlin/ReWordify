/*
  This is the javascript attached to the popup box that appears when the extension is clicked
*/

chrome.tabs.executeScript(null, {file:"content.js"});

var sendInstructions = function sendInstructions(){
    if(document.getElementById("simplify").checked){
	chrome.tabs.query({active:true, currentWindow:true},function(tab){
	    chrome.tabs.sendMessage(tab[0].id, {mode:"simplify"}, function(response){
	    });
	});
    }else if(document.getElementById("complicate").checked){
	chrome.tabs.query({active:true, currentWindow:true},function(tab){
	    chrome.tabs.sendMessage(tab[0].id, {mode:"complicate"}, function(response){
	    });
	});
    }
};

document.getElementById("submit").addEventListener("click", sendInstructions);
