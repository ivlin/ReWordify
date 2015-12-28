/*
  This is the javascript attached to the popup box that appears when the extension is clicked
*/

var sendInstructions = function sendInstructions(){
    if (document.getElementById("simplify")){
	chrome.extension.getBackgroundPage().simplify();
    }
    if (document.getElementById("complicate").checked){
	chrome.extension.getBackgroundPage().complicate();
    }
};

document.getElementById("submit").addEventListener("click",sendInstructions);
