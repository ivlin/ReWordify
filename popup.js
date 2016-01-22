/*
  This is the javascript attached to the popup box that appears when the extension is clicked
*/

chrome.tabs.executeScript(null, {file:"jquery.js"});
chrome.tabs.executeScript(null, {file:"content.js"});

/*var sendInstructions = function sendInstructions(){
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
*/
console.log("loaded");
var UDL = function updateLabel(val) {
    console.log(val);
    var label = document.getElementById("sliderLabel");
    if(val==0)
	label.innerHTML = "Very Easy";
    if(val==25)
	label.innerHTML = "Easy";
    if(val==50)
	label.innerHTML = "Regular";
    if(val==75)
	label.innerHTML = "Hard";
    if(val==100)
	label.innerHTML = "Very Hard";
}

var slider = document.getElementById("slider");
document.addEventListener('change', function(){
    UDL(slider.value);
});
document.addEventListener('mousedown', function(){
    UDL(slider.value);
});
document.addEventListener('mousemove', function(){
    UDL(slider.value);
});
