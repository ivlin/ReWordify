/*
  This is the javascript attached to the popup box that appears when the extension is clicked
*/

var sendInstructions = function sendInstructions(){
    var slider = document.getElementById("slider");
	getActiveTab().then(function(tab){
	    chrome.tabs.sendMessage(tab[0].id, {mode:slider.value});
	});
};

var getActiveTab = function getActiveTab(){
    return new Promise(function(resolve,reject){
	chrome.tabs.query({active:true,currentWindow:true},function(tab){
	    resolve(tab);
	});
    });
};

document.getElementById("submit").addEventListener("click", sendInstructions);


var UDL = function updateLabel(val) {
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

slider.addEventListener('mousedown', function(){
    UDL(slider.value);
});
slider.addEventListener('mousemove', function(){
    UDL(slider.value);
});

var button = document.getElementById("submit");
