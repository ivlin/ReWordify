//this js is injected into the content

var test = function test(){
    document.getElementById("test").innerHTML = "DONE";
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    test();
    sendResponse({"message":"WELL ELLO MATE"});
});
