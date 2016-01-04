/*
  The content script is injected into every page and is used to interact with the DOM.
*/

var simplify = function simplify(){
    document.getElementById("test").innerHTML = "SIMPLE";
}

var complicate = function complicate(){
    document.getElementById("test").innerHTML = "HARD";
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    /*
      Listens for a message from the background page (background.js)
      Request is the message. It can be of any type.
      Currently, request is a JSON object where mode is a string containing simplify or complicate.
    */
    switch (request.mode){
    case "simplify":
	simplify();
	break;
    case "complicate":
	complicate();
	break;
    default:
	break;
    }
    sendResponse();//optional - returns a value of any data type to the call in the background page
});
