/*
  The content script is injected into every page and is used to interact with the DOM.
*/

var simplify = function simplify(){
    document.getElementsByTagName("title")[0].innerHTML = "SIMPLE";
}

var complicate = function complicate(){
    document.getElementsByTagName("title")[0].innerHTML = "COMPLEX";
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    /*
      Listens for a message from the background page (background.js)
      Request is the message. Request is a JSON object where mode is a string containing simplify or complicate.
    */
    switch(request.mode){
    case "simplify":
	simplify();
	break;
    case "complicate":
	complicate();
	break;
    default:
	break;
    }
});
