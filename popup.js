/*
  This is the javascript attached to the popup box that appears when the extension is clicked
*/

var sendInstructions = function sendInstructions(){
    if (document.getElementById("simplify").checked){
	chrome.runtime.getBackgroundPage(function(page){
	    page.simplify();
	});
    }
    if (document.getElementById("complicate").checked){
	chrome.runtime.getBackgroundPage(function(page){
	    page.complicate();
	});
    }
};

document.getElementById("submit").addEventListener("click",sendInstructions);
