//this js is injected into the content

var test = function test(){
    document.getElementById("testid").innerHTML = "COMPLETE";
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    sendResponse();
});
